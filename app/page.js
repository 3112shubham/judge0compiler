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
const LANGUAGES = [ { id: 45, name: "Assembly (NASM 2.14.02)", monaco: "assembly", template: 'section .text\n global _start\n_start:\n mov eax, 1\n int 0x80', color: "from-gray-500 to-gray-700" }, { id: 46, name: "Bash (5.0.0)", monaco: "shell", template: '#!/bin/bash\necho "Hello World"', color: "from-green-600 to-green-800" }, { id: 47, name: "Basic (FBC 1.07.1)", monaco: "basic", template: 'PRINT "Hello World"', color: "from-yellow-500 to-yellow-700" }, { id: 75, name: "C (Clang 7.0.1)", monaco: "c", template: '#include <stdio.h>\nint main() {\n printf("Hello World\\n");\n return 0;\n}', color: "from-blue-600 to-blue-800" }, { id: 76, name: "C++ (Clang 7.0.1)", monaco: "cpp", template: '#include <iostream>\nusing namespace std;\nint main() {\n cout << "Hello World" << endl;\n return 0;\n}', color: "from-purple-500 to-pink-500" }, { id: 48, name: "C (GCC 7.4.0)", monaco: "c", template: '#include <stdio.h>\nint main() {\n printf("Hello World\\n");\n return 0;\n}', color: "from-blue-600 to-blue-800" }, { id: 52, name: "C++ (GCC 7.4.0)", monaco: "cpp", template: '#include <iostream>\nusing namespace std;\nint main() {\n cout << "Hello World" << endl;\n return 0;\n}', color: "from-purple-500 to-pink-500" }, { id: 49, name: "C (GCC 8.3.0)", monaco: "c", template: '#include <stdio.h>\nint main() {\n printf("Hello World\\n");\n return 0;\n}', color: "from-blue-600 to-blue-800" }, { id: 53, name: "C++ (GCC 8.3.0)", monaco: "cpp", template: '#include <iostream>\nusing namespace std;\nint main() {\n cout << "Hello World" << endl;\n return 0;\n}', color: "from-purple-500 to-pink-500" }, { id: 50, name: "C (GCC 9.2.0)", monaco: "c", template: '#include <stdio.h>\nint main() {\n printf("Hello World\\n");\n return 0;\n}', color: "from-blue-600 to-blue-800" }, { id: 54, name: "C++ (GCC 9.2.0)", monaco: "cpp", template: '#include <iostream>\nusing namespace std;\nint main() {\n cout << "Hello World" << endl;\n return 0;\n}', color: "from-purple-500 to-pink-500" }, { id: 86, name: "Clojure (1.10.1)", monaco: "clojure", template: '(println "Hello World")', color: "from-teal-500 to-teal-700" }, { id: 51, name: "C# (Mono 6.6.0.161)", monaco: "csharp", template: 'using System;\nclass Program {\n static void Main() {\n Console.WriteLine("Hello World");\n }\n}', color: "from-green-600 to-green-800" }, { id: 77, name: "COBOL (GnuCOBOL 2.2)", monaco: "cobol", template: 'IDENTIFICATION DIVISION.\nPROGRAM-ID. HELLO.\nPROCEDURE DIVISION.\n DISPLAY "Hello World".\n STOP RUN.', color: "from-red-600 to-red-800" }, { id: 55, name: "Common Lisp (SBCL 2.0.0)", monaco: "commonlisp", template: '(print "Hello World")', color: "from-purple-600 to-purple-800" }, { id: 56, name: "D (DMD 2.089.1)", monaco: "d", template: 'import std.stdio;\nvoid main() {\n writeln("Hello World");\n}', color: "from-red-500 to-red-700" }, { id: 57, name: "Elixir (1.9.4)", monaco: "elixir", template: 'IO.puts "Hello World"', color: "from-purple-600 to-pink-600" }, { id: 58, name: "Erlang (OTP 22.2)", monaco: "erlang", template: 'main() -> io:fwrite("Hello World~n"), halt().', color: "from-red-600 to-orange-600" }, { id: 44, name: "Executable", monaco: "plaintext", template: '#!/bin/bash\necho "Executable"', color: "from-gray-600 to-gray-800" }, { id: 87, name: "F# (.NET Core SDK 3.1.202)", monaco: "fsharp", template: '[<EntryPoint>]\nlet main argv =\n printfn "Hello World"\n 0', color: "from-blue-700 to-blue-900" }, { id: 59, name: "Fortran (GFortran 9.2.0)", monaco: "fortran", template: 'program hello\n print *, "Hello World"\nend program hello', color: "from-orange-500 to-orange-700" }, { id: 60, name: "Go (1.13.5)", monaco: "go", template: 'package main\nimport "fmt"\nfunc main() {\n fmt.Println("Hello World")\n}', color: "from-cyan-500 to-cyan-700" }, { id: 88, name: "Groovy (3.0.3)", monaco: "groovy", template: 'println "Hello World"', color: "from-blue-600 to-blue-800" }, { id: 61, name: "Haskell (GHC 8.8.1)", monaco: "haskell", template: 'main :: IO ()\nmain = putStrLn "Hello World"', color: "from-purple-600 to-purple-800" }, { id: 62, name: "Java (OpenJDK 13.0.1)", monaco: "java", template: 'public class Main {\n public static void main(String[] args) {\n System.out.println("Hello World");\n }\n}', color: "from-red-500 to-orange-500" }, { id: 63, name: "JavaScript (Node.js 12.14.0)", monaco: "javascript", template: 'console.log("Hello World");', color: "from-yellow-500 to-yellow-600" }, { id: 78, name: "Kotlin (1.3.70)", monaco: "kotlin", template: 'fun main() {\n println("Hello World")\n}', color: "from-purple-600 to-purple-800" }, { id: 64, name: "Lua (5.3.5)", monaco: "lua", template: 'print("Hello World")', color: "from-blue-600 to-blue-800" }, { id: 89, name: "Multi-file program", monaco: "plaintext", template: '// Multi-file program\n// Create multiple files for this', color: "from-gray-600 to-gray-800" }, { id: 79, name: "Objective-C (Clang 7.0.1)", monaco: "objective-c", template: '#import <Foundation/Foundation.h>\nint main() {\n NSLog(@"Hello World");\n return 0;\n}', color: "from-blue-600 to-blue-800" }, { id: 65, name: "OCaml (4.09.0)", monaco: "ocaml", template: 'let () = print_endline "Hello World"', color: "from-orange-600 to-orange-800" }, { id: 66, name: "Octave (5.1.0)", monaco: "octave", template: 'disp("Hello World");', color: "from-red-600 to-red-800" }, { id: 67, name: "Pascal (FPC 3.0.4)", monaco: "pascal", template: 'program HelloWorld;\nbegin\n WriteLn(\'Hello World\');\nend.', color: "from-blue-600 to-blue-800" }, { id: 85, name: "Perl (5.28.1)", monaco: "perl", template: 'print "Hello World\\n";', color: "from-blue-600 to-blue-800" }, { id: 68, name: "PHP (7.4.1)", monaco: "php", template: '<?php\necho "Hello World";\n?>', color: "from-purple-600 to-purple-800" }, { id: 43, name: "Plain Text", monaco: "plaintext", template: 'Hello World', color: "from-gray-500 to-gray-700" }, { id: 69, name: "Prolog (GNU Prolog 1.4.5)", monaco: "prolog", template: ':- initialization(main).\nmain :- write("Hello World"), nl, halt.', color: "from-red-600 to-red-800" }, { id: 70, name: "Python (2.7.17)", monaco: "python", template: 'print "Hello World"', color: "from-blue-500 to-cyan-500" }, { id: 71, name: "Python (3.8.1)", monaco: "python", template: 'print("Hello World")', color: "from-blue-500 to-cyan-500" }, { id: 80, name: "R (4.0.0)", monaco: "r", template: 'print("Hello World")', color: "from-blue-700 to-blue-900" }, { id: 72, name: "Ruby (2.7.0)", monaco: "ruby", template: 'puts "Hello World"', color: "from-red-600 to-red-800" }, { id: 73, name: "Rust (1.40.0)", monaco: "rust", template: 'fn main() {\n println!("Hello World");\n}', color: "from-orange-600 to-orange-800" }, { id: 81, name: "Scala (2.13.2)", monaco: "scala", template: 'object Main {\n def main(args: Array[String]): Unit = {\n println("Hello World")\n }\n}', color: "from-red-600 to-red-800" }, { id: 82, name: "SQL (SQLite 3.27.2)", monaco: "sql", template: 'SELECT "Hello World";', color: "from-orange-600 to-orange-800" }, { id: 83, name: "Swift (5.2.3)", monaco: "swift", template: 'print("Hello World")', color: "from-orange-500 to-red-500" }, { id: 74, name: "TypeScript (3.7.4)", monaco: "typescript", template: 'console.log("Hello World");', color: "from-blue-600 to-blue-800" }, { id: 84, name: "Visual Basic.Net (vbnc 0.0.0.5943)", monaco: "vb", template: 'Module Program\n Sub Main()\n Console.WriteLine("Hello World")\n End Sub\nEnd Module', color: "from-purple-600 to-purple-800" } ];

export default function Home() {
  const [language, setLanguage] = useState(LANGUAGES[4]);
  const [code, setCode] = useState(LANGUAGES[4].template);
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  /* ✅ NEW: Judge0 Base URL */
  const [baseUrl, setBaseUrl] = useState(
    "https://vehicle-doc-founder-its.trycloudflare.com"
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
