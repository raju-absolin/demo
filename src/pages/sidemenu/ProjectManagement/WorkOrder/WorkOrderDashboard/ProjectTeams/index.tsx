// ProjectTeams.tsx
import { ChangeEvent, useEffect, useMemo } from "react";
import { useAppSelector } from "@src/store/store";
import TopComponent from "@src/pages/settings/TopComponent";
import { Link, useParams } from "react-router-dom";
import { useProjectTeamsActions } from "@src/store/sidemenu/project_management/project_teams/project_teams.action";
import { getFilterParams } from "@src/helpers";
import TableComponent from "@src/components/TableComponenet";
import { selectTeams } from "@src/store/sidemenu/project_management/project_teams/project_teams.slice";
import { Box, Button, IconButton, Tooltip, Zoom } from "@mui/material";
import { LuPencil } from "react-icons/lu";
import AddTeamMembers from "../../components/AddTeamModal";
import Filters from "./Filters";

const ProjectTeams = () => {
	const { id, tab } = useParams();
	const {
		reducers: { setIsFilterOpen, isModalOpen, updateState },
		extraReducers: { getProjectTeams },
	} = useProjectTeamsActions();

	const {
		teams,
		teams: {
			list,
			pageParams,
			count,
			loading,
			isFilterOpen,
			modal,
			selectedData,
		},
		workOrder: { selectedData: projectData },
		system: { userAccessList },
	} = useAppSelector((state) => selectTeams(state));

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
			title: "User Name",
			width: 100,
		},
		{
			title: "Full Name",
			width: 100,
		},
		{
			title: "User Type",
			width: 100,
		},
		{
			title: "Screen Type",
			width: 100,
		},
		{
			title: "Created Date",
			width: 100,
			sortable: true,
			field: "created_on",
		},
		{
			title: "Action",
			width: 100,
		},
	];
	function createData(
		index: number,
		code?: JSX.Element | string,
		username?: string | number,
		fullname?: string,
		user_type?: string,
		screen_type?: string,
		created_on?: string,
		action?: JSX.Element
	) {
		return {
			index,
			code,
			username,
			fullname,
			user_type,
			screen_type,
			created_on,
			action,
		};
	}

	const rows = list?.map((row, key) => {
		const index = (pageParams.page - 1) * pageParams.page_size + (key + 1);

		const status = <></>;

		const code =
			// <Tooltip
			// 	TransitionComponent={Zoom}
			// 	title="Click to view team details">
			// 	<Link
			// 		to={`/work_order/view/${id}/${tab}/project/teams/view/${row.id}`}>
			// 		<Button
			// 			color="primary"
			// 			variant="contained"
			// 			sx={{
			// 				width: 150,
			// 			}}>
			// 			{row?.code}
			// 		</Button>
			// 	</Link>
			// </Tooltip>
			row?.code;

		const action = (
			<Box
				sx={{
					display: "flex",
					gap: 2,
					justifyContent: "center",
				}}>
				{userAccessList?.indexOf(
					"Permissions.change_assignees"
				) !== -1 && (
					<Tooltip TransitionComponent={Zoom} title="Edit team">
						<IconButton
							onClick={() => {
								const args = {
									...teams,
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

		return createData(
			index,
			code,
			row?.user?.username,
			row?.user?.fullname,
			row?.user_type?.name,
			row?.screen_type_name,
			row?.created_on,
			action
		);
	});

	const handleSearch = ({ search }: { search?: string | undefined }) => {
		getProjectTeams({
			...pageParams,
			search: search ? search : "",
			page: 1,
			page_size: 10,
		});
	};

	const handleChangePage = (event: unknown, newPage: number) => {
		getProjectTeams({
			...pageParams,
			search: "",
			page: newPage + 1,
		});
	};

	const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
		getProjectTeams({
			...pageParams,
			search: "",
			page: 1,
			page_size: parseInt(event.target.value),
		});
	};

	const handleSort = (field: any) => {
		getProjectTeams({
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
		getProjectTeams({
			...pageParams,
			transaction_id: id,
			page: 1,
			page_size: 10,
			search: "",
		});
	}, [id]);

	const hide = (reset: () => void) => {
		reset();
		const args = {
			...teams,
			modal: false,
			selectedData: {},
		};
		updateState(args);
	};

	const teamModel = useMemo(() => {
		return (
			<AddTeamMembers
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
			{teamModel}
			<TopComponent
				permissionPreFix="Permissions"
				permissionPostFix="assignees"
				navigateLink={``}
				showAddButton={true}
				addButtonName="Add Team"
				handleSearch={handleSearch}
				showFilterButton={true}
				openFilter={handleFilter}
				openModal={openModal}
				filteredData={getFilterParams(pageParams, ["transaction_id"])}
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
