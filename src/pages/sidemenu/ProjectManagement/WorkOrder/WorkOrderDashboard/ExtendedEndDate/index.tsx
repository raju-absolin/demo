// ExtendedEndDate.tsx
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { useAppSelector } from "@src/store/store";
import TopComponent from "@src/pages/settings/TopComponent";
import { Link, useParams } from "react-router-dom";
import { useExtendedEndDatesActions } from "@src/store/sidemenu/project_management/ExtendedEndDate/EED.action";
import { getFilterParams } from "@src/helpers";
import TableComponent from "@src/components/TableComponenet";
import { selectExtendedEndDates } from "@src/store/sidemenu/project_management/ExtendedEndDate/EED.slice";
import {
	Box,
	Button,
	IconButton,
	Popover,
	Tooltip,
	Typography,
	Zoom,
} from "@mui/material";
import { LuDelete, LuEye, LuPencil, LuTrash2 } from "react-icons/lu";
import AddPBGModal from "./AddEEDModal";
import Filters from "./Filters";
import ReadMore from "@src/components/ReadMoreText";
import moment from "moment";

const ExtendedEndDate = () => {
	const { id, tab } = useParams();
	const {
		reducers: {
			setIsFilterOpen,
			isModalOpen,
			updateState,
			setSelectedData,
		},
		extraReducers: {
			getProjectExtendedEndDates,
			// deleteExtendedEndDatesById,
		},
	} = useExtendedEndDatesActions();

	const {
		extendedEndDate,
		extendedEndDate: {
			list,
			pageParams,
			count,
			loading,
			isFilterOpen,
			modal,
			selectedData,
			attachments,
		},
		workOrder: { selectedData: projectData },
		system: { userAccessList },
	} = useAppSelector((state) => selectExtendedEndDates(state));
	// const [anchorEl, setAnchorEl] = useState(null);
	// const deleteOpen = Boolean(anchorEl);
	// const [currentId, setCurrentId] = useState(null);

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
			title: "Extended Due Date",
			width: 100,
			// sortable: true, field: "extended_due_date"
		},
		{
			title: "Attached Document",
			width: 100,
		},
		// {
		// 	title: "Action",
		// 	width: 100,
		// },
	];

	function createData(
		index: number,
		code: string,
		extended_due_date: string,
		file: React.JSX.Element
		// actions: React.JSX.Element
	) {
		return {
			index,
			code,
			extended_due_date,
			file,
			// actions,
		};
	}
	// const handleClick = (event: any, id: any) => {
	// 	setCurrentId(id);
	// 	setAnchorEl(event.currentTarget);
	// };

	// const handleDeleteClose = () => {
	// 	setAnchorEl(null);
	// };
	// const confirmDelete = (deleteId: any) => {
	// 	deleteExtendedEndDatesById({
	// 		id: deleteId,
	// 		params: pageParams,
	// 	});
	// 	handleDeleteClose();
	// };

	const rows = useMemo(() => {
		return list?.map((row, key) => {
			const index =
				(pageParams.page - 1) * pageParams.page_size + (key + 1);

			const file = (
				<Tooltip TransitionComponent={Zoom} title="View File">
					<IconButton
						component={"a"}
						href={row?.file}
						target="_blank">
						<LuEye
							size={16}
							style={{
								color: "#167bf0",
							}}
						/>
					</IconButton>
				</Tooltip>
			);

			const actions = (
				<Box
					sx={{
						display: "flex",
						gap: 2,
						justifyContent: "center",
					}}>
					{userAccessList?.indexOf(
						"ProjectManagement.change_projectduedatedocument"
					) !== -1 && (
						<Tooltip
							TransitionComponent={Zoom}
							title="Edit Extended Due Date">
							<LuPencil
								style={{
									cursor: "pointer",
									color: "#fc6f03",
								}}
								onClick={() => {
									setSelectedData(row);
									openModal(true);
								}}
							/>
						</Tooltip>
					)}

					{/* {userAccessList?.indexOf(
						"ProjectManagement.delete_projectduedatedocument"
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
					)} */}
				</Box>
			);
			return createData(
				index,
				row?.code || "",
				row?.extended_due_date
					? moment(row.extended_due_date, "DD-MM-YYYY hh:mm A").format("DD-MM-YYYY")
					: "",
				file
				// actions
			);
		});
	}, [selectedData, createData]);

	const handleSearch = ({ search }: { search?: string | undefined }) => {
		getProjectExtendedEndDates({
			...pageParams,
			project: id || "",
			search: search ? search : "",
			page: 1,
			page_size: 10,
		});
	};

	const handleChangePage = (event: unknown, newPage: number) => {
		getProjectExtendedEndDates({
			...pageParams,
			project: id || "",
			search: "",
			page: newPage + 1,
		});
	};

	const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
		getProjectExtendedEndDates({
			...pageParams,
			project: id || "",
			search: "",
			page: 1,
			page_size: parseInt(event.target.value),
		});
	};
	const handleSort = (field: any) => {
		getProjectExtendedEndDates({
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
		getProjectExtendedEndDates({
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
			...extendedEndDate,
			modal: false,
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
				attachments={attachments}
			/>
		);
	}, [selectedData, modal, attachments, pageParams, id]);

	return (
		<div>
			{/* {teamModel}
			 */}
			{modal && <AddPBGModal
				open={modal}
				project_id={id ? id : ""}
				hide={hide}
				selectedData={selectedData}
				params={pageParams}
				attachments={attachments}
			/>}
			<TopComponent
				permissionPreFix="ProjectManagement"
				permissionPostFix="projectduedatedocument"
				navigateLink={``}
				showAddButton={true}
				addButtonName="Add Extended Due Date"
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
		</div>
	);
};

export default ExtendedEndDate;
