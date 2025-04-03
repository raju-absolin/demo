// ProjectTeams.tsx
import { ChangeEvent, useEffect, useMemo } from "react";
import { useAppSelector } from "@src/store/store";
import TopComponent from "@src/pages/settings/TopComponent";
import { Link, useParams } from "react-router-dom";
import { useProjectGroupsActions } from "@src/store/sidemenu/project_management/ProjectGroups/projectGroups.action";
import { getFilterParams } from "@src/helpers";
import TableComponent from "@src/components/TableComponenet";
import { selectGroups } from "@src/store/sidemenu/project_management/ProjectGroups/projectGroups.slice";
import { Box, Button, IconButton, Tooltip, Zoom } from "@mui/material";
import { LuPencil } from "react-icons/lu";
import AddGroup from "./AddProjectGroups";
import Filters from "./Filters";
import ViewGroupDetails from "./ViewProjectGroup";

const ProjectTeams = () => {
	const { id, tab } = useParams();
	const {
		reducers: {
			setIsFilterOpen,
			isModalOpen,
			updateState,
			setGroupUserModalOpen,
		},
		extraReducers: { getProjectGroups },
	} = useProjectGroupsActions();

	const {
		projectGroups,
		projectGroups: {
			list,
			pageParams,
			count,
			loading,
			isFilterOpen,
			modal,
			selectedData,
			group_user_modal,
			selectedGroupUser,
		},
		workOrder: { selectedData: projectData },
		system: { userAccessList },
	} = useAppSelector((state) => selectGroups(state));

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
			title: "Name",
			width: 100,
		},
		{
			title: "Action",
			width: 100,
		},
	];
	function createData(
		index: number,
		code?: JSX.Element,
		name?: string,
		action?: JSX.Element
	) {
		return {
			index,
			code,
			name,
			action,
		};
	}

	const rows = list?.map((row, key) => {
		const index = (pageParams.page - 1) * pageParams.page_size + (key + 1);

		const status = <></>;

		const code = (
			<Tooltip
				TransitionComponent={Zoom}
				title="Click to view team details">
				<Button
					color="primary"
					variant="contained"
					onClick={() => {
						const args = {
							...projectGroups,
							group_user_modal: true,
							selectedData: row,
						};
						updateState(args);
					}}
					sx={{
						width: 150,
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
					justifyContent: "center",
				}}>
				{userAccessList?.indexOf(
					"ProjectManagement.change_projectgroup"
				) !== -1 && (
					<Tooltip TransitionComponent={Zoom} title="Edit team">
						<IconButton
							onClick={() => {
								const args = {
									...projectGroups,
									modal: true,
									selectedData: row,
								};
								updateState(args);
							}}>
							<LuPencil
								size={16}
								style={{ cursor: "pointer", color: "#fc6f03" }}
							/>
						</IconButton>
					</Tooltip>
				)}

				{/* <LuEye
					style={{ cursor: "pointer", color: "#fc6f03" }}
					onClick={() =>
						navigate(
							`/tenders/view/${id}/${tab}/purchase_enquiry/view/${row.id}`
						)
					}
				/> */}
			</Box>
		);

		return createData(index, code, row?.name, actions);
	});

	const handleSearch = ({ search }: { search?: string | undefined }) => {
		getProjectGroups({
			...pageParams,
			search: search ? search : "",
			page: 1,
			page_size: 10,
		});
	};

	const handleChangePage = (event: unknown, newPage: number) => {
		getProjectGroups({
			...pageParams,
			search: "",
			page: newPage + 1,
		});
	};

	const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
		getProjectGroups({
			...pageParams,
			search: "",
			page: 1,
			page_size: parseInt(event.target.value),
		});
	};
	const handleSort = (field: any) => {
		getProjectGroups({
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
		getProjectGroups({
			...pageParams,
			project: id,
			page: 1,
			page_size: 10,
			search: "",
		});
	}, [id]);

	const hide = (reset: () => void) => {
		reset();
		const args = {
			...projectGroups,
			modal: false,
			selectedData: {},
		};
		updateState(args);
	};

	const hideViewGroup = (reset: () => void) => {
		reset();
		const args = {
			...projectGroups,
			group_user_modal: false,
			selectedData: {},
			selectedGroupUser: {},
		};
		updateState(args);
	};

	const GroupModal = useMemo(() => {
		return (
			<AddGroup
				open={modal}
				project_id={id ? id : ""}
				hide={hide}
				selectedData={selectedData}
				params={pageParams}
			/>
		);
	}, [selectedData, modal]);
	const GroupUsersModal = useMemo(() => {
		return (
			<ViewGroupDetails
				open={group_user_modal}
				project_id={id ? id : ""}
				hide={hideViewGroup}
				selectedData={selectedData}
				params={pageParams}
			/>
		);
	}, [selectedData, modal]);

	return (
		<div>
			{GroupModal}
			{GroupUsersModal}
			<TopComponent
				permissionPreFix="ProjectManagement"
				permissionPostFix="projectgroup"
				navigateLink={``}
				showAddButton={true}
				addButtonName="Add Group"
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

export default ProjectTeams;
