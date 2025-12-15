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
  Sparkles 
} from "lucide-react";

const LANGUAGES = [
  { id: 71, name: "Python", monaco: "python", template: 'print("Hello World")', color: "from-blue-500 to-cyan-500" },
  { id: 54, name: "C++", monaco: "cpp", template: '#include <bits/stdc++.h>\nusing namespace std;\nint main(){\n  cout << "Hello World";\n}', color: "from-purple-500 to-pink-500" },
  { id: 62, name: "Java", monaco: "java", template: 'public class Main {\n  public static void main(String[] args) {\n    System.out.println("Hello World");\n  }\n}', color: "from-red-500 to-orange-500" }
];

export default function Home() {
  const [language, setLanguage] = useState(LANGUAGES[1]);
  const [code, setCode] = useState(LANGUAGES[1].template);
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const runCode = async () => {
    setLoading(true);
    setOutput("");

    try {
      const res = await fetch("https://ships-subaru-arms-walks.trycloudflare.com/submissions?wait=true", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language_id: language.id,
          source_code: code
        })
      });

      const data = await res.json();
      setOutput(
        data.stdout ||
        data.stderr ||
        data.compile_output ||
        data.message ||
        "No output"
      );
    } catch (err) {
      setOutput("❌ Error connecting to Judge0 API. Make sure the server is running.");
    }

    setLoading(false);
  };

  return (
    <main className="h-screen flex flex-col bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Header */}
      <header className="px-6 py-4 border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600">
              <Code2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Judge0 Compiler
              </h1>
              <p className="text-sm text-gray-400">Write, run, and debug code instantly</p>
            </div>
          </div>
          
          {/* Language Selector */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-3 px-4 py-2.5 rounded-lg bg-gray-800 border border-gray-700 hover:bg-gray-750 hover:border-blue-500/50 transition-all duration-200 min-w-[180px]"
            >
              <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${language.color}`} />
              <span className="font-medium text-white">{language.name}</span>
              <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} />
            </button>
            
            {isDropdownOpen && (
              <div className="absolute bottom-full mb-2 w-full rounded-lg bg-gray-800 border border-gray-700 shadow-2xl z-[9999]">
                {LANGUAGES.map(lang => (
                  <button
                    key={lang.id}
                    onClick={() => {
                      setLanguage(lang);
                      setCode(lang.template);
                      setIsDropdownOpen(false);
                    }}
                    className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-750 transition-colors first:rounded-t-lg last:rounded-b-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${lang.color}`} />
                      <span className={`font-medium ${language.id === lang.id ? "text-white" : "text-gray-300"}`}>
                        {lang.name}
                      </span>
                    </div>
                    {language.id === lang.id && (
                      <Check className="w-4 h-4 text-blue-400" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden p-4 gap-4">
        {/* Code Editor Section */}
        <div className="flex-1 flex flex-col rounded-2xl overflow-hidden border border-gray-800 bg-gray-900/50 backdrop-blur-sm">
          <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between bg-gray-900/80">
            <div className="flex items-center gap-3">
              <Monitor className="w-5 h-5 text-blue-400" />
              <h2 className="text-lg font-semibold text-white">Editor</h2>
              <div className="px-3 py-1 rounded-full bg-gradient-to-r from-blue-500/20 to-blue-600/20 border border-blue-500/30">
                <span className="text-sm font-medium text-blue-300">{language.name}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-yellow-400" />
              <span className="text-sm text-gray-400">Auto-save enabled</span>
            </div>
          </div>
          
          <div className="flex-1">
            <CodeEditor
              language={language.monaco}
              code={code}
              setCode={setCode}
            />
          </div>
        </div>

        {/* Output Section */}
        <div className="flex-1 flex flex-col rounded-2xl overflow-hidden border border-gray-800 bg-gray-900/50 backdrop-blur-sm">
          <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between bg-gray-900/80">
            <div className="flex items-center gap-3">
              <Terminal className="w-5 h-5 text-green-400" />
              <h2 className="text-lg font-semibold text-white">Output</h2>
            </div>
            <button
              onClick={() => setOutput("")}
              className="px-3 py-1.5 text-sm rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-750 hover:text-white transition-colors"
            >
              Clear
            </button>
          </div>
          
          <div className="flex-1 p-6 bg-black/50 overflow-auto">
            {output ? (
              <pre className="font-mono text-sm whitespace-pre-wrap">
                {output.split('\n').map((line, i) => (
                  <div key={i} className="flex">
                    <span className="text-gray-500 select-none mr-4 w-6 text-right">{i + 1}</span>
                    <span className={`flex-1 ${line.includes('Error') || line.includes('error') ? 'text-red-400' : 'text-green-400'}`}>
                      {line}
                    </span>
                  </div>
                ))}
              </pre>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-500">
                <Terminal className="w-16 h-16 mb-4 opacity-30" />
                <p className="text-lg font-medium mb-2">Output will appear here</p>
                <p className="text-sm">Click "Run Code" to execute your program</p>
              </div>
            )}
            
            {loading && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                <div className="text-center">
                  <Loader2 className="w-12 h-12 text-blue-400 animate-spin mx-auto mb-4" />
                  <p className="text-white font-medium">Running your code...</p>
                  <p className="text-gray-400 text-sm mt-2">Please wait a moment</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="px-6 py-4 border-t border-gray-800 bg-gray-900/50 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-gray-400">API Connected</span>
            </div>
            <div className="text-gray-500">
              Running on <span className="text-blue-400">Judge0</span>
            </div>
          </div>
          
          <button
            onClick={runCode}
            disabled={loading}
            className="group flex items-center gap-3 px-8 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-blue-500/25"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="font-semibold">Running...</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span className="font-semibold">Run Code</span>
              </>
            )}
          </button>
        </div>
      </footer>
    </main>
  );
}