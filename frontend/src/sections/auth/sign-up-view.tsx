"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Form } from "src/components/hook-form";

import { SignUpSchema } from "./components/schema";
import { SignUpForm } from "./components/sign-up-form";
import { FormSocials } from "./components/form-socials";
import { FormDivider } from "./components/form-divider";
import { SignUpTerms } from "./components/sign-up-terms";

import type { SignUpSchemaType } from "./components/schema";

// ----------------------------------------------------------------------
type Props = {
  header: React.ReactNode;
  buttonText?: string;
};

export function SignUpView({ header, buttonText = "Utwórz konto" }: Props) {
  const defaultValues: SignUpSchemaType = {
    email: "",
    password: "",
    confirmPassword: "",
  };

  const methods = useForm<SignUpSchemaType>({ resolver: zodResolver(SignUpSchema), defaultValues });

  const { reset, handleSubmit } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      reset();
      console.info("DATA", data);
    } catch (error) {
      console.error(error);
    }
  });

  return (
    <>
      {header}

      <Form methods={methods} onSubmit={onSubmit}>
        <SignUpForm buttonText={buttonText} />
      </Form>

      <SignUpTerms />

      <FormDivider label="lub" />

      <FormSocials />
    </>
  );
}
