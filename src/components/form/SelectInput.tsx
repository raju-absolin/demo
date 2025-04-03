import React, { useEffect, useState, useRef, ReactNode } from "react";
import {
	Box,
	FormHelperText,
	InputLabel,
	MenuItem,
	OutlinedInput,
	Select,
	Typography,
	CircularProgress,
} from "@mui/material";
import { Controller, FieldPath, FieldValues } from "react-hook-form";
import { FormInputProps } from "./types";
import axios from "axios"; // Use axios or any other fetch library

type SelectProps = {
	data: {
		id: string | number;
		name: string;
	}[];
	loading: boolean;
	page: number;
	hasMore: number;
	children?: ReactNode;
	dispatchfn: () => void;
};

const SelectInput = <
	TFieldValues extends FieldValues = FieldValues,
	TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
	control,
	children,
	id,
	label,
	name,
	helperText,
	containerSx,
	data,
	loading,
	page,
	hasMore,
	dispatchfn,
	placeholder,
	...other
}: FormInputProps<TFieldValues> & SelectProps) => {
	const containerRef = useRef<HTMLDivElement>(null);

	// Infinite scroll handler
	const handleScroll = () => {
		if (containerRef.current) {
			const { scrollTop, scrollHeight, clientHeight } =
				containerRef.current;
			// If the user is near the bottom of the container, load more data
			if (
				scrollTop + clientHeight >= scrollHeight - 50 &&
				!loading &&
				hasMore
			) {
				// setPage((prevPage) => prevPage + 1); // Increment the page for next API call
			}
		}
	};

	// Add scroll event listener
	useEffect(() => {
		const container = containerRef.current;
		if (container) {
			container.addEventListener("scroll", handleScroll);
			return () => {
				container.removeEventListener("scroll", handleScroll);
			};
		}
	}, [loading, hasMore]);

	return (
		<Controller<TFieldValues, TName>
			control={control}
			name={name as TName}
			render={({ field, fieldState }: any) => (
				<Box
					sx={containerSx}
					ref={containerRef}
					style={{ maxHeight: 300, overflow: "auto" }}>
					<InputLabel
						htmlFor={id ?? name}
						style={{ fontWeight: "medium" }}
						error={fieldState.error != null}>
						{label}
					</InputLabel>
					<Select
						size="small"
						id={id ?? name}
						{...other}
						{...field}
						value={field.value} // Set the value here
						onChange={(event) => {
							const selectedValue =
								event.target.value &&
								JSON.parse(event.target.value as string);
							field.onChange(selectedValue); // Pass the selected value back to the form control
						}}
						sx={{
							width: "100%",
							mt: 1,
							"& > .MuiSelect-outlined": { py: "10px" },
						}}
						error={fieldState.error != null}
						inputProps={{ style: { padding: "10px 12px" } }}>
						{/* Placeholder option */}
						<MenuItem value="" disabled>
							<Typography color="gray">{placeholder}</Typography>
						</MenuItem>
						{data.length ? (
							data.map((item, index) => (
								<MenuItem
									key={index}
									value={JSON.stringify(item)}>
									{item.name}
								</MenuItem>
							))
						) : (
							<MenuItem value="">No Data</MenuItem>
						)}
					</Select>
					{loading && (
						<Box display="flex" justifyContent="center" mt={2}>
							<CircularProgress size={24} />
						</Box>
					)}
					{(helperText || fieldState.error?.id?.message) && (
						<FormHelperText error={fieldState.error != null}>
							{fieldState.error?.id?.message ?? helperText}
						</FormHelperText>
					)}
				</Box>
			)}
		/>
	);
};

export default SelectInput;
