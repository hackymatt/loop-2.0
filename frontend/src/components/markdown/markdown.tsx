import "@mdxeditor/editor/style.css";
import "./styles.css";

import React from "react";
import { MDXEditor } from "@mdxeditor/editor";

import { plugins } from "../markdown-editor/pluggins";

// ----------------------------------------------------------------------

type MarkdownProps = {
  content: string;
};

export function Markdown({ content, ...other }: MarkdownProps) {
  return <MDXEditor markdown={content} plugins={plugins} readOnly {...other} />;
}
