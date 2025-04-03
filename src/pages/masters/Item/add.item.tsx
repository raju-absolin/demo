import react, { ChangeEvent, useEffect, useState } from "react";
import {
	Avatar,
	Button,
	CardContent,
	CardHeader,
	Checkbox,
	Chip,
	Container,
	DialogContentText,
	FormHelperText,
	List,
	ListItem,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	TextareaAutosize,
	useTheme,
} from "@mui/material";
import {
	Card,
	TextField,
	InputAdornment,
	AppBar,
	Toolbar,
	IconButton,
	Typography,
	Grid2 as Grid,
	Paper,
	Box,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	ListItemText,
	Modal,
} from "@mui/material";
import * as yup from "yup";
import { Link, useNavigate, useParams } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import { Control, Controller, useForm } from "react-hook-form";
import {
	CheckboxInput,
	ComponentContainerCard,
	FileType,
	FileUploader,
	FormInput,
	PageBreadcrumb,
	PasswordInput,
} from "@src/components";
import { useAppDispatch, useAppSelector } from "@src/store/store";
import { systemSelector } from "@src/store/system/system.slice";
import { itemgroupSelector } from "@src/store/masters/ItemGroup/itemgroup.slice";
import SelectComponent from "@src/components/form/SelectComponent";
import {
	clearMiniBaseUnits,
	clearMiniItemGroups,
	clearMiniMake,
	clearMiniMoc,
	miniSelector,
	setCountryValue,
	setStateValue,
} from "@src/store/mini/mini.Slice";
import {
	getMiniItemgroups,
	getMiniMake,
	getMiniMoc,
	getMiniCategory,
	getMiniBaseUnits,
} from "@src/store/mini/mini.Action";
import {
	LuBook,
	LuDelete,
	LuFile,
	LuPlus,
	LuSave,
	LuTrash2,
	LuX,
} from "react-icons/lu";
import PageTitle from "@src/components/PageTitle";
import { TreeItem, TreeView } from "@mui/lab";
import { RiAddCircleFill } from "react-icons/ri";
import {
	isModelVisible,
	itemsSelector,
	setUploadImages,
	setSelectedData,
} from "@src/store/masters/Item/item.slice";
import { getMakesMini } from "@src/store/masters/Make/make.action";
import {
	addItems,
	editItems,
	getGroups,
	getItems,
	getItemsById,
} from "@src/store/masters/Item/item.action";
import MasterPageTitle from "@src/components/MasterPageTitle";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { DiscordOutlined } from "@ant-design/icons";
import Dropzone from "react-dropzone";

const AddItem = () => {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const [itemImage, setItemImage] = useState({});
	const { id } = useParams();
	const [open, setOpen] = useState(false);
	const theme = useTheme();
	const [units, setUnitlist] = useState<
		{
			uom_id: any;
			label: string;
			value: string;
			dodelete: boolean;
		}[]
	>([]);

	const [filteredData, setFilteredData] = useState<any[]>([]);
	let filterUnitsData: any[] = [];

	const {
		items: { selectedData, masterEditId, image },
		mini: {
			miniItemgroupParams,
			miniMake,
			miniMoc,
			miniCategory,
			miniBaseUnit,
			miniItemgroupList,
			miniItemgroupLoading,
		},
		system: { userAccessList },
	} = useAppSelector((state) => {
		return {
			system: systemSelector(state),
			itemgroup: itemgroupSelector(state),
			mini: miniSelector(state),
			items: itemsSelector(state),
		};
	});
	const TYPE_CHOICES = [
		{ name: "Material", id: 1 },
		{ name: "Service", id: 2 },
	];

	useEffect(() => {
		if (id != undefined) {
			dispatch(getItemsById({ id: id }));
		}
		dispatch(setSelectedData({}));
		dispatch(
			getGroups({
				search: "",
				page: 1,
				page_size: 10,
			})
		);
	}, []);

	const itemSchema = yup.object().shape({
		name: yup.string().required("Please enter your item name").trim(),
		modelnumber: yup.string().required("Please enter model number").trim(),
		description: yup.string().required("Please enter description").trim(),
		makes: yup
			.array()
			.of(
				yup.object().shape({
					label: yup.string().required("Each make must have a label"),
					value: yup.string().required("Each make must have a value"),
				})
			)
			.min(1, "Select at least one make")
			.required("Please select a make"),
		types: yup
			.object()
			.shape({
				label: yup.string().required("Please select type"),
				value: yup.string().required("Please select type"),
			})
			.required("Please select type"),
		parent: yup
			.object()
			.shape({
				label: yup.string().required("Please select group"),
				value: yup.string().required("Please select group"),
			})
			.required("Please select group"),
		moc: yup
			.object()
			.shape({
				label: yup.string().required("Please select moc"),
				value: yup.string().required("Please select moc"),
			})
			.required("Please select moc"),
		baseunit: yup
			.object()
			.shape({
				label: yup.string().required("Please select baseunit"),
				value: yup.string().required("Please select baseunit"),
			})
			.required("Please select baseunit"),
		// image: yup.mixed().optional(),
		category: yup
			.object()
			.shape({
				label: yup.string().required("Please select category"),
				value: yup.string().required("Please select category"),
			})
			.required("Please select category"),
	});

	const { control, handleSubmit, reset, getValues } = useForm<any>({
		resolver: yupResolver(itemSchema),
		values: {
			name: selectedData?.name ? selectedData?.name : "",
			modelnumber: selectedData?.modelnumber
				? selectedData?.modelnumber
				: "",
			description: selectedData?.description
				? selectedData?.description
				: "",
			makes: selectedData?.makes
				? selectedData.makes?.map(
						(item: { label: any; value: any }) => ({
							label: item.label || "",
							value: item.value || "",
						})
					)
				: [],
			units: selectedData?.units
				? selectedData.units?.map(
						(item: {
							id: any;
							label: any;
							value: any;
							uom_id: string;
						}) => ({
							id: item?.id || "",
							label: item.label || "",
							value: item.value || "",
							uom_id: item.uom_id || "",
						})
					)
				: [],
			category: selectedData?.category
				? {
						label: selectedData?.category
							? `${selectedData?.category.name}`
							: "",
						value: selectedData?.category
							? `${selectedData?.category.id}`
							: "",
					}
				: null,
			parent: selectedData?.parent
				? {
						label: selectedData?.parent
							? `${selectedData?.parent.name}`
							: "",
						value: selectedData?.parent
							? `${selectedData?.parent.id}`
							: "",
					}
				: null,
			moc: selectedData?.moc
				? {
						label: selectedData?.moc
							? `${selectedData?.moc.name}`
							: "",
						value: selectedData?.moc
							? `${selectedData?.moc.id}`
							: "",
					}
				: null,
			baseunit: selectedData?.baseunit
				? {
						label: selectedData?.baseunit
							? `${selectedData?.baseunit.name}`
							: "",
						value: selectedData?.baseunit
							? `${selectedData?.baseunit.id}`
							: "",
						id: selectedData?.baseunit
							? `${selectedData?.baseunit.id}`
							: "",
					}
				: null,
			product_type: selectedData?.product_type
				? selectedData?.product_type_name
				: null,
			// image: selectedData?.image ? selectedData?.image : null,
			types: selectedData?.type
				? {
						label: selectedData?.type
							? `${selectedData?.type_name}`
							: "",
						value: selectedData?.type
							? `${selectedData?.type}`
							: "",
					}
				: null,
		},
	});
	const baseUnitValue = getValues("baseunit");
	const unitValue = getValues("units");

	console.log("baseUnitValue", baseUnitValue);
	console.log("unitValue", unitValue);
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
		const modifiedFiles = files.map((file) => {
			const isImage = URL.createObjectURL(file);

			return Object.assign({}, file, {
				originalObj: file, // Store the original file object
				preview: isImage ? URL.createObjectURL(file) : null, // Generate preview if image
				formattedSize: formatBytes(file.size), // Format file size
			});
		});
		// Make sure to check if there are any files before dispatching
		if (modifiedFiles.length > 0) {
			const formData = new FormData();
			modifiedFiles.forEach((file) => {
				formData.append("file", file.originalObj); // Append each file (original File object)
			});

			dispatch(setUploadImages(modifiedFiles[0]));
			setItemImage(formData);
		}
	};

	const handleSubmitItem = (data: any) => {
		const image =
			typeof data.image == typeof "" || !data.image
				? null
				: data.image[0];
		let unit_list = [];

		if (id !== undefined) {
			const unitsArray = unitValue.concat(units);
			unit_list = unitsArray.map(
				(item: {
					uom: any;
					id?: any;
					uom_id: any;
					value: string;
					label: string;
					dodelete: boolean;
				}) => {
					const result: any = {
						uom_id: item.uom?.id || item.uom_id,
						units: item.value,
					};
					if (item.id) {
						result.id = item.id; // Add 'id' only if it exists
					}
					return result;
				}
			);
		} else {
			unit_list = units.map(
				(item: {
					uom_id: any;
					value: string;
					label: string;
					dodelete: boolean;
				}) => ({
					uom_id: item.uom_id,
					units: item.value,
				})
			);
		}
		const obj = {
			name: data.name,
			modelnumber: data.modelnumber,
			description: data.description,
			product_type: "2",
			parent_id: data.parent?.value,
			make_ids: data.makes?.map(
				(item: { value: string; label: string }) => item.value
			),
			category_id: data.category?.value,
			moc_id: data.moc?.value,
			baseunit_id: data.baseunit?.value,
			units: unit_list,
			type: data.types?.value,
		};
		if (id != undefined) {
			dispatch(editItems({ id: id ? id : "", obj, image: image }));
			dispatch(
				getItems({
					search: "",
					page: 1,
					page_size: 10,
				})
			);
			navigate("/pages/masters/item");
			dispatch(setUploadImages({}));
			reset();
		} else {
			dispatch(addItems({ obj, image: image }));
			dispatch(
				getItems({
					search: "",
					page: 1,
					page_size: 10,
				})
			);
			navigate("/pages/masters/item");
			dispatch(setUploadImages({}));
			reset();
		}
	};
	const HorizontalFilePreview = ({ file }: { file: any }) => {
		function handleDismiss() {
			dispatch(setUploadImages({}));
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
					sx={{ display: "flex", alignItems: "center", gap: "12px" }}>
					{file.preview ? (
						<Avatar
							variant="rounded"
							sx={{
								height: "48px",
								width: "48px",
								bgcolor: "white",
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
						<Typography sx={{ fontWeight: 600, color: "grey.700" }}>
							{file.path}
						</Typography>
						<Typography component={"p"} color={"grey.700"}>
							{file.formattedSize}
						</Typography>
					</Box>
				</Box>
				<IconButton sx={{ marginLeft: "auto", my: "auto" }}>
					<LuX size={18} onClick={() => handleDismiss()} />
				</IconButton>
			</Box>
		);
	};
	console.log("units", units);
	const unitSchema = yup.object().shape({
		name: yup.object().shape({
			label: yup.string().required("Please select unit"),
			value: yup.string().required("Please select unit"),
		}),
		unitvalue: yup
			.string()
			.required("Please enter your unit value")
			.trim()
			.matches(
				/^[0-9 ]*$/,
				"unit value should not contain alphabets & special characters"
			),
	});
	const {
		control: unitcontrol,
		handleSubmit: handleUnitSubmit,
		reset: unitReset,
	} = useForm<any>({
		resolver: yupResolver(unitSchema),
	});

	const onUnitSubmit = (unitData: any) => {
		const unitObj = {
			uom_id: unitData.name?.value,
			label: unitData.name ? unitData.name?.label : "",
			value: unitData.unitvalue ? unitData.unitvalue : 1,
			dodelete: false,
		};
		setUnitlist((prevList) => {
			const newAddunitlist = [...prevList, unitObj];
			const newUnitlist = [...newAddunitlist];
			return newUnitlist;
		});
		setOpen(false);
	};

	const deleteBaseUnit = (unit: any) => {
		const deleteUnitlist = units?.filter(
			(val) => unit?.uom_id != val?.uom_id
		);
		setUnitlist(deleteUnitlist);
	};

	return (
		<Box sx={{ padding: 2 }}>
			<MasterPageTitle
				prefix={"Masters"}
				postfix={"Items"}
				pageTitle="Items"
				goBack={true}
				modalVisible={true}
				pageText={""}
				navigationToAdd={"/pages/masters/item"}>
				<Card sx={{ marginTop: "20px" }}>
					<CardContent>
						<form
							action=""
							onSubmit={handleSubmit(handleSubmitItem)}>
							<Grid container spacing={4}>
								{/* <Grid item xs={3}>
                            <Card>
                                <CardHeader
                                    title="GROUPS"
                                    className="bg-transparent border-bottom"
                                />
                                <CardContent>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => openModal(true)}
                                        startIcon={<RiAddCircleFill size={22} />}
                                    >
                                        Group
                                    </Button>
                                    <List>
                                        {itemgroupList.map((item, index) => (
                                            <ListItem button onClick={() => onItemClick(item)} key={index}
                                                className="cursor-pointer">
                                                <ListItemText primary={item.name} />
                                            </ListItem>
                                        ))}
                                    </List>

                                </CardContent>
                            </Card>
                        </Grid> */}
								<Grid size={{ xs: 12 }}>
									<Grid container spacing={2}>
										<Grid size={{ xs: 12, sm: 6 }}>
											<FormInput
												name="name"
												label="Item"
												required
												type="text"
												placeholder="Enter Item here..."
												control={control}
											/>
										</Grid>
										<Grid size={{ xs: 12, sm: 6 }}>
											<FormInput
												name="modelnumber"
												label="Model Number"
												required
												type="text"
												placeholder="Enter Item here..."
												control={control}
											/>
										</Grid>

										<Grid size={{ xs: 12, md: 6 }}>
											<FormInput
												name="description"
												label="Description"
												required
												type="text"
												placeholder="Enter Description here..."
												control={control}
											/>
										</Grid>

										<Grid size={{ xs: 12, sm: 6 }}>
											<SelectComponent
												name="category"
												label="Category"
												required
												control={control}
												options={miniCategory.list?.map(
													(e: {
														id: number;
														name: string;
													}) => ({
														id: e.id,
														name: e.name,
													})
												)}
												loading={miniCategory.loading}
												selectParams={{
													page: miniCategory
														.miniParams.page,
													page_size:
														miniCategory.miniParams
															.page_size,
													search: miniCategory
														.miniParams.search,
													no_of_pages:
														miniCategory.miniParams
															.no_of_pages,
												}}
												fetchapi={getMiniCategory}
											/>
										</Grid>

										<Grid size={{ xs: 12, sm: 6 }}>
											<SelectComponent
												name="parent"
												label="Item Group"
												required
												control={control}
												options={miniItemgroupList?.map(
													(e: {
														id: number;
														name: string;
													}) => ({
														id: e.id,
														name: e.name,
													})
												)}
												hasMore={
													miniItemgroupParams.page <
													miniItemgroupParams.no_of_pages
												}
												loading={miniItemgroupLoading}
												selectParams={{
													page: miniItemgroupParams.page,
													page_size:
														miniItemgroupParams.page_size,
													search: miniItemgroupParams.search,
													no_of_pages:
														miniItemgroupParams.no_of_pages,
												}}
												fetchapi={getMiniItemgroups}
												clearData={clearMiniItemGroups}
											/>
										</Grid>
										<Grid size={{ xs: 12, sm: 6 }}>
											<SelectComponent
												name="makes"
												label="Make"
												required
												control={control}
												multiple={true}
												options={miniMake.list?.map(
													(e: {
														id: number;
														name: string;
													}) => ({
														id: e.id,
														name: e.name,
													})
												)}
												loading={miniMake.loading}
												hasMore={
													miniMake.miniParams.page <
													miniMake.miniParams
														.no_of_pages
												}
												selectParams={{
													page: miniMake.miniParams
														.page,
													page_size:
														miniMake.miniParams
															.page_size,
													search: miniMake.miniParams
														.search,
													no_of_pages:
														miniMake.miniParams
															.no_of_pages,
												}}
												fetchapi={getMiniMake}
												clearData={clearMiniMake}
											/>
										</Grid>
										<Grid size={{ xs: 12, sm: 6 }}>
											<SelectComponent
												name="types"
												label="Material/Service"
												control={control}
												required
												options={TYPE_CHOICES?.map(
													(e: {
														id: number;
														name: string;
													}) => ({
														id: e.id,
														name: e.name,
													})
												)}
											/>
										</Grid>
									</Grid>

									{/* Units Conversion Section */}

									<Typography
										variant="h6"
										sx={{ mt: 4, mb: 2 }}>
										Units Conversion
									</Typography>
									<Grid container spacing={2}>
										<Grid size={{ xs: 12, sm: 4 }}>
											<SelectComponent
												name="baseunit"
												label="Base Unit"
												control={control}
												required
												options={miniBaseUnit?.list}
												loading={miniBaseUnit.loading}
												hasMore={
													miniBaseUnit.miniParams
														.page <
													miniBaseUnit.miniParams
														.no_of_pages
												}
												selectParams={{
													page: miniBaseUnit
														.miniParams.page,
													page_size:
														miniBaseUnit.miniParams
															.page_size,
													search: miniBaseUnit
														.miniParams.search,
													no_of_pages:
														miniBaseUnit.miniParams
															.no_of_pages,
												}}
												onChange={(value: any) => {
													setUnitlist([
														{
															uom_id: value?.value,
															label: value?.label,
															value: "1",
															dodelete: false,
														},
													]);
												}}
												disabled={
													id != undefined
														? true
														: false
												}
												dropDownPositoning={"relative"}
												fetchapi={getMiniBaseUnits}
												clearData={clearMiniBaseUnits}
											/>
										</Grid>
										<Grid
											size={{ xs: 12, sm: 4 }}
											sx={{ mt: 3 }}>
											<Button
												variant="contained"
												color="primary"
												sx={{
													marginLeft: "80px",
													padding: 1,
												}}
												disabled={!baseUnitValue?.value}
												onClick={() => {
													unitReset();
													filterUnitsData = [
														baseUnitValue,
														...unitValue,
													].concat(units);
													setFilteredData(
														filterUnitsData
													);
													setOpen(true);
												}}>
												Add Units
											</Button>
										</Grid>
									</Grid>
									{baseUnitValue?.value && (
										<Paper sx={{ width: "50%", mt: 3 }}>
											<Table>
												<TableHead
													sx={{
														backgroundColor:
															theme.palette
																.grey[100],
													}}>
													<TableRow>
														<TableCell>
															Units
														</TableCell>
														<TableCell>
															Conversion
														</TableCell>
														<TableCell>
															Action
														</TableCell>
													</TableRow>
												</TableHead>
												<TableBody>
													{baseUnitValue?.value && (
														<TableRow
															sx={{
																backgroundColor:
																	theme
																		.palette
																		.grey[100],
															}}>
															<TableCell>
																{
																	baseUnitValue?.label
																}
															</TableCell>
															<TableCell>
																1
															</TableCell>
															<TableCell>
																{/* <LuTrash2
                                                                style={{ cursor: "pointer", color: "#fc6f03" }}
                                                            /> */}
															</TableCell>
														</TableRow>
													)}
													{id !== undefined &&
														unitValue
															?.filter(
																(val: any) =>
																	val.uom_id !=
																	baseUnitValue?.value
															)
															?.map(
																(unit: any) => (
																	<TableRow
																		sx={{
																			backgroundColor:
																				theme
																					.palette
																					.grey[100],
																		}}>
																		<TableCell>
																			{
																				unit?.label
																			}
																		</TableCell>
																		<TableCell>
																			{parseInt(
																				unit?.value
																			)}
																		</TableCell>
																		<TableCell>
																			<LuTrash2
																				style={{
																					cursor: "pointer",
																					color: "#fc6f03",
																				}}
																			/>
																		</TableCell>
																	</TableRow>
																)
															)}
													{units?.length > 0 &&
														units
															?.filter(
																(val) =>
																	val?.uom_id !=
																	baseUnitValue?.value
															)
															?.map(
																(
																	unit,
																	index
																) => (
																	<TableRow>
																		<TableCell>
																			{
																				unit?.label
																			}
																		</TableCell>
																		<TableCell>
																			{
																				unit?.value
																			}
																		</TableCell>
																		<TableCell>
																			<LuTrash2
																				style={{
																					cursor: "pointer",
																					color: "#fc6f03",
																				}}
																				onClick={(
																					e
																				) =>
																					deleteBaseUnit(
																						unit
																					)
																				}
																			/>
																		</TableCell>
																	</TableRow>
																)
															)}
												</TableBody>
											</Table>
										</Paper>
									)}
								</Grid>

								<Grid size={{ xs: 4 }}>
									{/* <Grid>
									<Controller
										name="image"
										control={control}
										render={({ field, fieldState }) => (
											<Box>
												<Dropzone
													onDrop={(acceptedFiles) => {
														handleAcceptedFiles &&
															handleAcceptedFiles(
																acceptedFiles
															);
														field.onChange(
															acceptedFiles
														); // Update the form value with accepted files
													}}>
													{({
														getRootProps,
														getInputProps,
													}) => (
														<Box
															sx={{
																display: "flex",
																justifyContent:
																	"center",
																alignItems:
																	"center",
																width: "100%",
																minHeight:
																	"150px",
																bgcolor:
																	"transparent",
																marginBottom:
																	"10px",
																borderRadius:
																	"6px",
																border: "2px dashed",
																borderColor:
																	fieldState.error
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
																		display:
																			"flex",
																		justifyContent:
																			"center",
																		mb: "12px",
																	}}>
																	<CloudUploadIcon
																		sx={{
																			fontSize: 80,
																		}}
																	/>
																</Box>
																<Typography
																	component={
																		"h5"
																	}
																	sx={{
																		fontSize:
																			"18px",
																		color: "grey.700",
																	}}>
																	Select Image
																</Typography>
															</div>
														</Box>
													)}
												</Dropzone>
											</Box>
										)}
									/>
									{id == undefined && image?.path && (
										<HorizontalFilePreview file={image} />
									)}
									{id != undefined &&
										selectedData?.image?.path && (
											<HorizontalFilePreview
												file={selectedData?.image}
											/>
										)}
								</Grid>*/}
									<SelectComponent
										name="moc"
										label="Moc"
										control={control}
										required
										options={miniMoc.list?.map(
											(e: {
												id: number;
												name: string;
											}) => ({
												id: e.id,
												name: e.name,
											})
										)}
										loading={miniMoc.loading}
										selectParams={{
											page: miniMoc.miniParams.page,
											page_size:
												miniMoc.miniParams.page_size,
											search: miniMoc.miniParams.search,
											no_of_pages:
												miniMoc.miniParams.no_of_pages,
										}}
										hasMore={
											miniMoc.miniParams.page <
											miniMoc.miniParams.no_of_pages
										}
										fetchapi={getMiniMoc}
										clearData={clearMiniMoc}
									/>
								</Grid>
							</Grid>
							<Box
								sx={{
									display: "flex",
									mt: 3,
									gap: 2,
								}}
								justifyContent="center"
								alignItems="center">
								<Button
									variant="contained"
									color="primary"
									type="submit"
									style={{ width: "15%" }}>
									{id != undefined ? "Update" : "Submit"}
								</Button>
							</Box>
						</form>
					</CardContent>
					<Dialog
						open={open}
						onClose={() => setOpen(false)}
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
							Add Units
							<IconButton onClick={() => setOpen(false)}>
								<LuX color="white" />
							</IconButton>
						</DialogTitle>
						<DialogContent
							sx={{ px: "24px", pt: "12px !important", pb: 0 }}>
							<DialogContentText
								id="alert-dialog-description"
								sx={{
									width: 500,
								}}>
								<form
									style={{ width: "100%" }}
									onSubmit={handleUnitSubmit(onUnitSubmit)}>
									<Grid size={{ xs: 12 }}>
										<SelectComponent
											name="name"
											label="Unit Name"
											control={unitcontrol}
											required
											options={miniBaseUnit?.list?.filter(
												(e: {
													id: string;
													name: string;
												}) => {
													if (units?.length > 0) {
														return !units?.some(
															(unit: {
																uom_id?: string;
																value?: string;
															}) =>
																unit.uom_id ===
																	e.id ||
																unit.value ===
																	e.id
														);
													}
													return true;
												}
											)}
											loading={miniBaseUnit.loading}
											selectParams={{
												page: miniBaseUnit.miniParams
													.page,
												page_size:
													miniBaseUnit.miniParams
														.page_size,
												search: miniBaseUnit.miniParams
													.search,
												no_of_pages:
													miniBaseUnit.miniParams
														.no_of_pages,
											}}
											fetchapi={getMiniBaseUnits}
										/>
									</Grid>
									<Grid
										size={{ xs: 12, sm: 4 }}
										sx={{ mt: 2 }}>
										<FormInput
											sx={{ mt: 2 }}
											name="unitvalue"
											label="Unit Value"
											required
											type="text"
											placeholder="Enter Unit value here..."
											control={unitcontrol}
										/>
									</Grid>
									<DialogActions sx={{ p: 2 }}>
										<Button
											onClick={() => setOpen(false)}
											variant="outlined"
											color="secondary">
											Cancel
										</Button>
										<Button
											variant="contained"
											type="submit"
											color="primary"
											autoFocus>
											Submit
										</Button>
									</DialogActions>
								</form>
							</DialogContentText>
						</DialogContent>
					</Dialog>
				</Card>
			</MasterPageTitle>
		</Box>
	);
};
export default AddItem;
