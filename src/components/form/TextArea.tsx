import React, { memo } from "react";
import { TextareaAutosize as BaseTextareaAutosize } from "@mui/base/TextareaAutosize";
import {
	Control,
	Controller,
	FieldPath,
	FieldValues,
	PathValue,
} from "react-hook-form";
import { FormInputProps } from "@src/components";
import {
	Box,
	FormHelperText,
	InputLabel,
	styled,
	TextField,
} from "@mui/material";

function TextArea<
	TFieldValues extends FieldValues = FieldValues,
	TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
	control,
	id,
	label,
	name,
	minRows = 3,
	maxRows = 3,
	placeholder,
	helperText,
	containerSx,
	onChange,
	required,
	...other
}: FormInputProps<TFieldValues>) {
	const blue = {
		100: "#DAECFF",
		200: "#b6daff",
		400: "#3399FF",
		500: "#007FFF",
		600: "#0072E5",
		900: "#003A75",
	};

	const grey = {
		50: "#F3F6F9",
		100: "#E5EAF2",
		200: "#DAE2ED",
		300: "#C7D0DD",
		400: "#B0B8C4",
		500: "#9DA8B7",
		600: "#6B7A90",
		700: "#434D5B",
		800: "#303740",
		900: "#1C2025",
	};

	const red = {
		200: "#FFCDD2",
		600: "#fc0000",
	};

	const Textarea = styled(TextField, {
		shouldForwardProp: (prop) => prop !== "error",
	})<{ error?: boolean }>(
		({ theme, error }) => `
    box-sizing: border-box;
    width: 100%;
    font-family: "initial";
    font-size: 0.875rem;
    font-weight: 400;
    line-height: 1.5;
    border-radius: 8px;
    color: ${theme.palette.mode === "dark" ? grey[300] : grey[900]};
    background: ${theme.palette.background.paper};
    border: 1px solid ${
		error ? red[600] : theme.palette.mode === "dark" ? grey[700] : grey[200]
	};

	& > div {
	border : ${error && "none"}
	}
    
    &:hover {
      border-color: ${error ? red[600] : blue[400]};
    }



    // firefox
    &:focus-visible {
      outline: 0;
    }
  `
	);

	return (
		<Controller<TFieldValues, TName>
			control={control}
			name={name as TName}
			render={({ field, fieldState }) => {
				const handleChange = React.useCallback(
					(event: React.ChangeEvent<HTMLTextAreaElement>) => {
						field.onChange(event.target.value);
						onChange && onChange(event);
					},
					[field, onChange]
				);

				return (
					<Box sx={containerSx}>
						<InputLabel
							sx={{
								".MuiInputLabel-asterisk": {
									color: "red",
								},
							}}
							required={required}
							htmlFor={id ?? name}
							style={{ fontWeight: "medium" }}
							error={fieldState.error != null}>
							{label}
						</InputLabel>
						<Textarea
							{...field}
							id={name}
							multiline
							aria-label={name}
							minRows={minRows}
							maxRows={maxRows}
							placeholder={placeholder}
							error={fieldState.error != null}
							onChange={handleChange}
							value={field.value || ""}
						/>
						{(helperText || fieldState.error?.message) && (
							<FormHelperText error={fieldState.error != null}>
								{fieldState.error?.message ?? helperText}
							</FormHelperText>
						)}
					</Box>
				);
			}}
		/>
	);
}

export default memo(TextArea) as typeof TextArea;
