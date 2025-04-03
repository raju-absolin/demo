import {
	Box,
	FormHelperText,
	InputLabel,
	Checkbox,
	FormControlLabel,
	OutlinedInput,
} from "@mui/material";
import { Controller, FieldPath, FieldValues, PathValue } from "react-hook-form";
import { FormInputProps } from "@src/components";

const FormInput = <
	TFieldValues extends FieldValues = FieldValues,
	TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
	control,
	id,
	label,
	name,
	helperText,
	containerSx,
	minlength,
	maxlength,
	onChange,
	required,
	type, // Add a type prop to handle different input types like checkbox
	...other
}: FormInputProps<TFieldValues>) => {
	return (
		<Controller<TFieldValues, TName>
			control={control}
			defaultValue={"" as PathValue<TFieldValues, TName>} // for checkbox defaultValue can be changed to false
			render={({ field, fieldState }) => (
				<Box sx={containerSx}>
					{type === "checkbox" ? (
						<FormControlLabel
							control={
								<Checkbox
									id={id ?? name}
									{...field}
									required={required}
									checked={Boolean(field.value)} // handle boolean value
									onChange={(e) => {
										field.onChange(e.target.checked);
										onChange && onChange(e);
									}}
								/>
							}
							label={label}
						/>
					) : type === "number" ? (
						<>
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
							<OutlinedInput
								size="small"
								id={id ?? name}
								{...other}
								{...field}
								type="text"
								sx={(theme) => ({
									width: "100%",
									mt: 1,
									backgroundColor:
										theme.palette.background.paper,
									"&.Mui-disabled": {
										borderColor: fieldState.error
											? "red"
											: "#e6e6e6fd",
										"& .MuiOutlinedInput-notchedOutline": {
											borderColor: fieldState.error
												? "red"
												: "inherit",
										},
									},
								})}
								error={fieldState.error != null}
								inputProps={{
									minlength: minlength,
									maxlength: maxlength,
									style: {
										padding: "10px 12px",
									},
									onKeyDown: (e) => {
										if (
											!/[0-9.]/.test(e.key) &&
											e.key !== "Backspace"
										) {
											e.preventDefault();
										}
									},
								}}
								// inputProps={{ style: { padding: "10px 12px" } }}
								onChange={(e) => {
									field.onChange(e.target.value);
									onChange && onChange(e);
								}}
							/>
						</>
					) : (
						<>
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
							<OutlinedInput
								size="small"
								id={id ?? name}
								{...other}
								{...field}
								type={type}
								sx={(theme) => ({
									width: "100%",
									mt: 1,
									backgroundColor:
										theme.palette.background.paper,
									"&.Mui-disabled": {
										borderColor: fieldState.error
											? "red"
											: "#e6e6e6fd",
										"& .MuiOutlinedInput-notchedOutline": {
											borderColor: fieldState.error
												? "red"
												: "inherit",
										},
									},
								})}
								error={fieldState.error != null}
								inputProps={{ style: { padding: "10px 12px" } }}
								onChange={(e) => {
									field.onChange(e.target.value);
									onChange && onChange(e);
								}}
							/>
						</>
					)}
					{(helperText || fieldState.error?.message) && (
						<FormHelperText error={fieldState.error != null}>
							{fieldState.error?.message ?? helperText}
						</FormHelperText>
					)}
				</Box>
			)}
			name={name as TName}
		/>
	);
};

export default FormInput;
