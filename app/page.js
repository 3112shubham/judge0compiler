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
  { id: 45, name: "Assembly (NASM 2.14.02)", monaco: "assembly", template: 'section .text\n  global _start\n_start:\n  mov eax, 1\n  int 0x80', color: "from-gray-500 to-gray-700" },
  { id: 46, name: "Bash (5.0.0)", monaco: "shell", template: '#!/bin/bash\necho "Hello World"', color: "from-green-600 to-green-800" },
  { id: 47, name: "Basic (FBC 1.07.1)", monaco: "basic", template: 'PRINT "Hello World"', color: "from-yellow-500 to-yellow-700" },
  { id: 75, name: "C (Clang 7.0.1)", monaco: "c", template: '#include <stdio.h>\nint main() {\n  printf("Hello World\\n");\n  return 0;\n}', color: "from-blue-600 to-blue-800" },
  { id: 76, name: "C++ (Clang 7.0.1)", monaco: "cpp", template: '#include <iostream>\nusing namespace std;\nint main() {\n  cout << "Hello World" << endl;\n  return 0;\n}', color: "from-purple-500 to-pink-500" },
  { id: 48, name: "C (GCC 7.4.0)", monaco: "c", template: '#include <stdio.h>\nint main() {\n  printf("Hello World\\n");\n  return 0;\n}', color: "from-blue-600 to-blue-800" },
  { id: 52, name: "C++ (GCC 7.4.0)", monaco: "cpp", template: '#include <iostream>\nusing namespace std;\nint main() {\n  cout << "Hello World" << endl;\n  return 0;\n}', color: "from-purple-500 to-pink-500" },
  { id: 49, name: "C (GCC 8.3.0)", monaco: "c", template: '#include <stdio.h>\nint main() {\n  printf("Hello World\\n");\n  return 0;\n}', color: "from-blue-600 to-blue-800" },
  { id: 53, name: "C++ (GCC 8.3.0)", monaco: "cpp", template: '#include <iostream>\nusing namespace std;\nint main() {\n  cout << "Hello World" << endl;\n  return 0;\n}', color: "from-purple-500 to-pink-500" },
  { id: 50, name: "C (GCC 9.2.0)", monaco: "c", template: '#include <stdio.h>\nint main() {\n  printf("Hello World\\n");\n  return 0;\n}', color: "from-blue-600 to-blue-800" },
  { id: 54, name: "C++ (GCC 9.2.0)", monaco: "cpp", template: '#include <iostream>\nusing namespace std;\nint main() {\n  cout << "Hello World" << endl;\n  return 0;\n}', color: "from-purple-500 to-pink-500" },
  { id: 86, name: "Clojure (1.10.1)", monaco: "clojure", template: '(println "Hello World")', color: "from-teal-500 to-teal-700" },
  { id: 51, name: "C# (Mono 6.6.0.161)", monaco: "csharp", template: 'using System;\nclass Program {\n  static void Main() {\n    Console.WriteLine("Hello World");\n  }\n}', color: "from-green-600 to-green-800" },
  { id: 77, name: "COBOL (GnuCOBOL 2.2)", monaco: "cobol", template: 'IDENTIFICATION DIVISION.\nPROGRAM-ID. HELLO.\nPROCEDURE DIVISION.\n  DISPLAY "Hello World".\n  STOP RUN.', color: "from-red-600 to-red-800" },
  { id: 55, name: "Common Lisp (SBCL 2.0.0)", monaco: "commonlisp", template: '(print "Hello World")', color: "from-purple-600 to-purple-800" },
  { id: 56, name: "D (DMD 2.089.1)", monaco: "d", template: 'import std.stdio;\nvoid main() {\n  writeln("Hello World");\n}', color: "from-red-500 to-red-700" },
  { id: 57, name: "Elixir (1.9.4)", monaco: "elixir", template: 'IO.puts "Hello World"', color: "from-purple-600 to-pink-600" },
  { id: 58, name: "Erlang (OTP 22.2)", monaco: "erlang", template: 'main() -> io:fwrite("Hello World~n"), halt().', color: "from-red-600 to-orange-600" },
  { id: 44, name: "Executable", monaco: "plaintext", template: '#!/bin/bash\necho "Executable"', color: "from-gray-600 to-gray-800" },
  { id: 87, name: "F# (.NET Core SDK 3.1.202)", monaco: "fsharp", template: '[<EntryPoint>]\nlet main argv =\n  printfn "Hello World"\n  0', color: "from-blue-700 to-blue-900" },
  { id: 59, name: "Fortran (GFortran 9.2.0)", monaco: "fortran", template: 'program hello\n  print *, "Hello World"\nend program hello', color: "from-orange-500 to-orange-700" },
  { id: 60, name: "Go (1.13.5)", monaco: "go", template: 'package main\nimport "fmt"\nfunc main() {\n  fmt.Println("Hello World")\n}', color: "from-cyan-500 to-cyan-700" },
  { id: 88, name: "Groovy (3.0.3)", monaco: "groovy", template: 'println "Hello World"', color: "from-blue-600 to-blue-800" },
  { id: 61, name: "Haskell (GHC 8.8.1)", monaco: "haskell", template: 'main :: IO ()\nmain = putStrLn "Hello World"', color: "from-purple-600 to-purple-800" },
  { id: 62, name: "Java (OpenJDK 13.0.1)", monaco: "java", template: 'public class Main {\n  public static void main(String[] args) {\n    System.out.println("Hello World");\n  }\n}', color: "from-red-500 to-orange-500" },
  { id: 63, name: "JavaScript (Node.js 12.14.0)", monaco: "javascript", template: 'console.log("Hello World");', color: "from-yellow-500 to-yellow-600" },
  { id: 78, name: "Kotlin (1.3.70)", monaco: "kotlin", template: 'fun main() {\n  println("Hello World")\n}', color: "from-purple-600 to-purple-800" },
  { id: 64, name: "Lua (5.3.5)", monaco: "lua", template: 'print("Hello World")', color: "from-blue-600 to-blue-800" },
  { id: 89, name: "Multi-file program", monaco: "plaintext", template: '// Multi-file program\n// Create multiple files for this', color: "from-gray-600 to-gray-800" },
  { id: 79, name: "Objective-C (Clang 7.0.1)", monaco: "objective-c", template: '#import <Foundation/Foundation.h>\nint main() {\n  NSLog(@"Hello World");\n  return 0;\n}', color: "from-blue-600 to-blue-800" },
  { id: 65, name: "OCaml (4.09.0)", monaco: "ocaml", template: 'let () = print_endline "Hello World"', color: "from-orange-600 to-orange-800" },
  { id: 66, name: "Octave (5.1.0)", monaco: "octave", template: 'disp("Hello World");', color: "from-red-600 to-red-800" },
  { id: 67, name: "Pascal (FPC 3.0.4)", monaco: "pascal", template: 'program HelloWorld;\nbegin\n  WriteLn(\'Hello World\');\nend.', color: "from-blue-600 to-blue-800" },
  { id: 85, name: "Perl (5.28.1)", monaco: "perl", template: 'print "Hello World\\n";', color: "from-blue-600 to-blue-800" },
  { id: 68, name: "PHP (7.4.1)", monaco: "php", template: '<?php\necho "Hello World";\n?>', color: "from-purple-600 to-purple-800" },
  { id: 43, name: "Plain Text", monaco: "plaintext", template: 'Hello World', color: "from-gray-500 to-gray-700" },
  { id: 69, name: "Prolog (GNU Prolog 1.4.5)", monaco: "prolog", template: ':- initialization(main).\nmain :- write("Hello World"), nl, halt.', color: "from-red-600 to-red-800" },
  { id: 70, name: "Python (2.7.17)", monaco: "python", template: 'print "Hello World"', color: "from-blue-500 to-cyan-500" },
  { id: 71, name: "Python (3.8.1)", monaco: "python", template: 'print("Hello World")', color: "from-blue-500 to-cyan-500" },
  { id: 80, name: "R (4.0.0)", monaco: "r", template: 'print("Hello World")', color: "from-blue-700 to-blue-900" },
  { id: 72, name: "Ruby (2.7.0)", monaco: "ruby", template: 'puts "Hello World"', color: "from-red-600 to-red-800" },
  { id: 73, name: "Rust (1.40.0)", monaco: "rust", template: 'fn main() {\n  println!("Hello World");\n}', color: "from-orange-600 to-orange-800" },
  { id: 81, name: "Scala (2.13.2)", monaco: "scala", template: 'object Main {\n  def main(args: Array[String]): Unit = {\n    println("Hello World")\n  }\n}', color: "from-red-600 to-red-800" },
  { id: 82, name: "SQL (SQLite 3.27.2)", monaco: "sql", template: 'SELECT "Hello World";', color: "from-orange-600 to-orange-800" },
  { id: 83, name: "Swift (5.2.3)", monaco: "swift", template: 'print("Hello World")', color: "from-orange-500 to-red-500" },
  { id: 74, name: "TypeScript (3.7.4)", monaco: "typescript", template: 'console.log("Hello World");', color: "from-blue-600 to-blue-800" },
  { id: 84, name: "Visual Basic.Net (vbnc 0.0.0.5943)", monaco: "vb", template: 'Module Program\n  Sub Main()\n    Console.WriteLine("Hello World")\n  End Sub\nEnd Module', color: "from-purple-600 to-purple-800" }
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
      <header className="px-6 py-4 border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm relative z-[9999]">
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
          <div className="relative z-[9999]">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-3 px-4 py-2.5 rounded-lg bg-gray-800 border border-gray-700 hover:bg-gray-750 hover:border-blue-500/50 transition-all duration-200 min-w-[280px]"
            >
              <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${language.color}`} />
              <span className="font-medium text-white">{language.name}</span>
              <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} />
            </button>
            
            {isDropdownOpen && (
              <div className="absolute top-full mt-2 w-full rounded-lg bg-gray-800 border border-gray-700 shadow-2xl max-h-[80vh] overflow-y-auto">
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