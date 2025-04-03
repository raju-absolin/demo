import React, { CSSProperties, useCallback, useEffect } from "react";
import Select from "react-select";
import {
	useController,
	FieldPath,
	FieldValues,
	Controller,
	Control,
} from "react-hook-form";
import { useAppDispatch } from "@src/store/store";
import { RootState } from "@src/store/store";
import { miniType } from "@src/store/mini/mini.Types";
import { Box, FormHelperText, InputLabel, useTheme } from "@mui/material";
import { PageParamsTypes } from "@src/common/common.types";
import { Dispatch, PayloadActionCreator } from "@reduxjs/toolkit";
import { FormInputProps } from "./types";
import { debounce } from "@src/helpers";

// Define the props for the SelectComponent
interface SelectComponentProps {
	name: string;
	label: string;
	control: Control<any>; // Control type from react-hook-form
	rules?: any; // Validation rules (can be typed more strictly)
	options: {
		id: any;
		name: string;
	}[];
	loading?: boolean;
	selectParams?: PageParamsTypes & any;
	hasMore?: boolean;
	required?: boolean;
	fetchapi?: Function;
	multiple?: boolean;
	disabled?: boolean;
	helperText?: string;
	dropDownPositoning?: string;
	clearData?: PayloadActionCreator;
	placeholder?: string;
	onChange?: (value: any) => void;
	extraProps?: any;
}

// Define the Option type (should match the Redux store type)
interface Option {
	value: string;
	label: string;
}

const SelectComponent: React.FC<SelectComponentProps> = <
	TFieldValues extends FieldValues = FieldValues,
	TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
	name,
	label,
	control,
	rules,
	options,
	loading,
	selectParams,
	hasMore,
	fetchapi,
	clearData,
	multiple = false,
	disabled = false,
	helperText,
	onChange,
	placeholder,
	required,
	dropDownPositoning = "absolute",
	extraProps,
}: FormInputProps<TFieldValues> & SelectComponentProps) => {
	const dispatch = useAppDispatch();

	// Load more options on scroll
	const loadMoreOptions = () => {
		if (!loading && hasMore && fetchapi && selectParams) {
			dispatch(
				fetchapi({
					...selectParams,
					page: selectParams.page + 1,
				})
			);
		}
	};

	const handleInputChange = useCallback(
		debounce((value: string) => {
			if (!loading && fetchapi && selectParams) {
				dispatch(
					fetchapi({
						...selectParams,
						page: 1,
						search: value,
					})
				);
			}
		}, 300),
		[loading, fetchapi, selectParams]
	);

	const theme = useTheme();

	return (
		<>
			<Controller<TFieldValues, TName>
				control={control}
				name={name as TName}
				render={({ field, fieldState }: any) => (
					<Box>
						<InputLabel
							sx={{
								".MuiInputLabel-asterisk": {
									color: "red",
								},
							}}
							id={name}
							required={required}
							style={{
								fontWeight: "medium",
								marginBottom: "7px",
							}}
							error={fieldState.error != null}>
							{label}
						</InputLabel>
						<Select
							id={name}
							{...field}
							menuPlacement="auto"
							menuPosition={
								dropDownPositoning !== "relative" && "fixed"
							}
							isMulti={multiple}
							isDisabled={disabled}
							placeholder={
								placeholder
									? placeholder
									: `Select ${label.toLowerCase()}`
							}
							// this can be overwritten in the outside component.
							options={options.map((option) => ({
								...option,
								value: option.id, // Assuming `miniType` has an `id`
								label: option.name, // Assuming `miniType` has a `name`
							}))}
							value={field.value}
							styles={{
								control: (base, state) => ({
									...base,
									background: theme.palette.background.paper,
									borderColor: fieldState.error
										? "red"
										: base.borderColor, // Apply red border on error
									boxShadow: fieldState.error
										? "0 0 0 0.1px red"
										: state.isFocused
											? "0 0 0 0.1px #2684FF"
											: base.boxShadow,

									"&:hover": {
										borderColor: fieldState.error
											? "red"
											: state.isFocused
												? "#2684FF"
												: base.borderColor,
									},
								}),
								placeholder: (base) => ({
									...base,
									fontSize: "13px", // Customize the font size
									fontFamily: "inherit",
									color: "#acacac", // You can change the color if needed
									fontWeight: 300,
								}),
								singleValue: (base) => ({
									...base,
									fontSize: "14px", // Selected option label font size
									color: theme.palette.text,
								}),
								menu: (base) => ({
									...base,
									fontSize: "14px", // Adjust the overall menu font size
									padding: "5px", // Control padding inside the dropdown menu
									color: theme.palette.text,
									background: theme.palette.background.paper,
									position: dropDownPositoning, // Ensure the dropdown is positioned outside the modal
									zindex: 2,
								}),
								option: (base, state) => ({
									...base,
									fontSize: "14px",
									padding: "10px 15px",
									backgroundColor: state.isSelected
										? "#2684FF"
										: theme.palette.background.paper, // Selected item color
									"&:hover": {
										backgroundColor:
											theme.palette.secondary.light, // Change this to your desired hover color
									},
								}),

								// Apply custom style for dropdown indicators if needed
								dropdownIndicator: (base) => ({
									...base,
									color: fieldState.error
										? "red"
										: base.color,
								}),
							}}
							onChange={(val) => {
								field.onChange(val);
								onChange && onChange(val);
							}}
							onBlur={field.onBlur}
							isLoading={loading}
							onMenuScrollToBottom={loadMoreOptions} // Infinite scroll trigger
							onMenuClose={() => {
								clearData && dispatch(clearData());
							}}
							onInputChange={(inputValue, { action }) => {
								// Only trigger search on user input, not on select/deselect
								if (action === "input-change") {
									handleInputChange(inputValue);
								}
							}}
							onMenuOpen={() => {
								fetchapi &&
									dispatch(
										fetchapi({
											...selectParams,
											page: 1,
										})
									);
							}}
							isClearable
							{...extraProps}
						/>

						{helperText && (
							<FormHelperText error={fieldState.error != null}>
								{helperText}
							</FormHelperText>
						)}
						{fieldState.error?.label?.message && (
							<FormHelperText error={fieldState.error != null}>
								{fieldState.error?.label?.message}
							</FormHelperText>
						)}
						{fieldState.error?.message && (
							<FormHelperText error={fieldState.error != null}>
								{fieldState.error?.message}
							</FormHelperText>
						)}
					</Box>
				)}
			/>
		</>
	);
};

export default SelectComponent;
