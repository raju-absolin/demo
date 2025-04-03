import React, { ChangeEvent, useEffect } from "react";
import TableComponent from "@src/components/TableComponenet";
import {
	Box,
	Button,
	Chip,
	IconButton,
	Tooltip,
	Typography,
	Zoom,
} from "@mui/material";
import { Link, useNavigate, useParams } from "react-router-dom";
import { LuEye, LuPencil } from "react-icons/lu";
import TopComponent from "@src/pages/settings/TopComponent";
import { useAppSelector } from "@src/store/store";
import ReadMore from "@src/components/ReadMoreText";
import { getFilterParams } from "@src/helpers";
import { selectMileStones } from "@src/store/sidemenu/task_management/milestones/milestones.slice";
import { useMileStoneActions } from "@src/store/sidemenu/task_management/milestones/milestones.action";
import moment from "moment";
import AddMileStone from "./add.milestones";
import Filters from "./Filters";

const MileStones = () => {
	const { id, tab } = useParams();
	const {
		mileStones: {
			list,
			loading,
			pageParams,
			count,
			selectedData,
			isFilterOpen,
			modal,
		},
		system: { userAccessList },
	} = useAppSelector((state) => selectMileStones(state));

	const {
		reducer: { setIsFilterOpen, isModalOpen, setSelectedData },
		extraReducer: { getMileStones },
	} = useMileStoneActions();

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
			title: "MileStone Created On",
			width: 150,
			sortable: true,
			field: "created_on",
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
			title: "Description",
			width: 100,
		},
		{
			title: "Remarks",
			width: 100,
		},
		{
			title: "Actions",
			width: 100,
		},
	];
	function createData(props: {
		index: number;
		code: JSX.Element;
		name: JSX.Element;
		created_on: string;
		startdate: string;
		duedate: string;
		description: JSX.Element;
		remarks: JSX.Element;
		actions: JSX.Element;
	}) {
		return props;
	}

	const rows = list?.map((row, key) => {
		const index = (pageParams.page - 1) * pageParams.page_size + (key + 1);

		const name = <Typography>{row?.name}</Typography>;

		const code = (
			// <Tooltip
			// 	TransitionComponent={Zoom}
			// 	title="Click to view indent details">
			// 	<Link
			// 		to={`/work_order/view/${id}/${tab}/project/purchase_indent/view/${row.id}`}>
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

			<Typography>{row?.code}</Typography>
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

		const description = (
			<ReadMore
				text={row?.description ? row.description : ""}
				maxLength={30}
			/>
		);
		const remarks = (
			<ReadMore text={row?.remarks ? row.remarks : ""} maxLength={30} />
		);

		const actions = (
			<Box
				sx={{
					display: "flex",
					gap: 2,
					justifyContent: "center",
				}}>
				{userAccessList?.indexOf("TaskManagement.change_milestone") !==
					-1 && (
					<Tooltip TransitionComponent={Zoom} title="Edit Indent">
						<IconButton
							onClick={() => {
								setSelectedData(row);
								openModal(true);
							}}
							size="small">
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
			name,
			created_on,
			startdate,
			duedate,
			description,
			remarks,
			actions,
		});
	});

	const handleSearch = ({ search }: { search?: string | undefined }) => {
		getMileStones({
			...pageParams,
			search: search ? search : "",
			page: 1,
			page_size: 10,
		});
	};

	const handleChangePage = (event: unknown, newPage: number) => {
		getMileStones({
			...pageParams,
			search: "",
			page: newPage + 1,
		});
	};

	const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
		getMileStones({
			...pageParams,
			search: "",
			page: 1,
			page_size: parseInt(event.target.value),
		});
	};
	const handleSort = (field: any) => {
		getMileStones({
			...pageParams,
			ordering: field,
			page: 1,
		});
	};
	const handleFilter = (open: boolean) => {
		setIsFilterOpen(open);
	};

	const openModal = (value: boolean) => {
		isModalOpen(value);
	};

	useEffect(() => {
		getMileStones({
			...pageParams,
			project: id ? id : "",
			page: 1,
			page_size: 10,
			search: "",
		});
	}, []);

	return (
		<Box>
			<AddMileStone />
			{/* <CardContent> */}
			<TopComponent
				permissionPreFix="TaskManagement"
				permissionPostFix="milestone"
				navigateLink={``}
				showAddButton={true}
				addButtonName="Add MileStone"
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
			<Filters openFilter={isFilterOpen} handleFilter={handleFilter} />
		</Box>
	);
};

export default MileStones;
