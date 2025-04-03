import { TurnLeftRounded } from "@mui/icons-material";
import {
	Box,
	Button,
	Chip,
	Stack,
	Tooltip,
	Typography,
	Zoom,
} from "@mui/material";
import ReadMore from "@src/components/ReadMoreText";
import TableComponent from "@src/components/TableComponenet";
import TopComponent from "@src/pages/settings/TopComponent";
import { getMaterialReceipt } from "@src/store/sidemenu/project_management/MaterialReceipt/material_receipt.action";
import {
	selectMaterialReceipt,
	setIsFilterOpen,
} from "@src/store/sidemenu/project_management/MaterialReceipt/material_receipt.slice";
import { useAppDispatch, useAppSelector } from "@src/store/store";
import React, { ChangeEvent, useEffect, useMemo } from "react";
import { LuEye, LuPencil, LuPlus } from "react-icons/lu";
import { Link, useParams } from "react-router-dom";
import Filters from "./filters";
import { getFilterParams } from "@src/helpers";
import moment from "moment";

const MaterialReceipt = () => {
	const { id, tab } = useParams();
	const dispatch = useAppDispatch();
	const {
		materialReceipt: { mtList, pageParams, mtCount, loading, isFilterOpen },
		workOrder: { selectedData: projectData },
		system: { userAccessList },
	} = useAppSelector((state) => selectMaterialReceipt(state));

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
			title: "MR Code",
			width: 100,
		},
		{
			title: "MI Code",
			width: 100,
		},
		{
			title: "From Warehouse",
			width: 100,
		},
		{
			title: "To Warehouse",
			width: 100,
		},
		// {
		// 	title: "Status",
		// 	width: 100,
		// },
		{
			title: "Created By",
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
		code?: JSX.Element,
		mrcode?: string,
		micode?: string,
		warehouse?: string,
		to_warehouse?: string,
		// status?: JSX.Element,
		created_by?: string,
		created_on?: string,
		action?: JSX.Element
	) {
		return {
			index,
			code,
			mrcode,
			micode,
			warehouse,
			to_warehouse,
			// status,
			created_by,
			created_on,
			action,
		};
	}

	const rows = useMemo(() => {
		return mtList?.map((row, key) => {
			const index =
				(pageParams.page - 1) * pageParams.page_size + (key + 1);

			// const description = (
			// 	<ReadMore
			// 		text={row.description ? row.description : ""}
			// 		maxLength={30}
			// 	/>
			// );
			const code = (
				<Tooltip
					TransitionComponent={Zoom}
					title="Click to view material receipt details">
					<Link
						to={`/work_order/view/${id}/${tab}/project/material_receipt/view/${row.id}`}>
						<Button
							color="primary"
							variant="contained"
							sx={{
								width: 150,
							}}>
							{row?.code}
						</Button>
					</Link>
				</Tooltip>
			);
			// const status = (
			// 	<>
			// 		<span>
			// 			{!row.mreceipt_status ? (
			// 				"None"
			// 			) : (
			// 				<Chip
			// 					label={
			// 						<Typography>
			// 							{row?.mreceipt_status_name}
			// 						</Typography>
			// 					}
			// 					color={(() => {
			// 						let tagColor:
			// 							| "default"
			// 							| "primary"
			// 							| "secondary"
			// 							| "success"
			// 							| "error"
			// 							| "info"
			// 							| "warning" = "default";
			// 						switch (row.mreceipt_status) {
			// 							case 1:
			// 								tagColor = "warning";
			// 								break;
			// 							case 2:
			// 								tagColor = "info"; // MUI does not have 'blue', using 'info' instead
			// 								break;
			// 							case 3:
			// 								tagColor = "error";
			// 								break;
			// 							case 4:
			// 								tagColor = "success";
			// 								break;
			// 							default:
			// 								tagColor = "default"; // Fallback color
			// 						}
			// 						return tagColor;
			// 					})()}
			// 				/>
			// 			)}
			// 		</span>
			// 	</>
			// );
			const actions = (
				<Box
					sx={{
						display: "flex",
						gap: 2,
						justifyContent: "center",
					}}>
					{userAccessList?.indexOf(
						"MaterialReceipt.change_materialreceipt"
					) !== -1 && (
						<Tooltip
							TransitionComponent={Zoom}
							title="Edit Material Receipt">
							<Link
								to={`/work_order/view/${id}/${tab}/project/material_receipt/${row.id}`}>
								<LuPencil
									style={{
										cursor: "pointer",
										color: "#fc6f03",
									}}
								/>
							</Link>
						</Tooltip>
					)}

					{/* <Link to={`/tenders/view/${id}/${tab}/material_received_notes/${row.id}/view`}>
						<LuEye
							style={{ cursor: "pointer", color: "#fc6f03" }}
						/>
					</Link> */}
				</Box>
			);

			return createData(
				index,
				code,
				row?.material_issue?.materialrequest?.code,
				row?.material_issue?.code,
				row?.to_warehouse?.name,
				row?.warehouse?.name,
				// status,
				row?.created_by?.fullname,
				row?.created_on
					? moment(row?.created_on).format("DD-MM-YYYY")
					: "",
				actions
			);
		});
	}, [mtList, createData]);

	const handleChangePage = (event: unknown, newPage: number) => {
		dispatch(
			getMaterialReceipt({
				...pageParams,
				project_id: projectData?.id,
				search: "",
				page: newPage + 1,
			})
		);
	};

	const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
		dispatch(
			getMaterialReceipt({
				...pageParams,
				project_id: projectData?.id,
				search: "",
				page: 1,
				page_size: parseInt(event.target.value),
			})
		);
	};
	const handleSort = (field: any) => {
		dispatch(
			getMaterialReceipt({
				...pageParams,
				ordering: field,
				page: 1,
			})
		);
	};
	const handleSearch = ({ search }: { search?: string | undefined }) => {
		dispatch(
			getMaterialReceipt({
				...pageParams,
				project_id: projectData?.id,
				search: search ? search : "",
				page: 1,
				page_size: 10,
			})
		);
	};

	const handleFilter = (open: boolean) => {
		dispatch(setIsFilterOpen(open));
	};

	useEffect(() => {
		if (projectData?.id) {
			dispatch(
				getMaterialReceipt({
					...pageParams,
					project_id: projectData?.id,
					search: "",
					page: 1,
					page_size: 10,
				})
			);
		}
	}, [projectData]);
	return (
		<Box>
			<TopComponent
				permissionPreFix="MaterialReceipt"
				permissionPostFix="materialreceipt"
				navigateLink={`/work_order/view/${id}/${tab}/project/material_receipt/0`}
				showAddButton={true}
				showFilterButton={true}
				openFilter={handleFilter}
				addButtonName="Add Material Receipt"
				handleSearch={handleSearch}
				filteredData={getFilterParams(pageParams, ["project_id"])}
			/>
			<Stack justifyContent="end" spacing={2}>
				<TableComponent
					count={mtCount}
					columns={columns}
					rows={rows ? rows : []}
					loading={loading}
					page={pageParams?.page ? pageParams?.page : 1}
					pageSize={
						pageParams?.page_size ? pageParams?.page_size : 10
					}
					handleSort={handleSort}
					handleChangePage={handleChangePage}
					handleChangeRowsPerPage={handleChangeRowsPerPage}
				/>
			</Stack>
			<Filters openFilter={isFilterOpen} handleFilter={handleFilter} />
		</Box>
	);
};

export default MaterialReceipt;
