import { TurnLeftRounded } from "@mui/icons-material";
import { Box, Button, Stack, Tooltip, Zoom } from "@mui/material";
import ReadMore from "@src/components/ReadMoreText";
import TableComponent from "@src/components/TableComponenet";
import TopComponent from "@src/pages/settings/TopComponent";
import { getMaterialReceivedNotes } from "@src/store/sidemenu/project_management/MaterialReceivedNotes/mrn.action";
import {
	selectMaterialReceivedNotes,
	setIsFilterOpen,
} from "@src/store/sidemenu/project_management/MaterialReceivedNotes/mrn.slice";
import { useAppDispatch, useAppSelector } from "@src/store/store";
import React, { ChangeEvent, useEffect, useMemo } from "react";
import { LuEye, LuPencil, LuPlus } from "react-icons/lu";
import { Link, useParams } from "react-router-dom";
import Filters from "./filters";
import { getFilterParams } from "@src/helpers";
import moment from "moment";

const MaterialReceivedNotes = () => {
	const { id, tab } = useParams();
	const dispatch = useAppDispatch();
	const {
		materialReceivedNotes: {
			mrnList,
			pageParams,
			mrnCount,
			loading,
			isFilterOpen,
		},
		workOrder: { selectedData: projectData },
		system: { userAccessList },
	} = useAppSelector((state) => selectMaterialReceivedNotes(state));

	const columns = [
		{
			title: "S.No",
			width: 100,
		},
		{
			title: "MRN Code",
			width: 100,
			sortable: true,
			field: "code",
		},
		{
			title: "Purchase Order",
			width: 100,
		},
		{
			title: "Vendor",
			width: 100,
		},
		{
			title: "Location",
			width: 100,
		},
		{
			title: "Warehouse",
			width: 100,
		},
		{
			title: "Invoice Date",
			width: 100,
		},
		{
			title: "Invoice No",
			width: 100,
		},
		{
			title: "Invoice Amount",
			width: 100,
		},
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
		purchaseorder?: string | number,
		vendor?: string,
		location?: string,
		warehouse?: string,
		invoicedate?: string,
		invoice_no?: string | number | undefined,
		invoiceamount?: string | number | undefined,
		created_by?: string,
		created_on?: string,
		action?: JSX.Element
	) {
		return {
			index,
			code,
			purchaseorder,
			vendor,
			location,
			warehouse,
			invoicedate,
			invoice_no,
			invoiceamount,
			created_by,
			created_on,
			action,
		};
	}

	const rows = useMemo(() => {
		return mrnList?.map((row, key) => {
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
					title="Click to view mrn details">
					<Link
						to={`/work_order/view/${id}/${tab}/project/material_received_notes/view/${row.id}`}>
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

			const actions = (
				<Box
					sx={{
						display: "flex",
						gap: 2,
						justifyContent: "center",
					}}>
					{userAccessList?.indexOf(
						"MaterialReceivedNote.change_materialreceivednote"
					) !== -1 && (
						<Tooltip
							TransitionComponent={Zoom}
							title="Edit Material Received Notes">
							<Link
								to={`/work_order/view/${id}/${tab}/project/material_received_notes/${row.id}`}>
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
				row?.purchaseorder?.code,
				row?.vendor?.name,
				row?.location?.name,
				row?.warehouse?.name || "",
				moment(row?.invoice_date).format("DD-MM-YYYY"),
				row?.invoice_no,
				row?.invoice_amount,
				row?.created_by?.fullname,
				moment(row?.created_on).format("DD-MM-YYYY"),
				actions
			);
		});
	}, [mrnList, createData]);

	const handleChangePage = (event: unknown, newPage: number) => {
		dispatch(
			getMaterialReceivedNotes({
				...pageParams,
				project_id: projectData?.id,
				search: "",
				page: newPage + 1,
			})
		);
	};

	const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
		dispatch(
			getMaterialReceivedNotes({
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
			getMaterialReceivedNotes({
				...pageParams,
				ordering: field,
				page: 1,
			})
		);
	};
	const handleSearch = ({ search }: { search?: string | undefined }) => {
		dispatch(
			getMaterialReceivedNotes({
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
				getMaterialReceivedNotes({
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
				permissionPreFix="MaterialReceivedNote"
				permissionPostFix="materialreceivednote"
				navigateLink={`/work_order/view/${id}/${tab}/project/material_received_notes/0`}
				showAddButton={true}
				showFilterButton={true}
				openFilter={handleFilter}
				addButtonName="Add MRN"
				handleSearch={handleSearch}
				filteredData={getFilterParams(pageParams, ["project_id"])}
			/>
			<Stack justifyContent="end" spacing={2}>
				<TableComponent
					count={mrnCount}
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

export default MaterialReceivedNotes;
