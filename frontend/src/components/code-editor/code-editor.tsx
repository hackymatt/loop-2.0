import { useMonaco } from "@monaco-editor/react";
import React, { lazy, Suspense, useEffect } from "react";

import { useTheme } from "@mui/material/styles";
import { CircularProgress } from "@mui/material";
// Dynamically import language-specific editors
const VbaCodeEditor = lazy(() => import("./languages/vba/code-editor"));
const PythonCodeEditor = lazy(() => import("./languages/python/code-editor"));

interface CodeEditorProps {
  value: string;
  technology: string;
  onChange: (value: string) => void;
}

export function CodeEditor({ value, technology, onChange }: CodeEditorProps) {
  const theme = useTheme();
  const monaco = useMonaco();

  useEffect(() => {
    if (monaco) {
      const themeClass = `vs-${theme.palette.mode}`;

      // Ensure Monaco editor is fully initialized before setting the theme
      if (monaco.editor.getModels().length > 0) {
        monaco.editor.setTheme(themeClass);
      } else {
        // Fallback in case Monaco is not initialized yet
        setTimeout(() => {
          monaco.editor.setTheme(themeClass);
        }, 100); // Retry after a short delay
      }
    }
  }, [monaco, theme.palette.mode]); // Effect runs when Monaco or theme changes

  const handleEditorChange = (newValue?: string) => {
    if (typeof newValue === "string") {
      onChange(newValue);
    }
  };

  // Map to get the correct editor component based on technology
  const technologyEditorMap: Record<string, React.ComponentType<any>> = {
    python: PythonCodeEditor,
    vba: VbaCodeEditor,
  };

  const EditorComponent = technologyEditorMap[technology];

  if (!EditorComponent) {
    throw new Error(`No editor found for technology ${technology}`);
  }

  return (
    <Suspense fallback={<CircularProgress />}>
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
    </Suspense>
  );
}
