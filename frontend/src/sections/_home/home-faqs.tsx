import type { Variants } from "framer-motion";
import type { BoxProps } from "@mui/material/Box";

import { m } from "framer-motion";

import { _faqs } from "src/_mock";

import { varFade } from "src/components/animate";

import { Faqs } from "../faqs";

// ----------------------------------------------------------------------

const variants: Variants = varFade("inUp", { distance: 24 });

export function HomeFAQs({ sx, ...other }: BoxProps) {
  return (
    <m.div variants={variants}>
      <Faqs data={_faqs} sx={sx} {...other} />
    </m.div>
  );
}
