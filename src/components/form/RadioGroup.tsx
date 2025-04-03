import React from "react";
import {
	Box,
	FormControl,
	FormLabel,
	Radio,
	RadioGroup,
	FormControlLabel,
	FormHelperText,
	RadioGroupProps,
	RadioProps,
	SxProps,
} from "@mui/material";
import {
	Controller,
	FieldValues,
	FieldPath,
	PathValue,
	Control,
} from "react-hook-form";

interface CustomRadioGroupProps<
	TFieldValues extends FieldValues = FieldValues,
	TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends Omit<RadioGroupProps, "name" | "defaultValue" | "onChange"> {
	control: Control<TFieldValues>; // Control prop from react-hook-form
	name: TName; // Name of the field
	label: string; // Label for the radio group
	options: {
		label: string;
		value: string | number;
		radioProps?: RadioProps;
	}[]; // Array of radio options
	defaultValue?: PathValue<TFieldValues, TName>; // Optional default value for the field
	helperText?: string; // Optional helper text or error message
	containerSx?: SxProps; // Optional styles for the container
	onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void; // Optional change handler
	row?: boolean; // Optional prop to set radios in a row
}

const CustomRadioGroup = <
	TFieldValues extends FieldValues = FieldValues,
	TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
	control,
	name,
	label,
	options,
	defaultValue,
	row, // Handle row prop to place radios horizontally
	helperText,
	containerSx,
	onChange,
	...radioGroupProps
}: CustomRadioGroupProps<TFieldValues, TName>) => {
	return (
		<Controller<TFieldValues, TName>
			control={control}
			name={name}
			defaultValue={
				defaultValue ?? ("" as PathValue<TFieldValues, TName>)
			} // Set default value for radios
			render={({ field, fieldState }) => (
				<FormControl
					component="fieldset"
					error={Boolean(fieldState.error)}
					sx={containerSx}>
					<FormLabel component="legend">{label}</FormLabel>
					<RadioGroup
						{...field}
						{...radioGroupProps} // Spread additional RadioGroup props
						row={row} // Optionally place radio buttons in a row
						onChange={(e) => {
							field.onChange(e.target.value);
							onChange && onChange(e); // Call onChange if provided
						}}>
						{options.map((option) => (
							<FormControlLabel
								key={option.value}
								value={option.value}
								control={<Radio {...option.radioProps} />} // Spread Radio props
								label={option.label}
							/>
						))}
					</RadioGroup>
					{(helperText || fieldState.error?.message) && (
						<FormHelperText>
							{fieldState.error?.message || helperText}
						</FormHelperText>
					)}
				</FormControl>
			)}
		/>
	);
};

export default CustomRadioGroup;
