import type { EditorProps } from "@monaco-editor/react";

import React, { useEffect } from "react";
import Editor, { useMonaco } from "@monaco-editor/react";

import { useSuggestions } from "./suggestions";

// ----------------------------------------------------------------------

interface ILanguageExtensionPoint {
  aliases?: string[];
  extensions?: string[];
  filenamePatterns?: string[];
  filenames?: string[];
  firstLine?: string;
  id: string;
  mimetypes?: string[];
}

// ----------------------------------------------------------------------

export default function VbaCodeEditor({ ...other }: EditorProps) {
  const monaco = useMonaco();
  const suggestions = useSuggestions();

  useEffect(() => {
    if (!monaco) return;

    if (
      !monaco.languages.getLanguages().some((lang: ILanguageExtensionPoint) => lang.id === "vba")
    ) {
      monaco.languages.register({ id: "vba" });
      monaco.languages.setMonarchTokensProvider("vba", {
        tokenizer: {
          root: [
            [
              /\b(Dim|Sub|End|If|Then|Else|For|Each|Next|Set|As|Function|Integer|String|Boolean|Object|Nothing)\b/,
              "keyword",
            ],
            [/"([^"\\]|\\.)*$/, "string.invalid"],
            [/"/, { token: "string.quote", bracket: "@open", next: "@string" }],
            [/[a-zA-Z_][\w]*/, "identifier"],
            [/[0-9]+/, "number"],
          ],
          string: [
            [/[^"]+/, "string"],
            [/""/, "string.escape"],
            [/"/, { token: "string.quote", bracket: "@close", next: "@pop" }],
          ],
        },
      });

      monaco.languages.setLanguageConfiguration("vba", {
        brackets: [["(", ")"]],
        autoClosingPairs: [
          { open: '"', close: '"' },
          { open: "(", close: ")" },
        ],
        surroundingPairs: [
          { open: '"', close: '"' },
          { open: "(", close: ")" },
        ],
      });
    }

    const provider = monaco.languages.registerCompletionItemProvider("vba", {
      provideCompletionItems: () => ({
        suggestions,
      }),
      triggerCharacters: [" ", "."],
    });

    // eslint-disable-next-line consistent-return
    return () => provider.dispose();
  }, [monaco, suggestions]);

  return <Editor defaultLanguage="vba" {...other} />;
}
