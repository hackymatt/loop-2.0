import type { DialogProps } from "@mui/material/Dialog";

import { useForm } from "react-hook-form";
import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import {
  Switch,
  Accordion,
  Typography,
  AccordionDetails,
  AccordionSummary,
  FormControlLabel,
} from "@mui/material";

import { useCookiesTypes } from "src/hooks/use-cookies-types";

import { Form } from "../hook-form";
import { Iconify } from "../iconify";

// ----------------------------------------------------------------------

interface Props extends DialogProps {
  onConfirm: (cookies: { [cookie: string]: boolean }) => void;
}

// ----------------------------------------------------------------------

export function CookiesSettings({ onConfirm, ...other }: Props) {
  const { t } = useTranslation("cookies");
  const methods = useForm();
  const { cookies, defaultCookies } = useCookiesTypes();

  const [settings, setSettings] = useState<{ [cookie: string]: boolean }>(defaultCookies);
  const [expanded, setExpanded] = useState<string | false>(false);

  const handleChangeExpanded = useCallback(
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    },
    []
  );

  return (
    <Dialog
      disableEscapeKeyDown
      fullWidth
      maxWidth="sm"
      scroll="body"
      PaperProps={{
        sx: {
          borderRadius: 3,
          backgroundColor: "background.paper",
          boxShadow: 24,
          p: 2,
        },
      }}
      {...other}
    >
      <Form methods={methods}>
        <DialogTitle sx={{ typography: "h6", pb: 3 }}>{t("text.manage")}</DialogTitle>

        <DialogContent sx={{ py: 0, typography: "body2" }}>
          {cookies.map((cookie, index) => (
            <Accordion
              key={index}
              expanded={expanded === cookie.title}
              onChange={handleChangeExpanded(cookie.title)}
            >
              <AccordionSummary
                expandIcon={null}
                sx={{
                  px: 2,
                  py: 1.5,
                  "& .MuiAccordionSummary-content": {
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  },
                }}
              >
                <Iconify
                  icon={expanded === cookie.title ? "eva:minus-outline" : "eva:plus-outline"}
                  sx={{ mr: 1, fontSize: 18, color: "text.secondary" }}
                />

                <Typography variant="subtitle2" sx={{ flexGrow: 1 }}>
                  {cookie.title}
                </Typography>

                <FormControlLabel
                  control={
                    <Switch
                      checked={settings[cookie.type]}
                      disabled={cookie.disabled}
                      size="small"
                      onClick={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        setSettings((prev) => ({ ...prev, [cookie.type]: !settings[cookie.type] }));
                      }}
                    />
                  }
                  label={cookie.disabled ? t("text.mandatory") : t("text.optional")}
                  labelPlacement="start"
                />
              </AccordionSummary>

              <AccordionDetails sx={{ color: "text.secondary" }}>
                {cookie.description}
              </AccordionDetails>
            </Accordion>
          ))}
        </DialogContent>

        <DialogActions sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Button variant="contained" onClick={() => onConfirm(settings)}>
            {t("button.acceptSelected")}
          </Button>
        </DialogActions>
      </Form>
    </Dialog>
  );
}
