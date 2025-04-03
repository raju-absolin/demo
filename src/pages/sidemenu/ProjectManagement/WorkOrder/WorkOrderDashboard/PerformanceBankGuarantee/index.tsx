// PerformanceBankGuarantee.tsx
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "@src/store/store";
import TopComponent from "@src/pages/settings/TopComponent";
import { Link, useParams } from "react-router-dom";
import {
	deletePerformanceBankGuaranteesById,
	getProjectPerformanceBankGuaranteesById,
	usePerformanceBankGuaranteesActions,
} from "@src/store/sidemenu/project_management/PerformanceBankGuarantee/PBG.action";
import { getFilterParams } from "@src/helpers";
import TableComponent from "@src/components/TableComponenet";
import {
	isViewModalOpen,
	selectPerformanceBankGuarantees,
	setAttachments,
} from "@src/store/sidemenu/project_management/PerformanceBankGuarantee/PBG.slice";
import {
	Box,
	Button,
	IconButton,
	Popover,
	Tooltip,
	Typography,
	Zoom,
} from "@mui/material";
import { LuDelete, LuPencil, LuTrash2 } from "react-icons/lu";
import AddPBGModal from "./AddPBGModal";
import Filters from "./Filters";
import ReadMore from "@src/components/ReadMoreText";
import moment from "moment";
import ViewPBGModal from "./ViewPBGModal";

const PerformanceBankGuarantee = () => {
	const { id, tab } = useParams();
	const {
		reducers: {
			setIsFilterOpen,
			isModalOpen,
			updateState,
			setSelectedData,
		},
		extraReducers: {
			getProjectPerformanceBankGuarantees,
			deletePerformanceBankGuaranteesById,
		},
	} = usePerformanceBankGuaranteesActions();

	const {
		performanceBankGuarantee,
		performanceBankGuarantee: {
			list,
			pageParams,
			count,
			loading,
			isFilterOpen,
			modal,
			view_modal,
			selectedData,
		},
		workOrder: { selectedData: projectData },
		system: { userAccessList },
	} = useAppSelector((state) => selectPerformanceBankGuarantees(state));
	const [anchorEl, setAnchorEl] = useState(null);
	const deleteOpen = Boolean(anchorEl);
	const [currentId, setCurrentId] = useState(null);
	const dispatch = useAppDispatch();

	const openViewModal = (value: boolean) => {
		dispatch(isViewModalOpen(value));
	};

	const columns = [
		{
			title: "S.No",
			width: 100,
		},
		{
			title: "Code",
			width: 100,
			sortable: true,
			field: "code",
		},
		{
			title: "PBG number",
			width: 100,
		},
		{
			title: "PBG Value",
			width: 100,
		},
		{
			title: "Date Of Issue",
			width: 100,
		},
		{
			title: "Date Of Expiry",
			width: 100,
		},
		{
			title: "Date Of Claim",
			width: 100,
		},
		{
			title: "Created Date",
			width: 100,
			sortable: true,
			field: "created_on",
		},
		{
			title: "Remarks",
			width: 100,
		},
		{
			title: "Action",
			width: 100,
		},
	];

	function createData(
		index: number,
		code: React.JSX.Element,
		number: string,
		value: string,
		issuedate: string,
		expirydate: string,
		claimdate: string,
		createdDate: string,
		remarks: React.JSX.Element,
		actions: React.JSX.Element
	) {
		return {
			index,
			code,
			number,
			value,
			issuedate,
			expirydate,
			claimdate,
			createdDate,
			remarks,
			actions,
		};
	}
	const handleClick = (event: any, id: any) => {
		setCurrentId(id);
		setAnchorEl(event.currentTarget);
	};

	const handleDeleteClose = () => {
		setAnchorEl(null);
	};
	const confirmDelete = (deleteId: any) => {
		deletePerformanceBankGuaranteesById({
			id: deleteId,
			params: pageParams,
		});
		handleDeleteClose();
	};

	const rows = useMemo(() => {
		return list?.map((row, key) => {
			const index =
				(pageParams.page - 1) * pageParams.page_size + (key + 1);

			const remarks = (
				<ReadMore
					text={row?.remarks ? row.remarks : ""}
					maxLength={30}
				/>
			);
			const code = (
				<Tooltip
					TransitionComponent={Zoom}
					title="Click to view PBG details">
					<Button
						color="primary"
						variant="contained"
						sx={{
							width: 150,
						}}
						onClick={() => {
							openViewModal(true);
							setSelectedData(row);
							if (row?.file) {
								const split: string[] | undefined =
									row?.file?.split("/");
								const uploadedattachments = [
									{
										path: split
											? split[split.length - 1]
											: "",
										preview: row?.file,
										formattedSize: "",
									},
								];
								dispatch(setAttachments(uploadedattachments));
							} else {
								dispatch(setAttachments([]));
							}
						}}>
						{row?.code}
					</Button>
				</Tooltip>
			);
			const actions = (
				<Box
					sx={{
						display: "flex",
						gap: 2,
						justifyContent: "start",
					}}>
					{userAccessList?.indexOf(
						"ProjectManagement.change_performancebankguarantee"
					) !== -1 && (
						<Tooltip
							TransitionComponent={Zoom}
							title="Edit Performance Bank Guarantee">
							<LuPencil
								style={{
									cursor: "pointer",
									color: "#fc6f03",
								}}
								onClick={() => {
									setSelectedData(row);
									const split: string[] | undefined =
										row?.file?.split("/");
									const uploadedattachments = [
										{
											path: split
												? split[split.length - 1]
												: "",
											preview: row?.file,
											formattedSize: "",
										},
									];
									dispatch(
										setAttachments(uploadedattachments)
									);
									openModal(true);
								}}
							/>
						</Tooltip>
					)}

					{userAccessList?.indexOf(
						"ProjectManagement.delete_performancebankguarantee"
					) !== -1 && (
						<Box>
							<LuTrash2
								style={{ cursor: "pointer", color: "#fc6f03" }}
								onClick={(e) => handleClick(e, row?.id)}
							/>
							<Popover
								id={currentId ? String(currentId) : undefined}
								open={deleteOpen}
								anchorEl={anchorEl}
								onClose={handleDeleteClose}
								anchorOrigin={{
									vertical: "top",
									horizontal: "right",
								}}
								transformOrigin={{
									vertical: "bottom",
									horizontal: "left",
								}}>
								<div style={{ padding: "15px" }}>
									<Typography
										variant="subtitle1"
										gutterBottom>
										Are you sure to delete this Record?
									</Typography>
									<Button
										variant="contained"
										type="submit"
										color="primary"
										onClick={() => confirmDelete(currentId)}
										autoFocus>
										Yes
									</Button>
									<Button
										variant="outlined"
										size="small"
										onClick={handleDeleteClose}
										style={{ marginLeft: "20px" }}>
										No
									</Button>
								</div>
							</Popover>
						</Box>
					)}
				</Box>
			);
			return createData(
				index,
				code,
				row?.number || "",
				row?.value || "",
				moment(row?.issuedate).format("DD-MM-YYYY") || "",
				moment(row?.expirydate).format("DD-MM-YYYY") || "",
				moment(row?.claimdate).format("DD-MM-YYYY") || "",
				moment(row?.created_on).format("DD-MM-YYYY") || "",
				remarks,
				actions
			);
		});
	}, [selectedData, createData]);

	const handleSearch = ({ search }: { search?: string | undefined }) => {
		getProjectPerformanceBankGuarantees({
			...pageParams,
			project: id || "",
			search: search ? search : "",
			page: 1,
			page_size: 10,
		});
	};

	const handleChangePage = (event: unknown, newPage: number) => {
		getProjectPerformanceBankGuarantees({
			...pageParams,
			project: id || "",
			search: "",
			page: newPage + 1,
		});
	};

	const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
		getProjectPerformanceBankGuarantees({
			...pageParams,
			project: id || "",
			search: "",
			page: 1,
			page_size: parseInt(event.target.value),
		});
	};
	const handleSort = (field: any) => {
		getProjectPerformanceBankGuarantees({
			...pageParams,
			ordering: field,
			page: 1,
		});
	};
	const openModal = (value: boolean) => {
		isModalOpen(value);
	};

	const handleFilter = (open: boolean) => {
		setIsFilterOpen(open);
	};

	useEffect(() => {
		getProjectPerformanceBankGuarantees({
			...pageParams,
			project: id || "",
			page: 1,
			page_size: 10,
			search: "",
		});
	}, [id]);

	const hide = (reset: () => void) => {
		reset();
		const args = {
			...performanceBankGuarantee,
			modal: false,
			selectedData: {},
		};
		updateState(args);
	};
	const ViewHide = (value: boolean) => {
		const args = {
			...performanceBankGuarantee,
			view_modal: value,
			selectedData: {},
		};
		updateState(args);
	};
	const teamModel = useMemo(() => {
		return (
			<AddPBGModal
				open={modal}
				project_id={id ? id : ""}
				hide={hide}
				selectedData={selectedData}
				params={pageParams}
			/>
		);
	}, [selectedData, modal]);

	return (
		<div>
			{modal && (
				<AddPBGModal
					open={modal}
					project_id={id ? id : ""}
					hide={hide}
					selectedData={selectedData}
					params={pageParams}
				/>
			)}
			<TopComponent
				permissionPreFix="ProjectManagement"
				permissionPostFix="performancebankguarantee"
				navigateLink={``}
				showAddButton={true}
				addButtonName="Add Performance Bank Guarantee"
				handleSearch={handleSearch}
				showFilterButton={true}
				openFilter={handleFilter}
				openModal={openModal}
				filteredData={getFilterParams(pageParams, ["project"])}
			/>
			<TableComponent
				count={count}
				columns={columns}
				rows={rows}
				loading={loading}
				page={pageParams.page}
				pageSize={pageParams.page_size}
				handleSort={handleSort}
				handleChangePage={handleChangePage}
				handleChangeRowsPerPage={handleChangeRowsPerPage}
			/>
			<Filters openFilter={isFilterOpen} handleFilter={handleFilter} />
			{view_modal && (
				<ViewPBGModal
					open={view_modal}
					project_id={id ? id : ""}
					hide={() => ViewHide(false)}
					selectedData={selectedData}
					params={pageParams}
				/>
			)}
		</div>
	);
};

export default PerformanceBankGuarantee;
