type Complexity = {
  time: string;
  space: string;
};

interface RecursionInfo {
  hasRecursion: boolean;
  isDivideAndConquer: boolean;
  multipleRecursiveCalls: boolean;
  processesAllElements: boolean;
  isPermutation: boolean;
}

interface LoopInfo {
  nestedCount: number;
  hasFactorialPattern: boolean;
  timeComplexity: string;
}

interface JavaAnalysis {
  complexity: string | null;
  hasBacktracking: boolean;
}

export function analyzeComplexity(code: string, language: string): Complexity {
  const lowerCode = code.toLowerCase();
  let time = 'O(1)';
  let space = 'O(1)';

  if (hasBinarySearch(code)) {
    time = 'O(log n)';
    space = 'O(1)';
    return { time, space };
  }

  const javaInfo = language.toLowerCase() === 'java' ? analyzeJavaStructure(code) : null;
  
  if (hasBacktrackingPattern(lowerCode, language)) {
    time = 'O(n!)';
    space = 'O(n^2)';
    return { time, space };
  }

  const recursionInfo = analyzeRecursion(code, language);
  if (recursionInfo.hasRecursion) {
    if (recursionInfo.isPermutation) {
      time = 'O(n!)';
      space = 'O(n)';
    } else if (recursionInfo.multipleRecursiveCalls) {
      time = recursionInfo.processesAllElements ? 'O(n*2^n)' : 'O(2^n)';
      space = 'O(n)';
    } else if (recursionInfo.isDivideAndConquer) {
      time = recursionInfo.processesAllElements ? 'O(n log n)' : 'O(log n)';
      space = 'O(log n)';
    } else {
      time = 'O(n)';
      space = 'O(n)';
    }
  }

  const loopInfo = analyzeLoops(lowerCode, language);
  if (loopInfo.hasFactorialPattern) {
    time = 'O(n!)';
  } else if (loopInfo.nestedCount > 0) {
    time = loopInfo.timeComplexity;
  }

  // Check for sorting patterns first
  if (hasSortingOperation(lowerCode)) {
    const sortComplexity = 'O(n log n)';
    time = compareComplexities(time, sortComplexity);
    // Update space complexity for merge sort-like patterns
    if (hasMergeSortPattern(lowerCode)) {
      space = 'O(n)';
    }
  }

  if (hasLogarithmicComplexity(lowerCode)) {
    time = compareComplexities(time, 'O(log n)');
  }

  if (createsNewDataStructure(lowerCode)) {
    const dataStructureSpace = loopInfo.nestedCount > 1 ? `O(n^${loopInfo.nestedCount})` : 'O(n)';
    space = compareComplexities(space, dataStructureSpace);
  }

  return { time, space };
}

function hasSortingOperation(code: string): boolean {
  const sortingPatterns = [
    /\.sort\s*\(/,
    /sort\s*\(/,
    /sorted\s*\(/,
    /quicksort/i,
    /mergesort/i,
    /heapsort/i,
    /Arrays\.sort/,
    /Collections\.sort/,
    /\bsort\b.*\barr/i,
    /\bsort\b.*\blist/i,
    /partition.*pivot/i,
    /merge.*left.*right/i
  ];

  return sortingPatterns.some(pattern => pattern.test(code));
}

function hasMergeSortPattern(code: string): boolean {
  const mergeSortPatterns = [
    /merge.*left.*right/i,
    /mergesort/i,
    /merge_sort/i,
    /void\s+merge\s*\(/i,
    /merge.*arrays/i,
    /split.*merge/i
  ];

  return mergeSortPatterns.some(pattern => pattern.test(code));
}

function hasBinarySearch(code: string): boolean {
  const binarySearchPatterns = [
    /binary.*search/i,
    /\b(?:left|right|start|end|low|high|mid|middle)\b/,
    /(?:mid|middle)\s*=.*(?:\/\s*2|>>\s*1|\+\s*\/\s*2)/,
    /(?:left|start|low)\s*=\s*mid/,
    /(?:right|end|high)\s*=\s*mid/,
    /while\s*\(\s*(?:left|start|low)\s*[<≤]=?\s*(?:right|end|high)/,
    /arr\s*\[\s*mid\s*\]/,
    /nums\s*\[\s*mid\s*\]/,
    /array\s*\[\s*mid\s*\]/,
    /if\s*\([^)]*==\s*target\)/,
    /if\s*\([^)]*<\s*target\)/,
    /if\s*\([^)]*>\s*target\)/
  ];

  return binarySearchPatterns.reduce((count, pattern) => 
    count + (pattern.test(code) ? 1 : 0), 0) >= 3;
}

function analyzeLoops(code: string, language: string): LoopInfo {
  const lines = code.split('\n');
  let maxNesting = 0;
  let currentNesting = 0;
  let hasFactorialPattern = false;
  let timeComplexity = 'O(1)';

  const loopPatterns = language === 'python'
    ? [/for\s+.*:/i, /while\s+.*:/i]
    : [/for\s*\(/i, /while\s*\(/i, /do\s*{?/i];

  const factorialPatterns = [
    /\b(n!|factorial|permute|perm)\b/i,
    /for\s*\(.*n-1.*\)/i
  ];

  let braceStack = 0;
  let foundLoop = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    if (loopPatterns.some(pattern => pattern.test(line))) {
      foundLoop = true;
      currentNesting++;
      maxNesting = Math.max(maxNesting, currentNesting);
      
      if (language === 'java' && !line.includes('{')) {
        const nextLine = i < lines.length - 1 ? lines[i + 1].trim() : '';
        if (!nextLine.startsWith('{')) {
          currentNesting--;
        }
      }
    }

    if (line.includes('{')) braceStack++;
    if (line.includes('}')) {
      braceStack--;
      if (braceStack === 0 && foundLoop) currentNesting--;
    }

    if (factorialPatterns.some(pattern => pattern.test(line))) {
      hasFactorialPattern = true;
    }
  }

  if (hasBinarySearch(code)) {
    timeComplexity = 'O(log n)';
  } else if (hasSortingOperation(code)) {
    timeComplexity = 'O(n log n)';
  } else if (maxNesting === 1) {
    timeComplexity = 'O(n)';
  } else if (maxNesting > 1) {
    timeComplexity = `O(n^${maxNesting})`;
  }

  return { nestedCount: maxNesting, hasFactorialPattern, timeComplexity };
}

function analyzeJavaStructure(code: string): JavaAnalysis {
  const analysis: JavaAnalysis = {
    complexity: null,
    hasBacktracking: false
  };

  const methodPattern = /(?:public|private|protected)?\s*(?:static)?\s*\w+\s+(\w+)\s*\([^)]*\)\s*{/g;
  let match;

  while ((match = methodPattern.exec(code)) !== null) {
    const methodName = match[1].toLowerCase();
    const methodStart = match.index;
    const methodBody = extractMethodBody(code, methodStart);

    if (hasBinarySearch(methodBody)) {
      analysis.complexity = 'O(log n)';
    } else if (hasSortingOperation(methodBody)) {
      analysis.complexity = 'O(n log n)';
    } else {
      const loopInfo = analyzeLoops(methodBody, 'java');
      if (loopInfo.nestedCount > 0) {
        analysis.complexity = loopInfo.timeComplexity;
      }
    }

    if (methodName.includes('solve') || methodName.includes('backtrack')) {
      analysis.hasBacktracking = true;
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
      if (braceCount === 0 && inMethod) break;
    }
    if (inMethod) methodBody += code[i];
  }

  return methodBody;
}

function hasBacktrackingPattern(code: string, language: string): boolean {
  const backtrackingPatterns = [
    /n-queens|nqueens|n_queens/i,
    /(check|is)_safe.*queen/i,
    /place.*queen/i,
    /boolean\s+solve\s*\([^)]*\)/i,
    /void\s+solve\s*\([^)]*\)/i,
    /boolean\s+isSafe\s*\([^)]*\)/i,
    /solve.*board/i,
    /check.*diagonal/i,
    /check.*row.*col/i,
    /backtrack/i,
    /(solve|find).*util/i,
    /is_safe|isSafe/,
    /\(\s*board\s*,\s*\d+\s*\)/,
    /\(\s*grid\s*,\s*\d+\s*,\s*\d+\s*\)/
  ];

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

  const methodPattern = language.toLowerCase() === 'java'
    ? /(?:public|private|protected)?\s*(?:static)?\s*\w+\s+(\w+)\s*\([^)]*\)\s*{([^}]*)}/g
    : /function\s+(\w+)\s*\([^)]*\)\s*{([^}]*)}/g;

  let match;
  while ((match = methodPattern.exec(code)) !== null) {
    const functionName = match[1];
    const functionBody = match[2];

    const recursiveCallPattern = new RegExp(`\\b${functionName}\\s*\\(`, 'g');
    const recursiveCalls = functionBody.match(recursiveCallPattern);

    if (recursiveCalls) {
      info.hasRecursion = true;
      
      if (/permut|factorial/i.test(functionName) || 
          /swap.*for.*recursive/i.test(functionBody)) {
        info.isPermutation = true;
      }

      if ((functionBody.match(recursiveCallPattern) || []).length > 1) {
        info.multipleRecursiveCalls = true;
      }

      if (hasBinarySearch(functionBody) || hasSortingOperation(functionBody)) {
        info.isDivideAndConquer = true;
      }

      if (/for|while|\.forEach|enhanced-for/.test(functionBody)) {
        info.processesAllElements = true;
      }
    }
  }

  return info;
}

function hasLogarithmicComplexity(code: string): boolean {
  return hasBinarySearch(code);
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
    /malloc\s*\(\s*sizeof\s*\(/i
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
    'O(2^n)': 8,
    'O(n!)': 9
  };
  
  const currentValue = complexityOrder[current] || 0;
  const newValue = complexityOrder[new_complexity] || 0;
  
  return newValue > currentValue ? new_complexity : current;
}