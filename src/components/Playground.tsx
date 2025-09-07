"use client";
import Editor from "@monaco-editor/react";
import { useState } from "react";
import { Play, RotateCcw } from "lucide-react";

export default function Playground() {
  const [code, setCode] = useState(`function greet(name) {
  return 'Hello, ' + name + '!'
}

console.log(greet('World'))
console.log('Welcome to the coding playground!')`);
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);

  function run() {
    setIsRunning(true);
    setOutput("");

    try {
      // Capture console.log output
      const originalLog = console.log;
      const logs: string[] = [];
      console.log = (...args) => {
        logs.push(
          args
            .map((arg) =>
              typeof arg === "object"
                ? JSON.stringify(arg, null, 2)
                : String(arg)
            )
            .join(" ")
        );
      };

      // Execute the code
      const result = Function(`${code}`)();

      // Restore console.log
      console.log = originalLog;

      // Display output
      if (logs.length > 0) {
        setOutput(logs.join("\n"));
      } else if (result !== undefined) {
        setOutput(String(result));
      } else {
        setOutput("Code executed successfully (no output)");
      }
    } catch (e: any) {
      setOutput(`Error: ${e.message}`);
    } finally {
      setIsRunning(false);
    }
  }

  function reset() {
    setCode(`function greet(name) {
  return 'Hello, ' + name + '!'
}

console.log(greet('World'))
console.log('Welcome to the coding playground!')`);
    setOutput("");
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-100">
          Code Playground
        </h3>
        <div className="flex gap-2">
          <button
            onClick={reset}
            className="px-3 py-2 rounded-lg border border-slate-700 hover:border-slate-600 transition-colors flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
          <button
            onClick={run}
            disabled={isRunning}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center gap-2"
          >
            <Play className="w-4 h-4" />
            {isRunning ? "Running..." : "Run"}
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-800 overflow-hidden">
          <Editor
            height="320px"
            defaultLanguage="javascript"
            value={code}
            onChange={(value) => setCode(value || "")}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              lineNumbers: "on",
              roundedSelection: false,
              scrollBeyondLastLine: false,
              automaticLayout: true,
            }}
          />
        </div>

        <div className="space-y-3">
          <div className="rounded-2xl border border-slate-800 p-4">
            <h4 className="text-sm font-medium text-slate-300 mb-2">Output</h4>
            <pre className="text-sm bg-slate-900 text-slate-100 p-3 rounded-lg min-h-[120px] whitespace-pre-wrap overflow-auto">
              {output || 'Click "Run" to execute your code...'}
            </pre>
          </div>

          <div className="rounded-2xl border border-slate-800 p-4">
            <h4 className="text-sm font-medium text-slate-300 mb-2">Tips</h4>
            <ul className="text-xs text-slate-400 space-y-1">
              <li>• Use console.log() to see output</li>
              <li>• Try functions, loops, and variables</li>
              <li>• JavaScript ES6+ features supported</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}


