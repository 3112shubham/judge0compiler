"use client";
import { useState } from "react";
import CodeEditor from "@/components/CodeEditor";
import {
  Play,
  Loader2,
  Code2,
  Monitor,
  ChevronDown,
  Check,
  Terminal,
  Sparkles,
  Link
} from "lucide-react";

/* ===== LANGUAGES (UNCHANGED) ===== */
const LANGUAGES = [
  { id: 46, name: "Bash (5.0.0)", monaco: "shell", template: '#!/bin/bash\necho "Hello World"', color: "from-green-600 to-green-800" },
  { id: 75, name: "C (Clang 7.0.1)", monaco: "c", template: '#include <stdio.h>\nint main(){printf("Hello World\\n");}', color: "from-blue-600 to-blue-800" },
  { id: 52, name: "C++ (GCC 7.4.0)", monaco: "cpp", template: '#include <iostream>\nusing namespace std;\nint main(){cout<<"Hello World";}', color: "from-purple-500 to-pink-500" },
  { id: 71, name: "Python (3.8.1)", monaco: "python", template: 'print("Hello World")', color: "from-blue-500 to-cyan-500" },
  { id: 63, name: "JavaScript (Node.js)", monaco: "javascript", template: 'console.log("Hello World");', color: "from-yellow-500 to-yellow-600" }
];

export default function Home() {
  const [language, setLanguage] = useState(LANGUAGES[0]);
  const [code, setCode] = useState(LANGUAGES[0].template);
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  /* ✅ NEW: Judge0 Base URL */
  const [baseUrl, setBaseUrl] = useState(
    "https://mysql-headed-replies-boston.trycloudflare.com"
  );

  const runCode = async () => {
    if (!baseUrl) {
      setOutput("❌ Please enter a valid Judge0 base URL.");
      return;
    }

    setLoading(true);
    setOutput("");

    try {
      const res = await fetch(
        `${baseUrl.replace(/\/$/, "")}/submissions?wait=true`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            language_id: language.id,
            source_code: code
          })
        }
      );

      const data = await res.json();

      setOutput(
        data.stdout ||
          data.stderr ||
          data.compile_output ||
          data.message ||
          "No output"
      );
    } catch (err) {
      setOutput("❌ Error connecting to Judge0 API.");
    }

    setLoading(false);
  };

  return (
    <main className="h-screen flex flex-col bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* HEADER */}
      <header className="px-6 py-4 border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm z-[9999]">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600">
              <Code2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Judge0 Compiler
              </h1>
              <p className="text-sm text-gray-400">
                Write, run, and debug code instantly
              </p>
            </div>
          </div>

          {/* RIGHT CONTROLS */}
          <div className="flex items-center gap-3 relative">
            {/* ✅ NEW URL INPUT */}
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gray-800 border border-gray-700 min-w-[340px]">
              <Link className="w-4 h-4 text-blue-400" />
              <input
                value={baseUrl}
                onChange={(e) => setBaseUrl(e.target.value)}
                placeholder="Judge0 Base URL"
                className="bg-transparent text-sm text-white outline-none w-full placeholder-gray-500"
              />
            </div>

            {/* LANGUAGE DROPDOWN */}
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-3 px-4 py-2.5 rounded-lg bg-gray-800 border border-gray-700 hover:border-blue-500/50 min-w-[260px]"
              >
                <div
                  className={`w-3 h-3 rounded-full bg-gradient-to-r ${language.color}`}
                />
                <span className="font-medium text-white">
                  {language.name}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-gray-400 transition-transform ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isDropdownOpen && (
                <div className="absolute top-full mt-2 w-full bg-gray-800 border border-gray-700 rounded-lg shadow-xl max-h-[60vh] overflow-y-auto z-[9999]">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.id}
                      onClick={() => {
                        setLanguage(lang);
                        setCode(lang.template);
                        setIsDropdownOpen(false);
                      }}
                      className="w-full px-4 py-3 flex justify-between items-center hover:bg-gray-700"
                    >
                      <span className="text-gray-200">{lang.name}</span>
                      {language.id === lang.id && (
                        <Check className="w-4 h-4 text-blue-400" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <div className="flex flex-1 overflow-hidden p-4 gap-4">
        {/* EDITOR */}
        <div className="flex-1 flex flex-col border border-gray-800 rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-800 bg-gray-900 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Monitor className="w-4 h-4 text-blue-400" />
              <span className="text-white font-medium">Editor</span>
            </div>
            <span className="text-sm text-gray-400">Auto-save enabled</span>
          </div>
          <CodeEditor language={language.monaco} code={code} setCode={setCode} />
        </div>

        {/* OUTPUT */}
        <div className="flex-1 flex flex-col border border-gray-800 rounded-xl overflow-hidden relative">
          <div className="px-4 py-3 border-b border-gray-800 bg-gray-900 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-green-400" />
              <span className="text-white font-medium">Output</span>
            </div>
            <button
              onClick={() => setOutput("")}
              className="text-sm text-gray-400 hover:text-white"
            >
              Clear
            </button>
          </div>

          <div className="flex-1 p-4 bg-black overflow-auto font-mono text-sm">
            {output ? (
              <pre className="text-green-400 whitespace-pre-wrap">
                {output}
              </pre>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                Output will appear here
              </div>
            )}

            {loading && (
              <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-blue-400" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="px-6 py-4 border-t border-gray-800 bg-gray-900 flex justify-end">
        <button
          onClick={runCode}
          disabled={loading}
          className="flex items-center gap-3 px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Running...
            </>
          ) : (
            <>
              <Play className="w-5 h-5" />
              Run Code
            </>
          )}
        </button>
      </footer>
    </main>
  );
}
