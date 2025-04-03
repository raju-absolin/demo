import React, {
	ChangeEvent,
	Dispatch,
	useState,
	useEffect,
	SyntheticEvent,
} from "react";
import { useAppDispatch, useAppSelector } from "@src/store/store";
import {
	deleteAccount,
	editAccounts,
	getGroups,
	getAccounts,
	getAccountsById,
	getAccountsByIdBreadcrumb,
	getAccountsWithChildrenList,
} from "@src/store/masters/Account/accounts.action";
import {
	accountsSelector,
	setSearchValue,
	isModelVisible,
	setMasterEditId,
	setParentValue,
	setBreadCrumbs,
	setAccountsList,
	setOpenView,
	setSelectedData as selectedAccountData,
} from "@src/store/masters/Account/accounts.slice";
import { systemSelector } from "@src/store/system/system.slice";
import TableComponent from "@src/components/TableComponenet";
import {
	Link,
	useOutletContext,
	useNavigate,
	useParams,
} from "react-router-dom";
import { LuEye, LuPencil, LuSearch, LuTrash2 } from "react-icons/lu";
import TopComponent from "@src/pages/settings/TopComponent";
import {
	Box,
	Button,
	FormControlLabel,
	Card,
	CardContent,
	TextField,
	InputAdornment,
	List,
	ListItemText,
	Collapse,
	ListItemSecondaryAction,
	Paper,
	styled,
	tableCellClasses,
	Popover,
	Typography,
} from "@mui/material";
import ListItem from "@mui/material/ListItem";
import MasterPageTitle from "@src/components/MasterPageTitle";
import PageTitle from "@src/components/PageTitle";
import SearchIcon from "@mui/icons-material/Search";
import { selectLayoutTheme } from "@src/store/customise/customise";
import { RiAddCircleFill, RiArrowLeftCircleFill } from "react-icons/ri";
import { SimpleTreeView } from "@mui/x-tree-view/SimpleTreeView";
import { TreeItem, useTreeViewApiRef } from "@mui/x-tree-view";
import {
	CardHeader,
	Grid2 as Grid,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	TablePagination,
	IconButton,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import AddGroupMasters from "./add.group";
import { PageBreadcrumb } from "@src/components";
import {
	Delete,
	ExpandLess,
	ExpandMore,
	MarginTwoTone,
} from "@mui/icons-material";
import BreadCrumbs from "./BreadCrumbs";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { object, string } from "yup";
import { getAccountgroupById } from "@src/store/masters/AccountGroup/accountgroup.action";
import { setSelectedData } from "@src/store/masters/AccountGroup/accountgroup.slice";
import ViewAccount from "./view.account";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
	[`&.${tableCellClasses.head}`]: {
		backgroundColor: theme.palette.grey[100],
		color: theme.palette.primary,
	},
	[`&.${tableCellClasses.body}`]: {
		fontSize: 14,
	},
}));

interface Account {
	id: string;
	label: string;
	children?: Account[];
}

interface SimpleTreeViewProps {
	accounts: Account[];
}
const StyledTableRow = styled(TableRow)(({ theme }) => ({
	"&:nth-of-type(odd)": {
		backgroundColor: theme.palette.common.white,
	},
	// hide last border
	"&:last-child td, &:last-child th": {
		border: 10,
	},
}));

const Accounts = () => {
	const dispatch = useAppDispatch();
	const [open, setOpen] = useState(false);
	const navigate = useNavigate();
	const { id } = useParams();
	const apiRef = useTreeViewApiRef();
	const [currentExpansion, setCurrentExpansion] = useState(false);
	const [lastSelectedAccount, setLastSelectedAccount] = React.useState<
		string | null
	>(null);

	const outletContext = useOutletContext<{
		title: string;
		subtitle: string;
		setTitle: Function;
		setSubtitle: Function;
	}>();
	const [anchorEl, setAnchorEl] = useState(null);
	const deleteOpen = Boolean(anchorEl);
	const [currentId, setCurrentId] = useState(null);

	const {
		accounts: {
			accountsList,
			breadCrumbsList,
			GroupsTree,
			pageParams,
			loading,
			accountsCount,
			searchValue,
			masterValue,
			parentValue,
			selectedData,
			accountGroupData,
			masterEditId,
			accountgroupList,
		},
		system: { userAccessList },
	} = useAppSelector((state) => {
		return {
			accounts: accountsSelector(state),
			system: systemSelector(state),
		};
	});

	const columns = [
		{
			title: "S.No",
			width: 100,
		},
		{
			title: "Code",
			width: 100,
		},
		{
			title: "Name",
			width: 100,
		},
		{
			title: "Account Type",
			width: 100,
		},
		{
			title: "Descriptions",
			width: 100,
		},
		{
			title: "Group Name",
			width: 100,
		},
		{
			title: "Actions",
			width: 100,
		},
	];

	let searchSchema = object({
		search: string(),
	});

	const { control, handleSubmit, register, reset } = useForm({
		resolver: yupResolver(searchSchema),
		values: {
			search: pageParams.search,
		},
	});

	const handleClick = (event: any, id: any) => {
		setCurrentId(id);
		setAnchorEl(event.currentTarget);
	};
	const handleDeleteClose = () => {
		setAnchorEl(null);
	};
	const confirmDelete = (deleteId: any) => {
		dispatch(
			deleteAccount({
				id: deleteId,
				clearDataFn: () => {},
				navigate: (path: string) => {},
			})
		);
		handleDeleteClose();
	};
	const handleSearch = ({ search }: { search?: string | undefined }) => {
		dispatch(
			getAccounts({
				...pageParams,
				search: search ? search : "",
				page: 1,
				page_size: 10,
			})
		);
	};

	const handleChangePage = (event: unknown, newPage: number) => {
		dispatch(
			getAccounts({
				...pageParams,
				search: "",
				page: newPage + 1,
			})
		);
	};

	const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
		dispatch(
			getAccounts({
				...pageParams,
				search: "",
				page: 1,
				page_size: parseInt(event.target.value),
			})
		);
	};

	useEffect(() => {
		if (id != undefined) {
			dispatch(
				getAccounts({
					parent: id,
					page: 1,
					page_size: 10,
				})
			);
			dispatch(getAccountsByIdBreadcrumb({ id: id }));
			dispatch(setBreadCrumbs([]));
		} else {
			dispatch(
				getAccounts({
					search: "",
					page: 1,
					page_size: 10,
				})
			);
		}
		dispatch(
			getAccountsWithChildrenList({
				search: "",
				page: 1,
				page_size: 10,
			})
		);
		reset({ search: "" });
	}, []);

	const getSubGroups = (
		groupId: any,
		parentIds: Array<any>,
		event: React.MouseEvent,
		hasNoChildren: boolean
	) => {
		if (hasNoChildren) {
			dispatch(
				getAccountsWithChildrenList({
					parentIds: parentIds,
					parent: groupId,
					page: 1,
					page_size: 10,
				})
			).then(() => {
				apiRef.current!.setItemExpansion(event, groupId, true);
				apiRef.current!.selectItem({
					// The DOM event that triggered the change
					event,
					// The id of the item to select or deselect
					itemId: groupId,
					// If `true`, the other already selected items will remain selected
					// Otherwise, they will be deselected
					// This parameter is only relevant when `multiSelect` is `true`
					keepExistingSelection: false,
					// If `true` the item will be selected
					// If `false` the item will be deselected
					// If not defined, the item's new selection status will be the opposite of its current one
					shouldBeSelected: true,
				});
			});
		}
		dispatch(
			getAccounts({
				parent: groupId,
				page: 1,
				page_size: 10,
			})
		);
	};

	const openModal = (value: boolean) => {
		dispatch(setSelectedData({}));
		dispatch(setMasterEditId(0));
		setOpen(value);
		dispatch(isModelVisible(value));
	};

	const handleClose = () => {
		setOpen(false);
	};
	const handleAccountSelectionToggle = (
		event: React.SyntheticEvent,
		accountId: string,
		isSelected: boolean
	) => {
		if (isSelected) {
			setLastSelectedAccount(accountId);
		}
	};

	const handleAccountExpansionToggle = (
		event: React.SyntheticEvent,
		accountId: string,
		isExpanded: boolean
	) => {
		setCurrentExpansion(isExpanded);
	};

	function onAccountClick(account: any, event: any) {
		dispatch(setParentValue(account?.id));
		getSubGroups(
			account.id,
			[...parentValue, account?.id],
			event,
			!account.children
		);
		dispatch(getAccountsByIdBreadcrumb({ id: account?.id }));
		navigate(`/pages/masters/accounts/${account?.id}`);
		dispatch(
			getAccounts({
				parent: account?.id,
				page: 1,
				page_size: 10,
			})
		);
	}

	function displayChildrenGroups(childrenList: any, parentIds: Array<any>) {
		return childrenList?.map((child: any, index: number) => (
			<TreeItem
				itemId={child?.id ? child?.id : ""}
				style={{ marginTop: "10px" }}
				label={
					<span style={{ fontWeight: "400", fontSize: "15px" }}>
						{child.name}
					</span>
				}
				onClick={(event) => {
					const parentId = [child?.id];
					dispatch(setParentValue(child?.id));
					getSubGroups(
						child.id,
						[...parentIds, child?.id],
						event,
						!child.children
					);
					navigate(`/pages/masters/accounts/${child?.id}`);
					dispatch(getAccountsByIdBreadcrumb({ id: child?.id }));
					if (!parentId.includes(child?.id)) {
						dispatch(
							getAccounts({
								parent: child?.id,
								page: 1,
								page_size: 10,
							})
						);
					}
				}}>
				{displayChildrenGroups(child.children, [
					...parentIds,
					child?.id,
				])}
			</TreeItem>
		));
	}

	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const search = event.target.value;
		dispatch(
			getAccounts({
				...pageParams,
				search: search ? search : "",
				page: 1,
				page_size: 10,
			})
		);
	};

	return (
		<>
			<MasterPageTitle
				prefix={"Masters"}
				postfix={"account"}
				pageTitle="Accounts"
				goBack={true}
				addModelTile={
					userAccessList?.indexOf("Masters.add_account") !== -1
						? "Add Account"
						: undefined
				}
				// addTitle={
				// 	userAccessList?.indexOf("Masters.add_account") !== -1 ? "Add Group" : undefined
				// }
				modalVisible={true}
				pageText={""}
				navigationToAdd={"/pages/masters/account/add/0"}
				otherButtons={[
					<Button
						variant="contained"
						color="primary"
						onClick={() => openModal(true)}
						sx={{ marginRight: 2 }}
						startIcon={<RiAddCircleFill size={22} />}>
						Add Group
					</Button>,
				]}>
				<Grid container spacing={2}>
					<Grid size={{ xs: 3 }}>
						<Card sx={{ marginTop: 2 }}>
							<CardContent>
								{/* <Card>
						<CardContent> */}
								<CardHeader
									title="GROUPS"
									className="bg-transparent border-bottom"
								/>
								{/* <Button
								variant="contained"
								color="primary"
								onClick={() => openModal(true)}
								sx={{ marginRight: 2 }}
								startIcon={<RiAddCircleFill size={22} />}
							>
								Group
							</Button> */}
								{/* <Button
								variant="contained"
								color="primary"
								onClick={() => {
									dispatch(setParentValue(""));
									dispatch(getAccounts({
										search: "",
										page: 1,
										page_size: 10,
									})
									)
								}
								}
							>
								Clear Filters
							</Button> */}

								<SimpleTreeView
									apiRef={apiRef}
									onItemExpansionToggle={
										handleAccountExpansionToggle
									}
									onItemSelectionToggle={
										handleAccountSelectionToggle
									}>
									{displayChildrenGroups(GroupsTree, [])}
								</SimpleTreeView>
							</CardContent>
						</Card>
					</Grid>
					<Grid size={{ xs: 9 }}>
						<Card sx={{ marginBottom: "20px", marginTop: "20px" }}>
							<CardContent>
								<Grid container spacing={2}>
									<Grid size={{ md: 4 }}>
										<form
											action=""
											onSubmit={handleSubmit(
												handleSearch
											)}>
											<Grid container mb={2}>
												<TextField
													type="text"
													sx={{
														width: "500px",
													}}
													{...register("search")}
													id="input-with-icon-textfield"
													size="small"
													InputProps={{
														startAdornment: (
															<InputAdornment position="start">
																<LuSearch
																	size={20}
																/>
															</InputAdornment>
														),
													}}
													fullWidth
													variant="outlined"
													placeholder="Search"
													onChange={handleInputChange}
												/>
											</Grid>
										</form>
									</Grid>
								</Grid>
								<BreadCrumbs />
								<TableContainer component={Paper}>
									<Table
										sx={{ minWidth: 700 }}
										aria-label="customized table">
										<TableHead>
											<TableRow>
												<StyledTableCell>
													S.No
												</StyledTableCell>
												<StyledTableCell>
													Code
												</StyledTableCell>
												<StyledTableCell>
													Name
												</StyledTableCell>
												<StyledTableCell>
													Account Type
												</StyledTableCell>
												<StyledTableCell>
													Description
												</StyledTableCell>
												<StyledTableCell>
													Actions
												</StyledTableCell>
											</TableRow>
										</TableHead>
										<TableBody>
											{accountsList?.length > 0 ? (
												<>
													{accountsList?.map(
														(
															row: any,
															key: number
														) => (
															<TableRow
																key={row?.id}
																hover // Adds hover effect
																style={{
																	cursor: "pointer",
																}} // Adds pointer cursor to show it's clickable
																onClick={(
																	event
																) => {
																	if (
																		row?.type !=
																		2
																	) {
																		onAccountClick(
																			row,
																			event
																		);
																	}
																}} // Handle row click
															>
																<StyledTableCell>
																	{(pageParams.page -
																		1) *
																		pageParams.page_size +
																		(key +
																			1)}
																</StyledTableCell>
																<StyledTableCell>
																	{row?.code}
																</StyledTableCell>
																<StyledTableCell>
																	{row?.name}
																</StyledTableCell>
																<StyledTableCell>
																	{
																		row
																			?.account_type
																			?.name
																	}
																</StyledTableCell>
																<StyledTableCell>
																	{
																		row?.remarks
																	}
																</StyledTableCell>
																<StyledTableCell>
																	<Box
																		sx={{
																			display:
																				"flex",
																			gap: 2,
																		}}
																		onClick={(
																			e
																		) =>
																			e.stopPropagation()
																		}>
																		{userAccessList?.indexOf(
																			"Masters.view_account"
																		) !==
																			-1 &&
																			row?.type ==
																				2 && (
																				<LuEye
																					style={{
																						cursor: "pointer",
																						color: "#fc6f03",
																					}}
																					onClick={() => {
																						dispatch(
																							selectedAccountData(
																								row
																							)
																						);
																						dispatch(
																							setOpenView(
																								true
																							)
																						);
																					}}
																				/>
																			)}
																		{userAccessList?.indexOf(
																			"Masters.change_account"
																		) !==
																			-1 && (
																			<LuPencil
																				style={{
																					cursor: "pointer",
																					color: "#fc6f03",
																				}}
																				onClick={() => {
																					if (
																						row?.type ==
																						2
																					) {
																						dispatch(
																							getAccountsById(
																								{
																									id: row?.id,
																								}
																							)
																						);
																						dispatch(
																							setMasterEditId(
																								row?.id
																							)
																						);
																						navigate(
																							`/pages/masters/account/add/${row?.id}`
																						);
																					} else {
																						dispatch(
																							getAccountgroupById(
																								{
																									id: row?.id,
																								}
																							)
																						);
																						openModal(
																							true
																						);
																						dispatch(
																							setMasterEditId(
																								row?.id
																							)
																						);
																					}
																				}}
																			/>
																		)}
																		{userAccessList?.indexOf(
																			"Masters.delete_account"
																		) !==
																			-1 && (
																			<>
																				<LuTrash2
																					style={{
																						cursor: "pointer",
																						color: "#fc6f03",
																					}}
																					onClick={(
																						e
																					) =>
																						handleClick(
																							e,
																							row?.id
																						)
																					}
																				/>
																				<Popover
																					id={
																						currentId
																							? String(
																									currentId
																								)
																							: undefined
																					}
																					open={
																						deleteOpen
																					}
																					anchorEl={
																						anchorEl
																					}
																					onClose={
																						handleDeleteClose
																					}
																					anchorOrigin={{
																						vertical:
																							"top",
																						horizontal:
																							"right",
																					}}
																					transformOrigin={{
																						vertical:
																							"bottom",
																						horizontal:
																							"left",
																					}}>
																					<div
																						style={{
																							padding:
																								"15px",
																						}}>
																						<Typography
																							variant="subtitle1"
																							gutterBottom>
																							Are
																							you
																							sure
																							to
																							delete
																							this
																							Record?
																						</Typography>
																						<Button
																							variant="contained"
																							type="submit"
																							color="primary"
																							onClick={() => {
																								confirmDelete(
																									currentId
																								);
																							}}
																							autoFocus>
																							Yes
																						</Button>
																						<Button
																							variant="outlined"
																							size="small"
																							onClick={
																								handleDeleteClose
																							}
																							style={{
																								marginLeft:
																									"20px",
																							}}>
																							No
																						</Button>
																					</div>
																				</Popover>
																			</>
																		)}
																	</Box>
																</StyledTableCell>
															</TableRow>
														)
													)}
												</>
											) : (
												<TableRow>
													<StyledTableCell
														colSpan={columns.length}
														align="center"
														sx={{
															padding: 5,
														}}>
														Empty Data
													</StyledTableCell>
												</TableRow>
											)}
										</TableBody>
									</Table>
								</TableContainer>
								<TablePagination
									rowsPerPageOptions={[
										10,
										20,
										50,
										100,
										{ label: "All", value: -1 },
									]}
									component="div"
									count={accountsCount}
									rowsPerPage={pageParams.page_size}
									page={pageParams.page - 1}
									onPageChange={handleChangePage}
									onRowsPerPageChange={
										handleChangeRowsPerPage
									}
								/>
							</CardContent>
						</Card>
					</Grid>
				</Grid>
			</MasterPageTitle>

			<AddGroupMasters
				modal={open}
				closeModal={handleClose}
				editId={masterEditId}
				mastersName="AccountGroup"
				mastersValue={masterValue}
				groupdata={accountGroupData}
			/>
			<ViewAccount />
		</>
	);
};

export default Accounts;
