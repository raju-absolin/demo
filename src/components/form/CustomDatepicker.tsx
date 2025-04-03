import React, { forwardRef, useCallback } from "react";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import {
	TextField,
	InputAdornment,
	IconButton,
	FormHelperText,
	InputLabel,
	Box,
	OutlinedInput,
	styled,
} from "@mui/material";
import { PopperProps } from "@mui/material"
import { CalendarToday } from "@mui/icons-material";
import moment from "moment";
import { Controller, FieldValues, Control, FieldPath } from "react-hook-form";

interface DatePickerInputProps {
	onClick?: () => void;
	value?: string | Date;
	variant?: string;
	inputClass: string;
	children?: React.ReactNode;
	hasError?: boolean;
	disabled?: boolean;
	slotProps?: PopperProps;
}

const DatePickerInput = forwardRef<HTMLInputElement, DatePickerInputProps>(
	({ inputClass, onClick, value, hasError, disabled }, ref) => (
		<OutlinedInput
			type="text"
			className={`${inputClass} ${hasError ? "error" : ""}`}
			onClick={onClick}
			value={value instanceof Date ? value.toLocaleDateString() : value}
			placeholder={"Select a date"}
			readOnly
			ref={ref}
			fullWidth
			size="small"
			error={hasError}
			disabled={disabled}
			endAdornment={
				<InputAdornment position="end">
					{!value && <IconButton onClick={onClick}>
						<CalendarToday
							sx={{
								fontSize: "18px",
							}}
						/>
					</IconButton>
					}
				</InputAdornment>
			}
		/>
	)
);

const DatePickerInputWithAddon = forwardRef<
	HTMLInputElement,
	DatePickerInputProps
>(({ inputClass, onClick, value, variant, hasError }, ref) => (
	<div className={hasError ? "error" : ""}>
		<input
			type="text"
			className={`${inputClass} ${hasError ? "error" : ""}`}
			onClick={onClick}
			value={value instanceof Date ? value.toLocaleDateString() : value}
			readOnly
			ref={ref}
		/>
		<span className={variant}>
			<i className="ri-calendar-todo-fill" />
		</span>
	</div>
));

// Styled component for the custom DatePicker
const StyledDatePicker = styled("div")(({ theme }) => ({
	width: "100%",
	"& > .react-datepicker-wrapper": {
		width: "100%",
	},
	"& .react-datepicker": {
		borderRadius: "10px",
		boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.1)",
		border: `1px solid ${theme.palette.divider}`,
		fontFamily: theme.typography.fontFamily,
		fontSize: "14px",
		[theme.breakpoints.down("sm")]: {
			fontSize: "12px", // Adjust for smaller screens
		},
	},
	"& .react-datepicker__header": {
		backgroundColor: theme.palette.grey[100],
		borderBottom: "none",
		borderTopLeftRadius: "10px",
		borderTopRightRadius: "10px",
	},
	"& .react-datepicker__time-container ": {
		width: "130px",
		"& .react-datepicker__time": {
			"& .react-datepicker__time-box": {
				width: "100%",
			},
		},
	},
	"& .react-datepicker__current-month": {
		fontWeight: theme.typography.fontWeightMedium,
		fontSize: "16px",
	},
	"& .react-datepicker__day--selected": {
		backgroundColor: theme.palette.primary.main,
		color: theme.palette.primary.contrastText,
		borderRadius: "50%",
	},
	"& .react-datepicker__day:hover": {
		backgroundColor: theme.palette.action.hover,
		borderRadius: "50%",
	},
	"& .react-datepicker__day--keyboard-selected": {
		backgroundColor: theme.palette.primary.main,
		color: theme.palette.primary.contrastText,
	},
	"& .react-datepicker__day-name": {
		fontWeight: theme.typography.fontWeightMedium,
	},
	"& .react-datepicker__day--outside-month": {
		color: theme.palette.secondary.light,
	},
}));

interface CustomDatepickerProps<
	TFieldValues extends FieldValues = FieldValues,
> {
	value?: Date;
	hideAddon?: boolean;
	variant?: string;
	inputClass: string;
	dateFormat?: string;
	minDate?: Date;
	maxDate?: Date;
	showTimeSelect?: boolean;
	tI?: number;
	timeCaption?: string;
	timeFormat?: string;
	showTimeSelectOnly?: boolean;
	monthsShown?: number;
	inline?: boolean;
	control: Control<TFieldValues>;
	name: FieldPath<TFieldValues>;
	label: string;
	filterTime?: () => void;
	filterDate?: () => void;
	disabled?: boolean;
	helperText?: string;
	required?: boolean;
	slotProps?: PopperProps;
}

const CustomDatepicker = <TFieldValues extends FieldValues = FieldValues>({
	control,
	name,
	label,
	required,
	helperText,
	...props
}: CustomDatepickerProps<TFieldValues>) => {
	const handleDateTimeChange = useCallback(
		(
			date: Date | null,
			fieldValue: Date | null,
			onChange: (value: any) => void
		) => {
			if (date) {
				if (fieldValue) {
					const existingMoment = moment(fieldValue);
					const newMoment = moment(date);

					// Preserve the existing time if only date has changed
					if (
						existingMoment.format("HH:mm:ss") ==
						newMoment.format("HH:mm:ss")
					) {
						newMoment.hour(existingMoment.hour());
						newMoment.minute(existingMoment.minute());
						newMoment.second(existingMoment.second());
					}

					onChange(newMoment.toDate());
				} else {
					onChange(date);
				}
			} else {
				onChange(null);
			}
		},
		[]
	);

	return (
		<Controller<TFieldValues>
			control={control}
			name={name}
			render={({
				field: { onChange, onBlur, value, ref },
				fieldState,
			}) => {
				const hasError = !!fieldState.error;
				const CustomInput = props.hideAddon
					? DatePickerInput
					: DatePickerInputWithAddon;
				return (
					<Box>
						<InputLabel
							id={name}
							required={required}
							style={{
								fontWeight: "medium",
								marginBottom: "10px",
							}}
							error={fieldState.error != null}>
							{label}
						</InputLabel>
						<StyledDatePicker>
							<DatePicker
								disabled={
									props.disabled ? props.disabled : false
								}
								selected={value ? new Date(value) : null}
								isClearable
								value={
									value
										? moment(value).format(props.dateFormat)
										: ""
								}
								onChange={(date: Date | null) =>
									handleDateTimeChange(date, value, onChange)
								}
								onBlur={onBlur}
								customInput={
									<CustomInput
										ref={ref}
										variant={props.variant}
										inputClass={props.inputClass}
										value={value}
										hasError={hasError}
										slotProps={props?.slotProps}
									/>
								}
								timeIntervals={props.tI}
								showTimeSelect={props.showTimeSelect}
								timeFormat={props.timeFormat}
								timeCaption={props.timeCaption}
								dateFormat={props.dateFormat}
								minDate={props.minDate}
								maxDate={props.maxDate}
								monthsShown={props.monthsShown}
								showTimeSelectOnly={props.showTimeSelectOnly}
								inline={props.inline}
								autoComplete="off"
							/>
						</StyledDatePicker>
						{helperText && (
							<FormHelperText>{helperText}</FormHelperText>
						)}
						{fieldState.error?.message && (
							<FormHelperText error>
								{fieldState.error?.message}
							</FormHelperText>
						)}
					</Box>
				);
			}}
		/>
	);
};

export default CustomDatepicker;
