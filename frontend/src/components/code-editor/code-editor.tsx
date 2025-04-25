import React from "react";

import { CircularProgress } from "@mui/material";

import { VbaCodeEditor } from "./languages/vba/code-editor";
import { PythonCodeEditor } from "./languages/python/code-editor";

// ----------------------------------------------------------------------

interface CodeEditorProps {
  value: string;
  language: string;
  onChange: (value: string) => void;
}

// ----------------------------------------------------------------------

export function CodeEditor({ value, language, onChange }: CodeEditorProps) {
  const handleEditorChange = (newValue?: string) => {
    if (typeof newValue === "string") {
      onChange(newValue);
    }
  };

  const languageEditorMap: Record<string, React.ComponentType<any>> = {
    python: PythonCodeEditor,
    vba: VbaCodeEditor,
  };

  const EditorComponent = languageEditorMap[language];

  if (!EditorComponent) {
    throw new Error(`No editor found for language ${language}`);
  }

  return (
    <EditorComponent
      height="100%"
      value={value}
      onChange={handleEditorChange}
      options={{
        fontSize: 14,
        minimap: { enabled: false },
        automaticLayout: true,
        suggestOnTriggerCharacters: true,
        tabSize: 2,
      }}
      loading={<CircularProgress />}
    />
  );
}
