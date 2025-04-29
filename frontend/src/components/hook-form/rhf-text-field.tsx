import type { TextFieldProps } from "@mui/material/TextField";

import InputMask from "react-input-mask-next";
import { Controller, useFormContext } from "react-hook-form";
import { transformValue, transformValueOnBlur, transformValueOnChange } from "minimal-shared/utils";

import TextField from "@mui/material/TextField";

// ----------------------------------------------------------------------

type RHFTextFieldProps = TextFieldProps & {
  name: string;
  mask?: string;
};

export function RHFTextField({
  name,
  helperText,
  slotProps,
  type = "text",
  mask,
  disabled,
  ...other
}: RHFTextFieldProps) {
  const { control } = useFormContext();

  const isNumberType = type === "number";

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <InputMask
          mask={mask || ""}
          value={field.value}
          onChange={(event) => {
            const transformedValue = isNumberType
              ? transformValueOnChange(event.target.value)
              : event.target.value;

            field.onChange(transformedValue);
          }}
          onBlur={(event) => {
            const transformedValue = isNumberType
              ? transformValueOnBlur(event.target.value)
              : event.target.value;

            field.onChange(transformedValue);
          }}
          disabled={disabled}
        >
          <TextField
            fullWidth
            value={isNumberType ? transformValue(field.value) : field.value}
            type={isNumberType ? "text" : type}
            error={!!error}
            helperText={error?.message ?? helperText}
            slotProps={{
              ...slotProps,
              htmlInput: {
                autoComplete: "off",
                ...slotProps?.htmlInput,
                ...(isNumberType && { inputMode: "decimal", pattern: "[0-9]*\\.?[0-9]*" }),
              },
            }}
            {...other}
          />
        </InputMask>
      )}
    />
  );
}
