import {
	Box,
	Button,
	Card,
	Chip,
	IconButton,
	ListItemIcon,
	Menu,
	MenuItem,
	Paper,
	Stack,
	Tooltip,
	Typography,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Avatar,
	CircularProgress,
	useMediaQuery,
	Grid2 as Grid,
	Zoom,
} from "@mui/material";
import { PageBreadcrumb } from "@src/components";
import TableComponent from "@src/components/TableComponenet";
import TopComponent from "@src/pages/settings/TopComponent";
import {
	downloadFile,
	getSharedFiles,
	getStaticFiles,
} from "@src/store/sidemenu/file_system/fs.action";
import { useFileSystemSelector } from "@src/store/sidemenu/file_system/fs.slice";
import { useAppDispatch } from "@src/store/store";
import moment from "moment";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { LuDownload, LuMoreVertical, LuPenLine } from "react-icons/lu";
import { useLocation } from "react-router-dom";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useTheme } from "@mui/material/styles";
import blue_folder_icon from "@src/assets/images/default_file_icons/285658_blue_folder_icon.png";
import empty_file_icon from "@src/assets/images/default_file_icons/285688_file_empty_icon.png";
import { config } from "@src/config";
import { FileData } from "@src/store/sidemenu/file_system/fs.types";

const initialData = [
	{
		name: "Project Planning from 20-01-2025 to 24-01-2025",
		dateShared: "Jan 20",
		sharedBy: "Ajay Kasarapu",
		activity: "Edited 4h ago",
	},
	{
		name: "1626201-John-Whitmore-Quote-Coaching...",
		dateShared: "Jan 8",
		sharedBy: "Nani Surya Aravind Thalabathula",
		activity: "Shared in Teams chat Jan 8",
	},
	{
		name: "Spruce Eng Additional Requirements",
		dateShared: "Jan 6",
		sharedBy: "Ajay Kasarapu",
		activity: "Shared in Teams chat Jan 6",
	},
	{
		name: "add.work_order",
		dateShared: "Dec 27, 2024",
		sharedBy: "ARISETTI NEELIMA",
		activity: "Recently opened Jan 4",
	},
	{
		name: "PMS SRS (WEB APPLICATION) - VERSION 4",
		dateShared: "Dec 2, 2024",
		sharedBy: "Ajay Kasarapu",
		activity: "Edited Jan 17",
	},
];

const SharedFiles = () => {
	const location = useLocation();
	const dispatch = useAppDispatch();
	const {
		mini: { miniFolders },
		system: { sideMenuItemsList, userAccessList },
		fileSystem: {
			fileShareList: list,
			fileShareLoading: loading,
			fileShareParams: pageParams,
			filesSharedCount: count,
			staticFiles,
		},
	} = useFileSystemSelector();
	useEffect(() => {
		dispatch(getStaticFiles());
	}, []);
	const columns = [
		{
			title: "S.No",
			width: 30,
		},
		{
			title: "Code",
			width: 30,
		},
		{
			title: "Due Date",
			width: 30,
		},
		{
			title: "Location",
			width: 30,
		},
		{
			title: "Department",
			width: 30,
		},
		{
			title: "Over Due Days",
			width: 100,
		},
		// {
		// 	title: "Description",
		// 	width: 30,
		// },
		{
			title: "Priority",
			width: 30,
		},
		{
			title: "Status",
			width: 100,
		},
		{
			title: "Actions",
			width: 100,
		},
	];

	function createData(index: number, actions: React.JSX.Element) {
		return {
			index,
			actions,
		};
	}

	const [anchorEls, setAnchorEls] = useState<{
		[key: string]: HTMLElement | null;
	}>({});

	const handleMenuClick = (
		event: React.MouseEvent<HTMLElement>,
		rowId: string
	) => {
		setAnchorEls((prev) => ({ ...prev, [rowId]: event.currentTarget }));
	};

	const handleMenuClose = (rowId: string) => {
		setAnchorEls((prev) => ({ ...prev, [rowId]: null }));
	};
	const handleSearch = ({ search }: { search?: string | undefined }) => {
		dispatch(
			getSharedFiles({
				...pageParams,
				search: search ? search : "",
				page: 1,
				page_size: 10,
			})
		);
	};

	const handleChangePage = (event: unknown, newPage: number) => {
		dispatch(
			getSharedFiles({
				...pageParams,
				search: "",
				page: newPage + 1,
			})
		);
	};

	const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
		dispatch(
			getSharedFiles({
				...pageParams,
				search: "",
				page: 1,
				page_size: parseInt(event.target.value),
			})
		);
	};
	// const openModal = (value: boolean, rowdata?: any) => {
	// 	dispatch(setUploadDocument([]));
	// 	dispatch(setSelectedData(rowdata || {}));
	// 	dispatch(isModalOpen(value));
	// };

	useEffect(() => {
		dispatch(
			getSharedFiles({
				...pageParams,
				page: 1,
				page_size: 10,
			})
		);
	}, []);

	const containerRef = useRef<HTMLDivElement>(null);
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

	const loadMoreData = () => {
		if (loading) {
			return;
		} else handleChangePage(null, pageParams?.page);
	};

	useEffect(() => {
		const handleScroll = () => {
			if (containerRef.current) {
				const { scrollTop, scrollHeight, clientHeight } =
					containerRef.current;
				if (scrollTop + clientHeight >= scrollHeight - 10 && !loading) {
					if (pageParams.page < pageParams.no_of_pages) {
						loadMoreData();
					}
				}
			}
		};

		const currentRef = containerRef.current;
		if (currentRef) {
			currentRef.addEventListener("scroll", handleScroll);
		}
		return () => {
			if (currentRef) {
				currentRef.removeEventListener("scroll", handleScroll);
			}
		};
	}, [loading]);

	const filethumbnailUrl = (file: FileData | undefined) => {
		const static_file = (file_type: number | undefined) => {
			return `${config.baseUrl}/static/iconpacks/default/${
				staticFiles[file_type == 1 ? "default_file" : "default_folder"]
			}`;
		};
		if (file?.thumbnail) {
			return file.thumbnail;
		} else {
			if (file?.fileextension) {
				const extension = file?.fileextension
					? staticFiles[file?.fileextension]
					: "";
				if (extension) {
					return `${config.baseUrl}/static/iconpacks/default/${
						extension
					}`;
				} else {
					return static_file(file?.type);
				}
			} else {
				return static_file(file?.type);
			}
		}
	};

	return (
		<Box>
			<PageBreadcrumb
				title={
					sideMenuItemsList.find(
						(item) => item?.url === location?.pathname
					)?.label
				}
				subName="Project Management"
			/>
			<Box
				sx={{
					display: "grid",
					gap: 1,
				}}>
				<Card
					sx={{
						px: 2,
						pt: 2,
					}}>
					<TopComponent
						permissionPreFix="FileSystem"
						permissionPostFix="sharedfile"
						navigateLink={""}
						showAddButton={false}
						addButtonName="Add Service Request"
						handleSearch={handleSearch}
						showFilterButton={false}
						// openFilter={handleFilter}
						// openModal={() => {
						// 	openModal(true);
						// }}
						// filteredData={getFilterParams(pageParams)}
					/>
					<Box
						sx={{
							padding: 2,
							height: "80vh",
							overflow: "auto",
							width: "100%",
						}}
						ref={containerRef}>
						<TableContainer
							component={Paper}
							sx={{
								width: "100%",
							}}>
							<Table>
								<TableHead>
									<TableRow>
										<TableCell>
											<Typography variant="h6">
												Name
											</Typography>
										</TableCell>
										{!isMobile && (
											<TableCell>
												<Typography variant="h6">
													Date Shared
												</Typography>
											</TableCell>
										)}
										{!isMobile && (
											<TableCell>
												<Typography variant="h6">
													Shared By
												</Typography>
											</TableCell>
										)}
										<TableCell align="right"></TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{list.map((file, index) => (
										<TableRow key={index}>
											<TableCell
												onClick={() => {
													typeof file.file?.file ==
														"string" &&
														(() => {
															dispatch(
																downloadFile({
																	id: file
																		.file
																		?.id,
																	action: "view",
																	file_name:
																		file
																			?.file
																			?.name ||
																		"",
																})
															);
															window.open(
																file.file?.file,
																"_blank"
															);
														})();
												}}>
												<Box
													display="flex"
													gap={1}
													alignItems={"center"}>
													<img
														src={
															staticFiles &&
															filethumbnailUrl(
																file?.file
															)
														}
														style={{
															width: "25px",
															height: "25px",
															objectFit: "cover",
														}}
														onError={(e) => {
															(
																e.target as HTMLImageElement
															).src =
																file?.file
																	?.type == 1
																	? empty_file_icon
																	: blue_folder_icon;
														}}
													/>
													{file?.file?.name}
												</Box>
											</TableCell>
											{!isMobile && (
												<TableCell>
													{file?.shared_on}
												</TableCell>
											)}
											{!isMobile && (
												<TableCell>
													<Box
														display="flex"
														alignItems="center">
														<Avatar
															sx={{
																width: 24,
																height: 24,
																marginRight: 1,
															}}>
															{file?.shared_by?.fullname
																.charAt(0)
																.toUpperCase()}
														</Avatar>
														{
															file?.shared_by
																?.fullname
														}
													</Box>
												</TableCell>
											)}
											<TableCell align="right">
												<IconButton
													sx={{ px: "6px" }}
													tabIndex={index}
													onClick={(e) =>
														handleMenuClick(
															e,
															file.id
																? file.id
																: ""
														)
													}
													aria-controls={
														anchorEls[
															file?.id
																? file.id
																: ""
														]
															? "account-menu"
															: undefined
													}
													aria-haspopup="true"
													aria-expanded={
														anchorEls[
															file?.id
																? file.id
																: ""
														]
															? "true"
															: undefined
													}>
													<LuMoreVertical size={16} />
												</IconButton>
												<Menu
													anchorEl={
														anchorEls[
															file?.id
																? file.id
																: ""
														]
													}
													id="account-menu"
													open={Boolean(
														anchorEls[
															file?.id
																? file.id
																: ""
														]
													)}
													onClose={() =>
														handleMenuClose(
															file?.id
																? file.id
																: ""
														)
													}
													PaperProps={{
														elevation: 0,
														sx: {
															overflow: "visible",
															filter: "drop-shadow(0px 1px 2px rgba(185, 185, 185, 0.32))",
															mt: 1.5,
															"& .MuiAvatar-root":
																{
																	width: 32,
																	height: 32,
																	ml: -0.5,
																	mr: 1,
																},
															"&:before": {
																content: '""',
																display:
																	"block",
																position:
																	"absolute",
																top: 0,
																right: 14,
																width: 10,
																height: 10,
																bgcolor:
																	"background.paper",
																transform:
																	"translateY(-50%) rotate(45deg)",
																zIndex: 0,
															},
														},
													}}
													transformOrigin={{
														horizontal: "right",
														vertical: "top",
													}}
													anchorOrigin={{
														horizontal: "right",
														vertical: "bottom",
													}}>
													{file?.file?.type !== 2 && (
														<MenuItem
															sx={{ gap: 2 }}
															onClick={(e) => {
																dispatch(
																	downloadFile(
																		{
																			id: file
																				?.file
																				?.id,
																			action: "download",
																			file_name:
																				file
																					?.file
																					?.name ||
																				"",
																		}
																	)
																);
																// .then(
																// 	(res: any) => {
																// 		downloadFileByUrl(
																// 			res
																// 				?.payload
																// 				?.file
																// 		);
																// 	}
																// );
																handleMenuClose(
																	file?.id
																		? file.id
																		: ""
																);
															}}>
															<>
																<LuDownload
																	style={{
																		cursor: "pointer",
																		color: "#fc6f03",
																	}}
																/>
															</>
															Download
														</MenuItem>
													)}
												</Menu>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
							{loading && (
								<Box
									display="flex"
									justifyContent="center"
									padding={2}>
									<CircularProgress />
								</Box>
							)}
						</TableContainer>
					</Box>
				</Card>
			</Box>
		</Box>
	);
};

export default SharedFiles;
