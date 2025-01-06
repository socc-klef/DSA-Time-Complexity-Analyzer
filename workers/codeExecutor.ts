let pyodide: any = null;

const loadPyodide = async () => {
  if (!pyodide) {
    self.importScripts('https://cdn.jsdelivr.net/pyodide/v0.22.1/full/pyodide.js');
    pyodide = await (self as any).loadPyodide();
  }
  return pyodide;
};

const executeJavaScript = (code: string) => {
  const originalConsoleLog = console.log;
  const logs: string[] = [];

  console.log = (...args) => {
    const message = args.map(arg => 
      typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
    ).join(' ');
    logs.push(message);
    self.postMessage({ type: 'output', content: message });
  };

  try {
    eval(`
      async function runCode() {
        ${code}
      }
      runCode();
    `);
  } catch (error) {
    self.postMessage({ type: 'error', content: error.message });
  } finally {
    console.log = originalConsoleLog;
  }

  return logs;
};

const executePython = async (code: string) => {
  const pyodide = await loadPyodide();

  pyodide.runPython(`
    import sys
    from js import console

    def custom_print(*args, sep=' ', end='\\n'):
      output = sep.join(str(arg) for arg in args) + end
      console.log(output)

    sys.stdout.write = custom_print
    print = custom_print
  `);

  try {
    await pyodide.runPythonAsync(code);
  } catch (error) {
    self.postMessage({ type: 'error', content: error.message });
  }
};

const executeJava = (code: string) => {
  self.postMessage({ type: 'output', content: "Java execution is not supported in the browser environment." });
  self.postMessage({ type: 'output', content: "To run Java code, you would need a backend service that can compile and execute Java." });
  self.postMessage({ type: 'output', content: "Consider using a Java API or setting up a server-side execution environment." });
};

const executeCpp = (code: string) => {
  self.postMessage({ type: 'output', content: "C++ execution is not supported in the browser environment." });
  self.postMessage({ type: 'output', content: "To run C++ code, you would need a backend service that can compile and execute C++." });
  self.postMessage({ type: 'output', content: "Consider using a C++ compilation API or setting up a server-side execution environment." });
};

self.onmessage = async (event) => {
  const { code, language } = event.data;

  try {
    switch (language) {
      case 'javascript':
        executeJavaScript(code);
        break;
      case 'python':
        await executePython(code);
        break;
      case 'java':
        executeJava(code);
        break;
      case 'cpp':
        executeCpp(code);
        break;
      default:
        self.postMessage({ type: 'error', content: `Language '${language}' is not supported.` });
    }
  } catch (error) {
    self.postMessage({ type: 'error', content: error.message });
  } finally {
    self.postMessage({ type: 'done' });
  }
};

