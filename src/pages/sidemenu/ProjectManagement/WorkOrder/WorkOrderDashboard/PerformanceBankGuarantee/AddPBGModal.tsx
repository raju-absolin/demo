import { yupResolver } from "@hookform/resolvers/yup";
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	IconButton,
	Grid2 as Grid,
	Stack,
	FormHelperText,
	InputLabel,
	OutlinedInput,
	styled,
	List,
} from "@mui/material";
import { CustomDatepicker, FileType, FileUploader, FormInput, HorizontalFilePreview } from "@src/components";
import SelectComponent from "@src/components/form/SelectComponent";
import TextArea from "@src/components/form/TextArea";
import { getMiniUsers, getMiniUserTypes } from "@src/store/mini/mini.Action";
import {
	clearMiniUsers,
	clearMiniUserTypes,
	miniSelector,
} from "@src/store/mini/mini.Slice";
import {
	editProjectPerformanceBankGuarantees,
	postPerformanceBankGuaranteeMembers,
} from "@src/store/sidemenu/project_management/PerformanceBankGuarantee/PBG.action";
import {
	PerformanceBankGuaranteeState,
	PerformanceBankGuarantee,
} from "@src/store/sidemenu/project_management/PerformanceBankGuarantee/PBG.types";
import { useAppDispatch, useAppSelector } from "@src/store/store";
import moment from "moment";
import { Controller, useForm } from "react-hook-form";
import { LuPlus, LuX } from "react-icons/lu";
import * as yup from "yup";
import { performanceBankGuaranteeSelector, selectPerformanceBankGuarantees, setAttachments, setSelectedData } from "@src/store/sidemenu/project_management/PerformanceBankGuarantee/PBG.slice";
import { useEffect } from "react";

interface Props {
	open: boolean;
	hide: (reset: any) => void;
	selectedData: PerformanceBankGuarantee;
	project_id: string;
	params: PerformanceBankGuaranteeState["pageParams"];
}
const ScrollableList = styled(List)(({ theme }) => ({
	maxHeight: "200px",
	marginTop: "0px",
	overflowY: "auto",
	padding: "0 8px",
	"&::-webkit-scrollbar": {
		width: "8px",
	},
	"&::-webkit-scrollbar-thumb": {
		backgroundColor: theme.palette.primary.main,
		borderRadius: "8px",
	},
}));

const AddTeamMembers = ({
	open,
	hide,
	selectedData,
	project_id,
	params,
}: Props) => {
	const dispatch = useAppDispatch();
	const {
		performanceBankGuarantee: {
			attachments,
		},
		workOrder: { selectedData: projectData },
		system: { userAccessList },
	} = useAppSelector((state) => selectPerformanceBankGuarantees(state));

	const BankPerformanceSchema = yup.object().shape({
		number: yup
			.string()
			.max(15, "PBG number cannot exceed 15 digits")
			.required("Please enter your PBG number"),
		value: yup
			.string()
			.max(10, "PBG value cannot exceed 10 digits")
			.required("Please enter your PBG value"),
		issuedate: yup.string().required("Please select a issuedate"),
		expirydate: yup
			.date()
			.transform((curr, orig) => (orig === "" ? null : new Date(curr)))
			.test(
				"expiry-date-validation",
				"Date Of Expiry cannot be earlier than the issue date",
				function (value) {
					const { issuedate } = this.parent;
					if (!value || !issuedate) return true;
					const issueTimestamp = new Date(issuedate).getTime();
					const expiryTimestamp = new Date(value).getTime();

					return expiryTimestamp >= issueTimestamp;
				}
			)
			.required("Date Of Expiry is required"),


		claimdate: yup.string().required("Please select a claimdate"),
		remarks: yup.string().required("Please select a remarks"),
	});

	const {
		control,
		handleSubmit,
		reset,
		getValues,
		//formState: { errors },
	} = useForm<any>({
		resolver: yupResolver(BankPerformanceSchema),
		values: {
			number: selectedData?.number || "",
			value: selectedData?.value || "",
			issuedate: selectedData?.issuedate || "",
			expirydate: selectedData?.expirydate || "",
			claimdate: selectedData?.claimdate || "",
			remarks: selectedData?.remarks || "",
		},
	});
	const issue_date = getValues("issuedate");

	const handleAdd = (payload: {
		number: string;
		value: string;
		issuedate: string;
		expirydate: string;
		claimdate: string;
		remarks: string;
		dodelete?: string;
	}) => {
		const data = {
			project_id: project_id ? project_id : "",
			number: payload?.number,
			value: payload?.value,
			issuedate: payload?.issuedate
				? moment(payload?.issuedate).format("YYYY-MM-DD")
				: "",
			expirydate: payload?.expirydate
				? moment(payload?.expirydate).format("YYYY-MM-DD")
				: "",
			claimdate: payload?.claimdate
				? moment(payload?.claimdate).format("YYYY-MM-DD")
				: "",
			file: attachments ? attachments[0]?.originalObj : null,
			remarks: payload?.remarks,
		};

		!selectedData?.id
			? dispatch(
				postPerformanceBankGuaranteeMembers({
					data,
					hide: () => {
						hide(reset);
					},
					params,
				})
			)
			: dispatch(
				editProjectPerformanceBankGuarantees({
					id: selectedData?.id || "",
					data,
					hide: () => {
						hide(reset);
					},
					params,
				})
			);
	};

	useEffect(()=>{
		if(!selectedData?.id )
		dispatch(setAttachments([]))
	},[]);

	const handleAcceptedFiles = (
		files: FileType[],
		callback?: (files: FileType[]) => void
	) => {
		if (callback) callback(files);

		/**
		 * Formats the size
		 */
		const formatBytes = (bytes: number, decimals: number = 2) => {
			if (bytes === 0) return "0 Bytes";
			const k = 1024;
			const dm = decimals < 0 ? 0 : decimals;
			const sizes = [
				"Bytes",
				"KB",
				"MB",
				"GB",
				"TB",
				"PB",
				"EB",
				"ZB",
				"YB",
			];

			const i = Math.floor(Math.log(bytes) / Math.log(k));
			return (
				parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) +
				" " +
				sizes[i]
			);
		};

		// Creating a new array with the modified files
		const modifiedFiles = files.map((file) =>
			Object.assign({}, file, {
				originalObj: file,
				preview: URL.createObjectURL(file),
				formattedSize: formatBytes(file.size),
			})
		);

		dispatch(setAttachments(modifiedFiles));
	};
	const setPBGAttachments = (params: any[]) => {
		dispatch(setAttachments(params));
	};
	return (
		<Dialog
			open={open}
			onClose={() => {
				hide(reset);
			}}
			fullWidth
			maxWidth="md"
			aria-labelledby="alert-dialog-title"
			aria-describedby="alert-dialog-description">
			<DialogTitle
				sx={{
					bgcolor: "primary.main",
					color: "white",
					p: 1,
					px: 2,
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
				}}
				variant="h4"
				id="alert-dialog-title">
				{"Add Performance Bank Gurantee"}
				<IconButton
					onClick={() => {
						hide(reset);
					}}>
					<LuX color="white" />
				</IconButton>
			</DialogTitle>
			<DialogContent sx={{ px: "24px", pt: "12px !important", pb: 0 }}>
				<DialogContentText id="alert-dialog-description">
					<form style={{ width: "100%" }}>
						<Grid container spacing={2}>
							<Grid size={{ xs: 12, md: 6 }}>
								<Stack flex={1}>
									<CustomDatepicker
										required
										control={control}
										name="issuedate"
										hideAddon
										dateFormat="DD-MM-YYYY"
										showTimeSelect={false}
										timeFormat="h:mm a"
										timeCaption="time"
										inputClass="form-input"
										// minDate={moment()
										// 	.subtract(3, "months")
										// 	.startOf("month")
										// 	.toDate()}
										label={"Date of issue"}
										tI={1}
									/>
								</Stack>
							</Grid>
							<Grid size={{ xs: 12, md: 6 }}>
								<Stack flex={1}>
									<CustomDatepicker
										control={control}
										required
										name="expirydate"
										hideAddon
										dateFormat="DD-MM-YYYY"
										showTimeSelect={false}
										timeFormat="h:mm a"
										timeCaption="time"
										minDate={issue_date}
										inputClass="form-input"
										label={"Date of expiry"}
										tI={1}
									/>
								</Stack>
							</Grid>
							<Grid size={{ xs: 12, md: 6 }}>
								<Stack flex={1}>
									<CustomDatepicker
										control={control}
										required
										name="claimdate"
										hideAddon
										dateFormat="DD-MM-YYYY"
										showTimeSelect={false}
										timeFormat="h:mm a"
										timeCaption="time"
										inputClass="form-input"
										// minDate={new Date()}
										label={"Date of claim"}
										tI={1}
									/>
								</Stack>
							</Grid>
							<Grid size={{ xs: 12, md: 6 }}>
								<FormInput
									name="number"
									label="PBG Number"
									required
									type="text"
									placeholder="Enter PBG number here..."
									control={control}
								/>
							</Grid>
							<Grid size={{ xs: 12, md: 6 }}>
								<Controller
									name="value"
									control={control}
									defaultValue=""
									render={({ field, fieldState }) => (
										<>
											<InputLabel
												htmlFor="value"
												style={{
													fontWeight: "medium",
												}}
												error={
													fieldState.error != null
												}>
												PBG Value{" "}
												<span style={{ color: "red" }}>
													*
												</span>
											</InputLabel>
											<OutlinedInput
												id="value"
												{...field}
												type="text"
												placeholder="Enter PBG value here..."
												sx={{
													width: "100%",
													mt: 1,
												}}
												error={fieldState.error != null}
												inputProps={{
													maxLength: 10,
													style: {
														padding: "10px 12px",
													},
													onKeyDown: (e) => {
														if (
															!/[0-9]/.test(
																e.key
															) &&
															e.key !== "Tab" &&
															e.key !== "Backspace"
														) {
															e.preventDefault();
														}
													},
												}}
											/>
											{fieldState.error?.message && (
												<FormHelperText
													error={
														fieldState.error != null
													}>
													Please enter PBG value
												</FormHelperText>
											)}
										</>
									)}
								/>
							</Grid>
							<Grid size={{ xs: 12, md: 6 }}>
								{attachments?.length == 0 && (
									<FileUploader
										label="Documents"
										name={"documents"}
										control={control}
										showPreview={false}
										text={"Select a file..."}
										icon={LuPlus}
										iconSize={20}
										selectedFiles={
											attachments
												? attachments
												: []
										}
										handleAcceptedFiles={
											handleAcceptedFiles
										}
									/>
								)}
							{attachments?.length > 0 && (
								<ScrollableList>
									{attachments?.map(
										(attachment: any) => {
											return (
												attachment?.path && (
													<HorizontalFilePreview
														file={
															attachment
														}
														attachments={
															attachments
														}
														setAttachments={
															setPBGAttachments
														}
													/>
												))
										})}
								</ScrollableList>
							)}
							</Grid>
							<Grid size={{ xs: 6 }}>
								<TextArea
									required
									name="remarks"
									label="Remarks"
									type="text"
									placeholder="Write remarks here..."
									minRows={2}
									maxRows={5}
									containerSx={{
										display: "grid",
										gap: 1,
									}}
									control={control}
								/>
							</Grid>
						</Grid>
					</form>
				</DialogContentText>
			</DialogContent>
			<DialogActions sx={{ p: 2 }}>
				<Button
					onClick={() => hide(reset)}
					variant="outlined"
					color="secondary">
					Cancel
				</Button>
				<Button
					variant="contained"
					onClick={handleSubmit(handleAdd as any)}
					color="primary"
					autoFocus>
					Save
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default AddTeamMembers;

