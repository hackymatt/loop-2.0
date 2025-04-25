import type { EditorProps } from "@monaco-editor/react";

import React, { useEffect } from "react";
import Editor, { useMonaco } from "@monaco-editor/react";

import { useSuggestions } from "./suggestions";

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

export function PythonCodeEditor({ ...other }: EditorProps) {
  const monaco = useMonaco();
  const suggestions = useSuggestions();

  useEffect(() => {
    if (!monaco) return;

    const provider = monaco.languages.registerCompletionItemProvider("python", {
      provideCompletionItems: () => ({
        suggestions,
      }),
      triggerCharacters: [" ", "."],
    });

    // eslint-disable-next-line consistent-return
    return () => provider.dispose();
  }, [monaco, suggestions]);

  return <Editor defaultLanguage="python" {...other} />;
}
