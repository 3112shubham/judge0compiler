// components/CodeEditor.jsx
"use client";
import Editor from "@monaco-editor/react";

export default function CodeEditor({ language, code, setCode }) {
  return (
    <Editor
      height="100%"
      language={language}
      value={code}
      onChange={setCode}
      theme="vs-dark"
      options={{
        fontSize: 14,
        fontFamily: "JetBrains Mono, Menlo, Monaco, monospace",
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        renderLineHighlight: "all",
        cursorBlinking: "smooth",
        cursorSmoothCaretAnimation: "on",
        wordWrap: "on",
        smoothScrolling: true,
        formatOnPaste: true,
        formatOnType: true,
        autoIndent: "full",
        tabSize: 2,
        padding: { top: 20 },
        lineNumbers: "on",
        glyphMargin: true,
        folding: true,
        bracketPairColorization: { enabled: true },
        guides: { bracketPairs: true },
      }}
      beforeMount={(monaco) => {
        monaco.editor.defineTheme("custom-dark", {
          base: "vs-dark",
          inherit: true,
          rules: [],
          colors: {
            "editor.background": "#0a0a0a",
            "editor.lineHighlightBackground": "#1a1a1a",
            "editorLineNumber.foreground": "#4a4a4a",
            "editorCursor.foreground": "#60a5fa",
          },
        });
      }}
      onMount={(editor) => {
        editor.updateOptions({ theme: "custom-dark" });
        editor.focus();
      }}
    />
  );
}