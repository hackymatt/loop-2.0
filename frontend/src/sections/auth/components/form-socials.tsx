import "./styles.css";

import type { BoxProps } from "@mui/material/Box";
import type { UseFormReturn } from "react-hook-form";
import type { TokenResponse } from "@react-oauth/google";
import type { ReactFacebookLoginInfo } from "react-facebook-login";

import GitHubLogin from "react-github-login";
import { useGoogleLogin } from "@react-oauth/google";
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";

import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";

import { paths } from "src/routes/paths";
import { useRouter } from "src/routes/hooks";

import { useFormErrorHandler } from "src/hooks/use-form-error-handler";

import { CONFIG } from "src/global-config";
import { useLoginGithub } from "src/api/auth/github-login";
import { useLoginGoogle } from "src/api/auth/google-login";
import { useLoginFacebook } from "src/api/auth/facebook-login";
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

      <GithubSignIn methods={methods} />

      <FacebookSignIn methods={methods} />
    </Box>
  );
}

function GoogleSignIn({ methods }: { methods: UseFormReturn<any> }) {
  const router = useRouter();
  const user = useUserContext();

  const { mutateAsync: googleLogin } = useLoginGoogle();

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
      router.push(paths.dashboard);
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

function GithubSignIn({ methods }: { methods: UseFormReturn<any> }) {
  const router = useRouter();
  const user = useUserContext();

  const { mutateAsync: githubLogin } = useLoginGithub();

  const handleFormError = useFormErrorHandler(methods);

  const handleLogin = async (response: { code: string }) => {
    console.log(response);
    const { code } = response;

    try {
      const { data: responseData } = await githubLogin({ code });
      const { email, access_token: accessToken, refresh_token: refreshToken } = responseData;
      user.setState({
        accessToken,
        refreshToken,
        isRegistered: true,
        isActive: true,
        isLoggedIn: true,
        email,
      });
      router.push(paths.dashboard);
    } catch (error) {
      handleFormError(error);
    }
  };

  return (
    <GitHubLogin
      clientId={CONFIG.githubClientId}
      onSuccess={handleLogin}
      className="github-login-button"
      scope={["user:email", "read:user"].join(",")}
      redirectUri={`${window.location.origin}/auth/github/callback`}
    >
      <GithubIcon />
    </GitHubLogin>
  );
}

function FacebookSignIn({ methods }: { methods: UseFormReturn<any> }) {
  const router = useRouter();
  const user = useUserContext();

  const { mutateAsync: facebookLogin } = useLoginFacebook();

  const handleFormError = useFormErrorHandler(methods);

  const handleLogin = async (response: ReactFacebookLoginInfo) => {
    console.log(response);
    const { accessToken: access_token } = response;

    try {
      const { data: responseData } = await facebookLogin({ access_token });
      const { email, access_token: accessToken, refresh_token: refreshToken } = responseData;
      user.setState({
        accessToken,
        refreshToken,
        isRegistered: true,
        isActive: true,
        isLoggedIn: true,
        email,
      });
      router.push(paths.dashboard);
    } catch (error) {
      handleFormError(error);
    }
  };

  return (
    <FacebookLogin
      appId={CONFIG.facebookClientId}
      autoLoad
      callback={handleLogin}
      render={(renderProps) => (
        <IconButton color="inherit" onClick={renderProps.onClick}>
          <FacebookIcon />
        </IconButton>
      )}
    />
  );
}
