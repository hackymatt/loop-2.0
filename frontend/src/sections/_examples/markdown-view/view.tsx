"use client";

import { CONFIG } from "src/global-config";

import { Markdown } from "src/components/markdown";

import { ComponentBox, ComponentLayout } from "../layout";

// ----------------------------------------------------------------------

const content = `
[pica](https://nodeca.github.io/pica/demo/)
# h1 Heading 2-)
## h2 Heading
### h3 Heading
#### h4 Heading
##### h5 Heading
###### h6 Heading
`;

export function MarkdownView() {
  return (
    <ComponentLayout
      heroProps={{
        heading: "Markdown",
      }}
      containerProps={{
        maxWidth: "md",
      }}
    >
      <ComponentBox sx={{ py: 0 }}>
        <Markdown content={content} />
      </ComponentBox>
    </ComponentLayout>
  );
}
