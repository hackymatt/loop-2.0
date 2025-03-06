import { Link, Typography } from "@mui/material";

import { paths } from "src/routes/paths";

export const termsAcceptance = (
  <Typography variant="caption" align="left" sx={{ color: "text.secondary" }}>
    Akceptuję{" "}
    <Link
      target="_blank"
      rel="noopener"
      href={paths.termsAndConditions}
      color="text.primary"
      underline="always"
    >
      regulamin
    </Link>{" "}
    oraz{" "}
    <Link
      target="_blank"
      rel="noopener"
      href={paths.privacyPolicy}
      color="text.primary"
      underline="always"
    >
      politykę prywatności.
    </Link>
  </Typography>
);

export const dataProcessingConsent = (
  <Typography variant="caption" align="left" sx={{ color: "text.secondary" }}>
    Wyrażam zgodę na przetwarzanie moich danych osobowych zawartych w formularzu w celu i zakresie
    niezbędnym do realizacji usługi i tylko w takim celu.
  </Typography>
);

export const newsletterAcceptance = ({
  color,
  opacity = 1,
}: {
  color?: string;
  opacity?: number;
}) => (
  <Typography variant="caption" align="left" sx={{ color: color ?? "text.secondary", opacity }}>
    Wyrażam zgodę na otrzymywanie na podany adres poczty elektronicznej informacji handlowych
    dotyczących usług oraz w celu otrzymywania newslettera — więcej informacji uzyskają Państwo{" "}
    <Link
      target="_blank"
      rel="noopener"
      href={paths.privacyPolicy}
      color={color ?? "text.primary"}
      underline="always"
      sx={{ opacity }}
    >
      tutaj
    </Link>
    .
  </Typography>
);
