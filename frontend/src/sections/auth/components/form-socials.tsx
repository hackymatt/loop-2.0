import type { BoxProps } from "@mui/material/Box";
import type { UseFormReturn } from "react-hook-form";
import type { TokenResponse } from "@react-oauth/google";

import { useGoogleLogin } from "@react-oauth/google";

import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";

import { useRouter } from "src/routes/hooks";

import { useFormErrorHandler } from "src/hooks/use-form-error-handler";

import { useLogin } from "src/api/auth/google-login";
import { GithubIcon, GoogleIcon, FacebookIcon } from "src/assets/icons";

import { useUserContext } from "src/components/user";

// ----------------------------------------------------------------------

type FormSocialsProps = BoxProps & { methods: UseFormReturn<any> };

export function FormSocials({ methods, sx, ...other }: FormSocialsProps) {
  return (
    <Box
      sx={[
        { gap: 1.5, display: "flex", justifyContent: "center" },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <GoogleSignIn methods={methods} />

      <GithubSignIn />

      <FacebookSignIn />
    </Box>
  );
}

function GoogleSignIn({ methods }: { methods: UseFormReturn<any> }) {
  const router = useRouter();
  const user = useUserContext();

  const { mutateAsync: googleLogin } = useLogin();

  const handleFormError = useFormErrorHandler(methods);

  const handleLogin = async (
    response: Omit<TokenResponse, "error" | "error_description" | "error_uri">
  ) => {
    const { access_token: token } = response;

    try {
      const { data: responseData } = await googleLogin({ token });
      const { email, access_token: accessToken, refresh_token: refreshToken } = responseData;
      user.setState({
        accessToken,
        refreshToken,
        isRegistered: true,
        isActive: true,
        isLoggedIn: true,
        email,
      });
    } catch (error) {
      handleFormError(error);
    }
  };

  const login = useGoogleLogin({
    onSuccess: handleLogin,
  });

  return (
    <IconButton color="inherit" onClick={() => login()}>
      <GoogleIcon />
    </IconButton>
  );
}

function GithubSignIn() {
  return (
    <IconButton color="inherit">
      <GithubIcon />
    </IconButton>
  );
}

function FacebookSignIn() {
  return (
    <IconButton color="inherit">
      <FacebookIcon />
    </IconButton>
  );
}
