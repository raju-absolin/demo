import {
	Box,
	FormControl,
	FormHelperText,
	InputLabel,
	MenuItem,
	OutlinedInput,
	Select,
} from "@mui/material";
import { Controller, FieldPath, FieldValues, PathValue } from "react-hook-form";
import { FormSelectProps } from "@src/components"; // Ensure that FormSelectProps is correctly typed

// Ensure that FormSelectProps is properly defined
type FormSelectProps<TFieldValues extends FieldValues> = {
	control: any;
	id?: string;
	label: string;
	name: FieldPath<TFieldValues>;
	helperText?: string;
	options: any[]; // You may need to provide more specific types based on your options array
	getOptionLabel: (option: any) => string; // Adjust based on the type of your options
	getOptionValue: (option: any) => string | number; // Adjust based on your option's value type
	containerSx?: object;
};

const FormMultiSelect = <
	TFieldValues extends FieldValues = FieldValues,
	TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
	control,
	id,
	label,
	name,
	helperText,
	options, // List of options for the select
	getOptionLabel, // Function to extract label from option (e.g., vendor.name)
	getOptionValue, // Function to extract value from option (e.g., vendor.id)
	containerSx,
	...other
}: FormSelectProps<TFieldValues>) => {
	return (
		<Controller<TFieldValues, TName>
			control={control}
			defaultValue={[] as PathValue<TFieldValues, TName>} // Default empty array for multiple select
			render={({ field, fieldState }) => (
				<Box sx={containerSx}>
					<FormControl fullWidth error={fieldState.error != null}>
						<InputLabel id={`${id ?? name}-label`}>
							{label}
						</InputLabel>
						<Select
							labelId={`${id ?? name}-label`}
							id={id ?? name}
							multiple
							value={field.value}
							onChange={field.onChange}
							input={<OutlinedInput label={label} />}
							{...other}>
							{options.map((option) => (
								<MenuItem
									key={getOptionValue(option)}
									value={getOptionValue(option)}>
									{getOptionLabel(option)}
								</MenuItem>
							))}
						</Select>
						{(helperText || fieldState.error?.message) && (
							<FormHelperText>
								{fieldState.error?.message ?? helperText}
							</FormHelperText>
						)}
					</FormControl>
				</Box>
			)}
			name={name as TName}
		/>
	);
};

export default FormMultiSelect;
