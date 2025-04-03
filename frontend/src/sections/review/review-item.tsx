import type { IReviewItemProp } from "src/types/review";
import type { Theme, SxProps } from "@mui/material/styles";

import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Rating from "@mui/material/Rating";
import Typography from "@mui/material/Typography";
import { svgIconClasses } from "@mui/material/SvgIcon";

import { fDate } from "src/utils/format-time";

import { DEFAULT_AVATAR_URL } from "src/consts/avatar";

// ----------------------------------------------------------------------

type Props = Partial<IReviewItemProp> & {
  sx?: SxProps<Theme>;
};

export function ReviewItem({ student, rating, message, createdAt, sx }: Props) {
  const renderContent = () => (
    <Box sx={{ gap: 1, display: "flex", flexDirection: "column" }}>
      <Rating
        size="small"
        value={rating}
        precision={0.5}
        readOnly
        sx={{ [`& .${svgIconClasses.root}`]: { color: "warning.main" } }}
      />

      <Typography variant="subtitle1">{student?.name}</Typography>

      {createdAt && (
        <Typography variant="caption" sx={{ color: "text.disabled" }}>
          {fDate(createdAt)}
        </Typography>
      )}

      {message && <Typography variant="body2">{message}</Typography>}
    </Box>
  );

  return (
    <Box
      sx={[
        (theme) => ({
          py: 4,
          display: "flex",
          borderBottom: `solid 1px ${theme.vars.palette.divider}`,
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      <Avatar
        alt={student?.name}
        src={student?.avatarUrl || DEFAULT_AVATAR_URL}
        sx={{ width: 64, height: 64, mr: 2.5 }}
      />

      {renderContent()}
    </Box>
  );
}
