import type { Theme, SxProps } from "@mui/material/styles";

import { useTranslation } from "react-i18next";

import Box from "@mui/material/Box";

import Search from "src/components/search/search";

// ----------------------------------------------------------------------

type PostSearchMobileProps = {
  sx?: SxProps<Theme>;
  value?: string;
  onChange?: (newValue: string) => void;
};

export function PostSearchMobile({ sx, value, onChange }: PostSearchMobileProps) {
  const { t } = useTranslation("blog");
  return (
    <Box sx={[{ px: 2, pb: 3, display: { md: "none" } }, ...(Array.isArray(sx) ? sx : [sx])]}>
      <Search
        placeholder={`${t("search")}...`}
        value={value}
        onChange={(newValue) => onChange?.(newValue as string)}
      />
    </Box>
  );
}
