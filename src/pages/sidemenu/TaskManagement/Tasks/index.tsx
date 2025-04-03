import React, { ChangeEvent, useEffect, useMemo } from "react";
import TableComponent from "@src/components/TableComponenet";
import {
	Box,
	Button,
	Card,
	CardContent,
	Chip,
	IconButton,
	Stack,
	Tooltip,
	Typography,
	Zoom,
} from "@mui/material";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { LuEye, LuPencil } from "react-icons/lu";
import TopComponent from "@src/pages/settings/TopComponent";
import ReadMore from "@src/components/ReadMoreText";
import { getFilterParams } from "@src/helpers";
import { useTaskSelector } from "@src/store/sidemenu/task_management/tasks/tasks.slice";
import { useTaskActions } from "@src/store/sidemenu/task_management/tasks/tasks.action";
import moment from "moment";
import AddTask from "./add.task";
import Filters from "./Filters";
import SelectComponent from "@src/components/form/SelectComponent";
import * as yup from "yup";
import { miniType } from "@src/store/mini/mini.Types";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import ViewTask from "./view.task";
import { PageBreadcrumb } from "@src/components";

const Tasks = () => {
	const { id, tab } = useParams();
	const location = useLocation();
	const {
		tasks: {
			list,
			loading,
			pageParams,
			count,
			selectedData,
			isFilterOpen,
			modal,
		},
		system: { userAccessList },
	} = useTaskSelector();

	const {
		reducer: {
			setIsFilterOpen,
			isModalOpen,
			setSelectedData,
			setViewModal,
		},
		extraReducer: { getTasks, editTaskData },
	} = useTaskActions();

	const temp_columns = [
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
			title: "Task Created On",
			width: 200,
			sortable: true,
			field: "created_on",
		},
		{
			title: "Task Subject",
			width: 150,
		},
		{
			title: "Start Date",
			width: 100,
		},
		{
			title: "Due Date",
			width: 100,
		},
		{
			title: "Priority",
			width: 100,
		},
		// {
		// 	title: "Group",
		// 	width: 100,
		// },
		{
			title: "Milestone",
			width: 100,
		},
		{
			title: "Description",
			width: 100,
		},
		{
			title: "Remarks",
			width: 100,
		},
		{
			title: "Created By",
			width: 100,
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

	const status_options: {
		id: string | number;
		name: string;
	}[] = [
		{
			name: "Pending",
			id: 1,
		},
		{
			name: "In Progress",
			id: 2,
		},
		{
			name: "Completed",
			id: 3,
		},
		{
			name: "Closed",
			id: 4,
		},
		{
			name: "Reopen",
			id: 5,
		},
	];

	const columns = temp_columns.filter((e) => {
		if (e.title === "Milestone" || e.title === "Group") {
			// Only include these columns if the user has the required access
			return id;
		}
		// Include all other columns by default
		return true;
	});

	function createData(props: {
		index: number;
		code: JSX.Element;
		subject: JSX.Element;
		created_on: string;
		startdate: string;
		duedate: string;
		priority: JSX.Element;
		// group?: JSX.Element;
		milestone?: JSX.Element;
		description: JSX.Element;
		remarks: JSX.Element;
		created_by: string;
		status: JSX.Element;
		actions: JSX.Element;
	}) {
		return props;
	}

	const { control, handleSubmit, reset, getValues, setValue } = useForm({});

	const rows = list?.map((row, key) => {
		const index = (pageParams.page - 1) * pageParams.page_size + (key + 1);

		setValue(`status_${key}`, {
			label: row.status_name,
			value: row.status,
		});

		const status_view = (
			<>
				<span>
					{!row.status ? (
						"None"
					) : (
						<Chip
							label={<Typography>{row.status_name}</Typography>}
							color={(() => {
								let tagColor:
									| "default"
									| "primary"
									| "secondary"
									| "success"
									| "error"
									| "info"
									| "warning" = "default";
								switch (row.status) {
									case 1:
										tagColor = "warning";
										break;
									case 2:
										tagColor = "warning"; // MUI does not have 'blue', using 'info' instead
										break;
									case 3:
										tagColor = "success";
										break;
									case 4:
										tagColor = "error";
										break;
									default:
										tagColor = "default"; // Fallback color
								}
								return tagColor;
							})()}
						/>
					)}
				</span>
			</>
		);

		const status =
			userAccessList?.indexOf("TaskManagement.change_task") !== -1 ? (
				<Stack width={150}>
					<SelectComponent
						name={`status_${key}`}
						label=""
						placeholder="Select Status"
						control={control}
						rules={{ required: true }}
						options={status_options}
						onChange={(value) => {
							const data = {
								project_id: id ? id : "",
								subject: row?.subject ? row?.subject : "",
								group_id: row?.group?.id ? row?.group?.id : "",
								users_ids:
									(row?.users?.map(
										(e) => e.id
									) as string[]) || [],
								priority: row?.priority,
								description: row?.description
									? row?.description
									: "",
								remarks: row?.remarks ? row?.remarks : "",
								milestone_id: row?.milestone?.id
									? row?.milestone?.id
									: "",
								startdate: row?.startdate
									? moment(row.startdate).toISOString()
									: "",
								duedate: row?.duedate
									? moment(row.duedate).toISOString()
									: "",
								type: id ? 1 : 2,
								status: value.value,
							};

							editTaskData({
								id: row?.id ? row?.id : "",
								data,
								hide: () => {},
								params: pageParams,
							});
						}}
					/>
				</Stack>
			) : (
				status_view
			);
		const priority = (
			<>
				<span>
					{!row.priority ? (
						"None"
					) : (
						<Chip
							label={<Typography>{row.priority_name}</Typography>}
							color={(() => {
								let tagColor:
									| "default"
									| "primary"
									| "secondary"
									| "success"
									| "error"
									| "info"
									| "warning" = "default";
								switch (row.priority) {
									case 1:
										tagColor = "warning";
										break;
									case 2:
										tagColor = "success"; // MUI does not have 'blue', using 'info' instead
										break;
									case 3:
										tagColor = "error";
										break;
									case 4:
										tagColor = "error";
										break;
									default:
										tagColor = "default"; // Fallback color
								}
								return tagColor;
							})()}
						/>
					)}
				</span>
			</>
		);

		const code = (
			<Tooltip
				TransitionComponent={Zoom}
				title="Click to view indent details">
				<Button
					color="primary"
					variant="contained"
					onClick={() => {
						setSelectedData(row);
						setViewModal(true);
					}}
					sx={{
						width: 150,
					}}>
					{row?.code}
				</Button>
			</Tooltip>
		);

		const created_on = row?.created_on
			? moment(row?.created_on).format("LLL")
			: "N/A";
		const startdate = row?.startdate
			? moment(row?.startdate).format("LLL")
			: "N/A";
		const duedate = row?.duedate
			? moment(row?.duedate).format("LLL")
			: "N/A";
		const created_by = row?.created_by?.fullname || "";

		// const group = <Typography>{row?.group?.name}</Typography>;
		const milestone = <Typography>{row?.milestone?.name}</Typography>;

		const description = (
			<ReadMore
				text={row?.description ? row.description : ""}
				maxLength={30}
			/>
		);
		const remarks = (
			<ReadMore text={row?.remarks ? row.remarks : ""} maxLength={30} />
		);

		const subject = (
			<ReadMore text={row?.subject ? row.subject : ""} maxLength={30} />
		);

		const actions = (
			<Box
				sx={{
					display: "flex",
					gap: 2,
					justifyContent: "center",
				}}>
				{userAccessList?.indexOf("TaskManagement.change_task") !==
					-1 && (
					<Tooltip TransitionComponent={Zoom} title="Edit Indent">
						<IconButton
							size="small"
							onClick={() => {
								setSelectedData(row);
								openModal(true);
							}}>
							<LuPencil
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

		return createData({
			index,
			code,
			created_on,
			subject,
			startdate,
			duedate,
			priority,
			// ...(id && {
			// 	group,
			// }),
			...(id && {
				milestone,
			}),
			description,
			remarks,
			created_by,
			status,
			actions,
		});
	});

	const handleSearch = ({ search }: { search?: string | undefined }) => {
		getTasks({
			...pageParams,
			search: search ? search : "",
			page: 1,
			page_size: 10,
		});
	};

	const handleChangePage = (event: unknown, newPage: number) => {
		getTasks({
			...pageParams,
			search: "",
			page: newPage + 1,
		});
	};
	const handleSort = (field: any) => {
		getTasks({
			...pageParams,
			ordering: field,
			page: 1,
		});
	};
	const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
		getTasks({
			...pageParams,
			search: "",
			page: 1,
			page_size: parseInt(event.target.value),
		});
	};

	const handleFilter = (open: boolean) => {
		setIsFilterOpen(open);
	};

	const openModal = (value: boolean) => {
		isModalOpen(value);
	};

	useEffect(() => {
		getTasks({
			...pageParams,
			project: id ? id : "",
			page: 1,
			page_size: 10,
			search: "",
		});
	}, [id]);

	return (
		<Box>
			{modal && <AddTask />}
			<ViewTask />
			{location.pathname == "/tasks" ? (
				<>
					<Box
						sx={{
							display: "grid",
							gap: 1,
							mt: 2,
						}}>
						<Card
							sx={{
								px: 2,
								pt: 2,
							}}>
							<PageBreadcrumb
								title="Tasks"
								subName="Task Management"
							/>
							<TopComponent
								permissionPreFix="TaskManagement"
								permissionPostFix="task"
								navigateLink={``}
								showAddButton={true}
								addButtonName="Add Task"
								handleSearch={handleSearch}
								showFilterButton={true}
								openFilter={handleFilter}
								openModal={openModal}
								filteredData={getFilterParams(pageParams, [
									"project",
								])}
							/>
						</Card>
						<Card>
							<CardContent>
								<TableComponent
									count={count}
									columns={columns}
									rows={rows}
									loading={loading}
									page={pageParams.page}
									pageSize={pageParams.page_size}
									handleChangePage={handleChangePage}
									handleChangeRowsPerPage={
										handleChangeRowsPerPage
									}
								/>
							</CardContent>
						</Card>
					</Box>
				</>
			) : (
				<>
					{/* <CardContent> */}
					<TopComponent
						permissionPreFix="TaskManagement"
						permissionPostFix="task"
						navigateLink={``}
						showAddButton={true}
						addButtonName="Add Task"
						handleSearch={handleSearch}
						showFilterButton={true}
						openFilter={handleFilter}
						openModal={openModal}
						filteredData={getFilterParams(pageParams, ["project"])}
					/>
					{/* </CardContent> */}
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
				</>
			)}

			<Filters openFilter={isFilterOpen} handleFilter={handleFilter} />
		</Box>
	);
};

export default Tasks;
