type Complexity = {
  time: string;
  space: string;
};

export function analyzeComplexity(code: string, language: string): Complexity {
  const lowerCode = code.toLowerCase();
  let time = 'O(1)';
  let space = 'O(1)';

  // First check for Java class and method patterns
  const javaInfo = language.toLowerCase() === 'java' ? analyzeJavaStructure(code) : null;
  
  // Check for n-queens pattern and other backtracking problems
  if (hasBacktrackingPattern(lowerCode, language)) {
    time = 'O(n!)'; // Default factorial complexity for n-queens
    space = 'O(n^2)'; // Space for board state
    return { time, space };
  }

  // Check for recursive patterns
  const recursionInfo = analyzeRecursion(code, language);
  if (recursionInfo.hasRecursion) {
    if (recursionInfo.isPermutation) {
      time = 'O(n!)';
      space = 'O(n)';
    } else if (recursionInfo.multipleRecursiveCalls) {
      if (recursionInfo.processesAllElements) {
        time = 'O(n*2^n)';
      } else {
        time = 'O(2^n)';
      }
      space = 'O(n)';
    } else if (recursionInfo.isDivideAndConquer) {
      time = recursionInfo.processesAllElements ? 'O(n log n)' : 'O(log n)';
      space = 'O(log n)';
    } else {
      time = 'O(n)';
      space = 'O(n)';
    }
  }
interface LoopInfo {
  nestedCount: number;
  hasFactorialPattern: boolean;
}

function analyzeLoops(code: string, language: string): LoopInfo {
  const lines = code.split('\n');
  let maxNesting = 0;
  let currentNesting = 0;
  let hasFactorialPattern = false;
  let timeComplexity = 'O(1)'; // Default complexity

  const loopPatterns = language === 'python'
    ? [/for\s+.*:/i, /while\s+.*:/i]
    : [/for\s*\(/i, /while\s*\(/i, /do\s*{?/i];

  const factorialPatterns = [
    /\b(n!|factorial|permute|perm)\b/i,
    /for\s*\(.*n-1.*\)/i
  ];

  for (const line of lines) {
    if (loopPatterns.some(pattern => pattern.test(line))) {
      currentNesting++;
      maxNesting = Math.max(maxNesting, currentNesting);

      // Analyze the range or bounds for the for loop
      if (line.includes('for')) {
        const match = line.match(/for\s*\(.*;.*;.*\)/);
        if (match) {
          const loopStatement = match[0];
          // Extract the loop's range, e.g., from 'for (let i = 0; i < n; i++)'
          const rangeMatch = loopStatement.match(/for\s*\(.*\s*=\s*(\d+)\s*;\s*\w+\s*<\s*(\w+)\s*;/);
          if (rangeMatch) {
            const startValue = parseInt(rangeMatch[1]);
            const endVariable = rangeMatch[2];
            if (endVariable === 'n') {
              timeComplexity = 'O(n)';
            }
          }
        }
      }

    } else if (line.includes('}')) {
      currentNesting = Math.max(0, currentNesting - 1);
    }

    if (factorialPatterns.some(pattern => pattern.test(line))) {
      hasFactorialPattern = true;
    }
  }

  return { nestedCount: maxNesting, hasFactorialPattern, timeComplexity };
}


  // Check for nested loops
const loopInfo = analyzeLoops(lowerCode, language);
if (loopInfo.hasFactorialPattern) {
  time = 'O(n!)';
} else if (loopInfo.nestedCount > 0) {
  const loopComplexity = `O(n^${loopInfo.nestedCount})`;
  time = compareComplexities(time, loopComplexity);
}


  // Use Java-specific analysis if available
  if (javaInfo && javaInfo.complexity) {
    time = compareComplexities(time, javaInfo.complexity);
  }

  // Check for logarithmic patterns
  if (hasLogarithmicComplexity(lowerCode)) {
    const logComplexity = 'O(log n)';
    time = compareComplexities(time, logComplexity);
  }

  // Check for sorting operations
  if (hasSortingOperation(lowerCode)) {
    const sortComplexity = 'O(n log n)';
    time = compareComplexities(time, sortComplexity);
  }

  // Update space complexity for data structures
  if (createsNewDataStructure(lowerCode)) {
    const dataStructureSpace = loopInfo.nestedCount > 1 ? `O(n^${loopInfo.nestedCount})` : 'O(n)';
    space = compareComplexities(space, dataStructureSpace);
  }

  return { time, space };
}

interface JavaAnalysis {
  complexity: string | null;
  hasBacktracking: boolean;
}

function analyzeJavaStructure(code: string): JavaAnalysis {
  const analysis: JavaAnalysis = {
    complexity: null,
    hasBacktracking: false
  };

  // Java-specific patterns
  const classPattern = /class\s+(\w+)\s*{/g;
  const methodPattern = /(?:public|private|protected)?\s*(?:static)?\s*\w+\s+(\w+)\s*\([^)]*\)\s*{/g;

  let match;
  while ((match = methodPattern.exec(code)) !== null) {
    const methodName = match[1].toLowerCase();
    const methodStart = match.index;
    const methodBody = extractMethodBody(code, methodStart);

    // Check for specific method patterns in Java
    if (methodName.includes('solve') || methodName.includes('backtrack')) {
      if (/void\s+solve|boolean\s+solve/.test(code)) {
        analysis.hasBacktracking = true;
      }
    }

    // Check for recursive methods with specific Java patterns
    if (methodBody.includes(methodName)) {
      const recursivePatterns = [
        new RegExp(`return\\s+${methodName}\\s*\\(`),
        new RegExp(`${methodName}\\s*\\([^)]*\\)\\s*;`)
      ];

      if (recursivePatterns.some(pattern => pattern.test(methodBody))) {
        if (/for\s*\([^)]*\)\s*{[^}]*for\s*\([^)]*\)/.test(methodBody)) {
          analysis.complexity = 'O(n^2)';
        }
      }
    }
  }

  return analysis;
}

function extractMethodBody(code: string, start: number): string {
  let braceCount = 0;
  let methodBody = '';
  let inMethod = false;

  for (let i = start; i < code.length; i++) {
    if (code[i] === '{') {
      braceCount++;
      if (!inMethod) inMethod = true;
    } else if (code[i] === '}') {
      braceCount--;
      if (braceCount === 0 && inMethod) {
        break;
      }
    }
    if (inMethod) {
      methodBody += code[i];
    }
  }

  return methodBody;
}

function hasBacktrackingPattern(code: string, language: string): boolean {
  const backtrackingPatterns = [
    // N-Queens specific patterns
    /n-queens|nqueens|n_queens/i,
    /(check|is)_safe.*queen/i,
    /place.*queen/i,
    // Java-specific patterns
    /boolean\s+solve\s*\([^)]*\)/i,
    /void\s+solve\s*\([^)]*\)/i,
    /boolean\s+isSafe\s*\([^)]*\)/i,
    // General backtracking patterns
    /solve.*board/i,
    /check.*diagonal/i,
    /check.*row.*col/i,
    /backtrack/i,
    /(solve|find).*util/i,
    /is_safe|isSafe/,
    // Common backtracking parameter patterns
    /\(\s*board\s*,\s*\d+\s*\)/,
    /\(\s*grid\s*,\s*\d+\s*,\s*\d+\s*\)/
  ];

  // Add Java-specific patterns if language is Java
  if (language.toLowerCase() === 'java') {
    backtrackingPatterns.push(
      /void\s+backtrack\s*\(/i,
      /boolean\s+backtrack\s*\(/i,
      /List<List<String>>\s+solve/i,
      /ArrayList<String>\s+solve/i
    );
  }

  return backtrackingPatterns.some(pattern => pattern.test(code));
}

function analyzeRecursion(code: string, language: string): RecursionInfo {
  const info: RecursionInfo = {
    hasRecursion: false,
    isDivideAndConquer: false,
    multipleRecursiveCalls: false,
    processesAllElements: false,
    isPermutation: false
  };

  // Handle Java method patterns
  const methodPattern = language.toLowerCase() === 'java' 
    ? /(?:public|private|protected)?\s*(?:static)?\s*\w+\s+(\w+)\s*\([^)]*\)\s*{([^}]*)}/g
    : /function\s+(\w+)\s*\([^)]*\)\s*{([^}]*)}/g;

  let match;
  while ((match = methodPattern.exec(code)) !== null) {
    const functionName = match[1];
    const functionBody = match[2];

    // Check if method calls itself
    const recursiveCallPattern = new RegExp(`\\b${functionName}\\s*\\(`, 'g');
    const recursiveCalls = functionBody.match(recursiveCallPattern);

    if (recursiveCalls) {
      info.hasRecursion = true;
      
      // Check for permutation patterns
      if (/permut|factorial/i.test(functionName) || 
          /swap.*for.*recursive/i.test(functionBody)) {
        info.isPermutation = true;
      }

      // Count recursive calls
      const callCount = (functionBody.match(recursiveCallPattern) || []).length;
      if (callCount > 1) {
        info.multipleRecursiveCalls = true;
      }

      // Check for divide and conquer patterns
      if (/(\/?2|\*\s*0\.5|>>>\s*1|>>\s*1)/.test(functionBody) &&
          /mid|middle|pivot/.test(functionBody)) {
        info.isDivideAndConquer = true;
      }

      // Check if processing all elements
      if (/for|while|\.forEach|enhanced-for/.test(functionBody)) {
        info.processesAllElements = true;
      }
    }
  }

  return info;
}


function hasLogarithmicComplexity(code: string): boolean {
  const logarithmicPatterns = [
    // Division by 2 patterns
    /(\/?2|\*\s*0\.5|>>>\s*1|>>\s*1)/,
    // Binary search patterns
    /mid|middle|pivot/,
    // Explicit logarithmic operations
    /Math\.log|math\.log|log\(/,
    // Binary tree operations
    /left\s*=\s*2\s*\*|right\s*=\s*2\s*\*/,
    // While loop with division
    /while[^{]*(?:\/|\*\s*0\.5|>>|\>>>)[^{]*{/,
    // Binary search tree traversal
    /if\s*\([^)]*(?:left|right)\s*[!=]=\s*null/
  ];

  return logarithmicPatterns.some(pattern => pattern.test(code));
}

function hasSortingOperation(code: string): boolean {
  const sortingPatterns = [
    /\.sort\s*\(/,
    /sort\s*\(/,
    /sorted\s*\(/,
    /quicksort/i,
    /mergesort/i,
    /heapsort/i
  ];

  return sortingPatterns.some(pattern => pattern.test(code));
}

 function countNestedLoops(code: string, language: string): number {
  const lines = code.split('\n');
  let maxNesting = 0;
  let currentNesting = 0;
  let inDoWhileBlock = false;
  let inPrintingBlock = false;
  
  // Enhanced patterns to catch all loop types
  const loopStartPatterns = language === 'python' 
    ? [
        /\s*for\s+.*:/i,
        /\s*while\s+.*:/i
      ]
    : [
        /\s*for\s*\(/i,
        /\s*while\s*\(/i,
        /\s*do\s*({|\s*$)/i
      ];

  // Patterns to identify printing/traversal loops
  const printingPatterns = [
    /cout|print|console\.log|System\.out/i,
    /display|show|output/i,
    /traverse|traversal/i,
    /\b(print|display|show)_list\b/i
  ];
  
  const blockEndPattern = language === 'python' 
    ? /^(\s*)(return|break|continue|pass|else|elif)/i
    : /^\s*[}]\s*$/;

  const doWhileEndPattern = /^\s*}\s*while\s*\([^)]*\)\s*;/;

  let indentationStack: number[] = [];
  let previousIndentation = 0;
  let functionStack: string[] = [];
  let blockStack: string[] = [];
  let whileLoopCount = 0;

  // Helper function to check if we're in a printing/traversal context
  function isInPrintingContext(currentLine: string, nextLine: string = '', prevLine: string = ''): boolean {
    // Check if we're in a print or display function
    const inPrintFunction = functionStack.some(func => 
      /print|display|show|output|traverse/i.test(func)
    );

    // Check for printing operations in surrounding context
    const hasPrintingOperation = printingPatterns.some(pattern => 
      pattern.test(prevLine) || pattern.test(currentLine) || pattern.test(nextLine)
    );
    
    // Check for simple traversal patterns
    const isSimpleTraversal = (
      // Common pointer movement patterns
      /^\s*(ptr|temp|current|cur)\s*=\s*\1->(next|prev)\s*;/.test(currentLine) ||
      // List/tree traversal patterns for printing
      (/^\s*while\s*\(\s*(ptr|temp|current|cur)\s*!=\s*null\s*\)/.test(currentLine) &&
       (printingPatterns.some(pattern => pattern.test(nextLine)) || /cout|print|console/i.test(blockStack.join(' ')))) ||
      // Array printing patterns
      (/^\s*for\s*\(\s*int\s+i\s*=\s*0\s*;\s*i\s*<\s*n\s*;\s*i\s*\+\+\s*\)\s*{\s*$/.test(currentLine) &&
       printingPatterns.some(pattern => pattern.test(nextLine)))
    );

    // Check if we're in a printing/display block
    const inPrintingBlock = blockStack.some(block => 
      /print|display|show|output|traverse/i.test(block)
    );

    return inPrintFunction || hasPrintingOperation || isSimpleTraversal || inPrintingBlock;
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const nextLine = i < lines.length - 1 ? lines[i + 1] : '';
    const prevLine = i > 0 ? lines[i - 1] : '';
    const currentIndentation = line.search(/\S|$/);

    // Track function context
    if (line.includes('function') || line.includes('void') || line.match(/\w+\s*\([^)]*\)\s*{/)) {
      functionStack.push(line);
      blockStack.push(line);
    }

    // Track block context
    if (line.includes('{')) {
      blockStack.push(line);
    }

    if (blockEndPattern.test(line)) {
      if (blockStack.length > 0) {
        blockStack.pop();
      }
      if (functionStack.length > 0 && line.includes('}')) {
        functionStack.pop();
      }
    }

    if (language === 'python') {
      if (currentIndentation < previousIndentation) {
        while (indentationStack.length > 0 && 
               indentationStack[indentationStack.length - 1] >= currentIndentation) {
          indentationStack.pop();
          currentNesting--;
        }
      }
    }

    // Check for loop starts
    for (const pattern of loopStartPatterns) {
      if (pattern.test(line)) {
        // Ignore if this is a printing/traversal loop
        if (!isInPrintingContext(line, nextLine, prevLine)) {
          if (line.trim().startsWith('do')) {
            inDoWhileBlock = true;
          } else if (pattern.toString().includes('while')) {
            whileLoopCount++;
          }
          currentNesting++;
          if (language === 'python') {
            indentationStack.push(currentIndentation);
          }
          maxNesting = Math.max(maxNesting, currentNesting);
        }
        break;
      }
    }
    
    // Handle do-while end
    if (doWhileEndPattern.test(line)) {
      if (inDoWhileBlock) {
        inDoWhileBlock = false;
      }
    }
    // Check for block ends in bracket-based languages
    else if (!language.includes('python') && blockEndPattern.test(line)) {
      if (!inDoWhileBlock && !isInPrintingContext(line, nextLine, prevLine)) {
        currentNesting = Math.max(0, currentNesting - 1);
      }
    }

    previousIndentation = currentIndentation;
  }

  // Ensure maxNesting is at least 1 if we have any non-printing while loops
  return Math.max(maxNesting, whileLoopCount > 0 ? 1 : 0);
}
function createsNewDataStructure(code: string): boolean {
  const patterns = [
    /new\s+(Array|Map|Set|WeakMap|WeakSet|Node|TreeNode|ListNode)/i,
    /\[\s*\]/,
    /\{\s*\}/,
    /new\s+(\w+)\[\s*\]/i,
    /list\(\)/i,
    /dict\(\)/i,
    /set\(\)/i,
    /(array|arraylist|vector|list)<.*>/i,
    /new\s+Array\(\d+\)/i,
    /malloc\s*\(\s*sizeof\s*\(/i  // C/C++ memory allocation
  ];
  return patterns.some(pattern => pattern.test(code));
}

function compareComplexities(current: string, new_complexity: string): string {
  const complexityOrder: { [key: string]: number } = {
    'O(1)': 1,
    'O(log log n)': 2,
    'O(log n)': 3,
    'O(n)': 4,
    'O(n log n)': 5,
    'O(n^2)': 6,
    'O(n^3)': 7,
    'O(2^n)': 8
  };
  
  const currentValue = complexityOrder[current] || 0;
  const newValue = complexityOrder[new_complexity] || 0;
  
  return newValue > currentValue ? new_complexity : current;
}