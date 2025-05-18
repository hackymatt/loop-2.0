import type { EditorProps } from "@monaco-editor/react";

import React, { useRef, useEffect } from "react";
import Editor, { useMonaco } from "@monaco-editor/react";

import { useSuggestions } from "./suggestions";

// ----------------------------------------------------------------------

function PythonCodeEditor({ ...other }: EditorProps) {
  const monaco = useMonaco();
  const suggestions = useSuggestions();
  const suggestionsRef = useRef(suggestions);

  // Keep ref up-to-date without retriggering provider
  useEffect(() => {
    suggestionsRef.current = suggestions;
  }, [suggestions]);

  // Register completion provider once per Monaco instance
  useEffect(() => {
    if (!monaco) return;

    const provider = monaco.languages.registerCompletionItemProvider("python", {
      provideCompletionItems: () => ({ suggestions: suggestionsRef.current }),
      triggerCharacters: [" ", "."],
    });
    // eslint-disable-next-line consistent-return
    return () => provider.dispose();
  }, [monaco]);

  return <Editor defaultLanguage="python" {...other} />;
}

export default React.memo(PythonCodeEditor);
