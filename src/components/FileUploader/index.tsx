import Dropzone from "react-dropzone";
import {
	Avatar,
	Box,
	FormHelperText,
	IconButton,
	InputLabel,
	Typography,
} from "@mui/material";
import { IconType } from "react-icons";
import { LuFile, LuX } from "react-icons/lu";
import { Controller } from "react-hook-form";

export type FileType = File & {
	removeDocument?: boolean;
	file?: string | File;
	id?: string;
	uuid?: string;
	path?: string;
	preview?: string;
	formattedSize?: string;
	originalObj?: File;
	dodelete?: boolean;
};

type ChildrenProps = {
	control: any;
	name: string;
	icon: IconType;
	iconSize: number;
	text: string;
	textClass?: string;
	extraText?: string;
	classname?: string;
	selectedFiles: FileType[] | FileType;
	handleAcceptedFiles: (files: FileType[], callback: () => void) => void;
	removeFile?: (File: FileType) => void;
};

type FileUploaderProps = ChildrenProps & {
	onFileUpload?: (files: FileType[]) => void;
	showPreview?: boolean;
	required?: boolean;
	label: string;
};

export const HorizontalFilePreview = ({
	removeDocument,
	file,
	attachments,
	setAttachments,
}: {
	removeDocument?: boolean;
	file: any;
	attachments: FileType[];
	setAttachments: (params: FileType[]) => void;
}) => {
	function handleDismiss() {
		const filter = !file?.id
			? attachments?.filter((e) => e?.uuid != file?.uuid)
			: attachments?.map((e) =>
					e.id == file.id ? { ...e, dodelete: true } : e
				);
		setAttachments(filter);
	}

	return (
		<Box
			id={file.name}
			sx={{
				border: "1px solid",
				borderColor: "divider",
				borderRadius: "6px",
				p: "12px",
				display: "flex",
			}}>
			<Box
				sx={{
					display: "flex",
					alignItems: "center",
					gap: "12px",
					width: "100%",
				}}
				component={"a"}
				target="_blank"
				href={file?.preview}>
				{file.preview ? (
					<Avatar
						variant="rounded"
						sx={{
							height: "48px",
							width: "48px",
							bgcolor: "grey",
							objectFit: "cover",
						}}
						alt={file.path}
						src={file.preview}
					/>
				) : (
					<Typography
						component={"span"}
						sx={{
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							color: "primary.main",
							fontWeight: 600,
							borderRadius: "6px",
							height: "48px",
							width: "48px",
							bgcolor: "#3e60d51a",
						}}>
						<LuFile />
					</Typography>
				)}
				<Box>
					<Typography
						sx={{
							fontWeight: 600,
							color: "grey.700",
							wordBreak: "break-word",
						}}>
						{file.path}
					</Typography>
					<Typography component={"p"} color={"grey.700"}>
						{file.formattedSize}
					</Typography>
				</Box>
			</Box>
			{!removeDocument && (
				<IconButton sx={{ marginLeft: "auto", my: "auto" }}>
					<LuX size={18} onClick={() => handleDismiss()} />
				</IconButton>
			)}
		</Box>
	);
};

const FileUploader = ({
	control,
	name,
	showPreview = true,
	icon,
	text,
	iconSize,
	selectedFiles,
	handleAcceptedFiles,
	removeFile,
	required,
	label,
}: FileUploaderProps) => {
	const Icon = icon;
	return (
		<>
			<Controller
				name={name}
				control={control}
				rules={{
					required: "File upload is required.",
					validate: (files) =>
						files.length > 0
							? true
							: "Please upload at least one file.",
				}}
				render={({ field, fieldState }) => (
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
						<Dropzone
							onDrop={(acceptedFiles) => {
								handleAcceptedFiles &&
									handleAcceptedFiles(
										acceptedFiles,
										() => {}
									);
								field.onChange(acceptedFiles); // Update the form value with accepted files
							}}>
							{({ getRootProps, getInputProps }) => (
								<Box
									sx={{
										display: "flex",
										justifyContent: "center",
										alignItems: "center",
										width: "100%",
										minHeight: "80px",
										bgcolor: "transparent",
										borderRadius: "6px",
										border: "2px dashed",
										borderColor: fieldState.error
											? "red"
											: "divider",
									}}>
									<Box className="fallback">
										<input
											{...getInputProps()}
											name="file"
											type="file"
											multiple
										/>
									</Box>
									<div
										className="dz-message needsclick"
										{...getRootProps()}>
										<Box
											sx={{
												display: "flex",
												justifyContent: "center",
												mb: "12px",
											}}>
											<Icon size={iconSize} />
										</Box>
										<Typography
											component={"h5"}
											sx={{
												fontSize: "18px",
												color: "grey.700",
											}}>
											{text}
										</Typography>
									</div>
								</Box>
							)}
						</Dropzone>
						{/* Show validation error message */}
						{fieldState.error?.message && (
							<FormHelperText error={fieldState.error != null}>
								{fieldState.error?.message}
							</FormHelperText>
						)}
					</Box>
				)}
			/>

			{showPreview &&
				Array.isArray(selectedFiles) &&
				selectedFiles?.length > 0 &&
				(selectedFiles || [])?.map((file: FileType, idx: number) => {
					const ext = file.name.substr(
						file.name.lastIndexOf(".") + 1
					);
					return (
						<Box
							sx={{
								border: "1px solid",
								borderColor: "divider",
								borderRadius: "6px",
								p: "12px",
								width: "100%",
								display: "flex",
							}}
							key={idx}>
							<Box
								sx={{
									display: "flex",
									alignItems: "center",
									gap: "12px",
								}}>
								{file.preview ? (
									<Avatar
										variant="rounded"
										sx={{
											height: "48px",
											minWidth: "48px",
											bgcolor: "white",
											objectFit: "cover",
										}}
										alt={file.name}
										src={file.preview}
									/>
								) : (
									<Typography
										component={"span"}
										sx={{
											display: "flex",
											alignItems: "center",
											justifyContent: "center",
											color: "primary.main",
											fontWeight: 600,
											borderRadius: "6px",
											height: "48px",
											width: "48px",
											bgcolor: "#3e60d51a",
										}}>
										{ext.toUpperCase()}
									</Typography>
								)}
								<Box>
									<Typography
										sx={{
											fontWeight: 600,
											color: "grey.700",
											overflow: "hidden",
											textOverflow: "ellipsis",
											display: "-webkit-box",
											WebkitLineClamp: 1,
											WebkitBoxOrient: "vertical",
										}}>
										{file.name}
									</Typography>
									<Typography
										component={"p"}
										color={"grey.700"}>
										{file.formattedSize}
									</Typography>
								</Box>
							</Box>
							<IconButton
								sx={{
									marginLeft: "auto",
									marginTop: "auto",
									marginBottom: "auto",
								}}>
								<LuX
									size={18}
									onClick={() =>
										removeFile && removeFile(file)
									}
								/>
							</IconButton>
						</Box>
					);
				})}
		</>
	);
};

export { FileUploader };
