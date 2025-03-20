import type { BoxProps } from "@mui/material/Box";
import type { Theme } from "@mui/material/styles";
import type { ITeamMemberProps } from "src/types/team";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";

import { _socials } from "src/_mock";
import { TwitterIcon, FacebookIcon, LinkedinIcon, InstagramIcon } from "src/assets/icons";

import { Image, imageClasses } from "src/components/image";

// ----------------------------------------------------------------------

type Props = BoxProps & {
  members: ITeamMemberProps[];
};

export function TravelTeam({ members, sx, ...other }: Props) {
  return (
    <Box
      component="section"
      sx={[{ pb: { md: 5 }, pt: { xs: 5, md: 10 } }, ...(Array.isArray(sx) ? sx : [sx])]}
      {...other}
    >
      <Container>
        <Box sx={{ mx: "auto", maxWidth: 480, textAlign: "center", mb: { xs: 5, md: 10 } }}>
          <Typography variant="h2">Our team</Typography>
          <Typography sx={{ mt: 3, color: "text.secondary" }}>
            Etiam sollicitudin, ipsum eu pulvinar rutrum, tellus ipsum laoreet sapien, quis
            venenatis ante odio sit amet eros.
          </Typography>
        </Box>

        <Box
          sx={{
            columnGap: 3,
            display: "grid",
            rowGap: { xs: 4, md: 5 },
            gridTemplateColumns: {
              xs: "repeat(1, 1fr)",
              sm: "repeat(2, 1fr)",
              md: "repeat(4, 1fr)",
            },
          }}
        >
          {members.map((item) => (
            <MemberItem key={item.id} item={item} />
          ))}
        </Box>
      </Container>
    </Box>
  );
}

// ----------------------------------------------------------------------

type MemberItemProps = BoxProps & {
  item: ITeamMemberProps;
};

const transition = (theme: Theme) =>
  theme.transitions.create(["opacity", "transform"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.short,
  });

export function MemberItem({ item, sx, ...other }: MemberItemProps) {
  const renderSocials = () => (
    <>
      {_socials.map((social) => (
        <IconButton key={social.label}>
          {social.value === "twitter" && <TwitterIcon sx={{ color: "common.white" }} />}
          {social.value === "facebook" && <FacebookIcon />}
          {social.value === "instagram" && <InstagramIcon />}
          {social.value === "linkedin" && <LinkedinIcon />}
        </IconButton>
      ))}
    </>
  );

  const renderContent = () => (
    <Box
      className="content"
      sx={{
        transition,
        py: 3,
        left: 0,
        width: 1,
        zIndex: 9,
        bottom: 0,
        opacity: 0,
        display: "flex",
        alignItems: "center",
        position: "absolute",
        color: "common.white",
        flexDirection: "column",
      }}
    >
      <Typography variant="h6">{item.name}</Typography>
      <Typography variant="body2" sx={{ mt: 0.75, mb: 1.5, opacity: 0.72 }}>
        {item.role}
      </Typography>
      <Box sx={{ display: "flex" }}>{renderSocials()}</Box>
    </Box>
  );

  return (
    <Box
      sx={[
        {
          borderRadius: 2,
          overflow: "hidden",
          position: "relative",
          "&:hover": {
            "& .content": { opacity: 1 },
            [`& .${imageClasses.root}`]: { transform: "scale(1.06)" },
            [`& .${imageClasses.overlay}`]: { opacity: 1 },
          },
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      {renderContent()}

      <Image
        alt={item.name}
        src={item.photoUrl}
        ratio="3/4"
        sx={{ transition }}
        slotProps={{
          overlay: {
            sx: (theme) => ({
              transition,
              opacity: 0,
              backgroundImage: `linear-gradient(to bottom, transparent 0%, ${
                theme.vars.palette.common.black
              } 75%)`,
            }),
          },
        }}
      />
    </Box>
  );
}
