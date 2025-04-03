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
	Box,
	Avatar,
	Typography,
	styled,
	List,
} from "@mui/material";
import {
	CustomDatepicker,
	FileType,
	FileUploader,
	FormInput,
	HorizontalFilePreview,
} from "@src/components";
import SelectComponent from "@src/components/form/SelectComponent";
import TextArea from "@src/components/form/TextArea";
import { getMiniUsers, getMiniUserTypes } from "@src/store/mini/mini.Action";
import {
	clearMiniUsers,
	clearMiniUserTypes,
	miniSelector,
} from "@src/store/mini/mini.Slice";
import { postExtendedEndDateMembers } from "@src/store/sidemenu/project_management/ExtendedEndDate/EED.action";
import { setAttachments,setSelectedData } from "@src/store/sidemenu/project_management/ExtendedEndDate/EED.slice";
import {
	ExtendedEndDateState,
	ExtendedEndDate,
} from "@src/store/sidemenu/project_management/ExtendedEndDate/EED.types";
import { useAppDispatch, useAppSelector } from "@src/store/store";
import moment from "moment";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { LuFile, LuPlus, LuX } from "react-icons/lu";
import * as yup from "yup";

interface Props {
	open: boolean;
	hide: (reset: any) => void;
	selectedData: ExtendedEndDate;
	project_id: string;
	params: ExtendedEndDateState["pageParams"];
	attachments?: any[];
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

const AddEEDModal = ({
	open,
	hide,
	selectedData,
	project_id,
	params,
	attachments,
}: Props) => {
	const dispatch = useAppDispatch();

	const BankPerformanceSchema = yup.object().shape({
		extended_due_date: yup
			.string()
			.required("Please select a extended due date"),
	});

	const {
		control,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<any>({
		resolver: yupResolver(BankPerformanceSchema),
		values: {
			extended_due_date: selectedData?.extended_due_date
				? moment(
					selectedData?.extended_due_date,
					"DD-MM-YYYY HH:mm"
				).toISOString()
				: "",
		},
	});

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

	const handleAdd = (payload: { extended_due_date: string }) => {
		const data = {
			project_id: project_id ? project_id : "",
			extended_due_date: payload?.extended_due_date
				? moment(payload?.extended_due_date).format(
					"DD-MM-YYYY hh:mm a"
				)
				: "",
			file: attachments ? attachments[0].originalObj : null,
		};

		dispatch(
			postExtendedEndDateMembers({
				data,
				hide: () => {
					hide(reset);
				},
				params,
			})
		);
	};

	const setEEDAttachments = (params: any[]) => {
		dispatch(setAttachments(params));
	};

	useEffect(()=>{
		dispatch(setAttachments([]));
		dispatch(setSelectedData({}));
	},[]);

	return (
		<Dialog
			open={open}
			onClose={() => {
				hide(reset);
			}}
			fullWidth
			maxWidth="sm"
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
				{!selectedData?.id
					? "Add Extended Due Date"
					: "Update Extended Due Date"}
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
						<Grid container spacing={2} sx={{ height: 280 }}>
							<Grid size={{ xs: 12 }}>
								<Stack flex={1} mb={2}>
									<CustomDatepicker
										required
										control={control}
										name="extended_due_date"
										hideAddon
										dateFormat="DD-MM-YYYY"
										showTimeSelect={false}
										timeFormat="h:mm a"
										timeCaption="time"
										inputClass="form-input"
										// minDate={new Date()}
										label={"Date"}
										tI={1}
									/>
								</Stack>
								{/* </Grid>
							<Grid size={{ xs: 12 }}> */}
								<Box>
									<Grid container spacing={2}>
										{attachments?.length == 0 &&
											<Grid size={{ xs: 6 }}>
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
											</Grid>
										}
										<Grid size={{ xs: 6 }} mt={4}>
											{/* <Stack spacing={1}> */}
											<ScrollableList>
												{attachments?.length != 0 &&
													attachments?.map(
														(attachment) => {
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
																			setEEDAttachments
																		}
																	/>
																)
															);
														}
													)}
											</ScrollableList>
											{/* </Stack> */}
										</Grid>
									</Grid>
								</Box>
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

export default AddEEDModal;
