import { TurnLeftRounded } from "@mui/icons-material";
import {
	Box,
	Button,
	Popover,
	Stack,
	Tooltip,
	Typography,
	Zoom,
} from "@mui/material";
import ReadMore from "@src/components/ReadMoreText";
import TableComponent from "@src/components/TableComponenet";
import TopComponent from "@src/pages/settings/TopComponent";
import {
	deletePQ,
	getPurchaseQuotations,
} from "@src/store/sidemenu/project_management/PurchaseQuotation/pq.action";
import {
	selectPurchaseQuotations,
	setIsFilterOpen,
} from "@src/store/sidemenu/project_management/PurchaseQuotation/pq.slice";
import { useAppDispatch, useAppSelector } from "@src/store/store";
import React, { ChangeEvent, useEffect, useMemo, useState } from "react";
import { LuEye, LuPencil, LuPlus, LuTrash2 } from "react-icons/lu";
import { Link, useParams } from "react-router-dom";
import Filters from "./Filters";
import { getFilterParams } from "@src/helpers";
import moment from "moment";
import { string } from "yup";

const PurchaseQuotation = () => {
	const { id, tab } = useParams();
	const dispatch = useAppDispatch();
	const {
		purchaseQuotation: {
			purchaseQuotationList,
			pageParams,
			purchaseQuotationCount,
			isFilterOpen,
			loading,
		},
		workOrder: { selectedData: projectData },
		system: { userAccessList },
	} = useAppSelector((state) => selectPurchaseQuotations(state));
	const [anchorEl, setAnchorEl] = useState(null);
	const deleteOpen = Boolean(anchorEl);
	const [currentId, setCurrentId] = useState(null);

	const columns = [
		{
			title: "S.No",
			width: 100,
		},
		{
			title: "Quotation Code",
			width: 100,
			sortable: true,
			field: "code",
		},
		{
			title: "Purchase Enquiry",
			width: 100,
		},
		{
			title: "Delivery Date",
			width: 100,
		},
		{
			title: "Vendor",
			width: 100,
		},
		{
			title: "Currency",
			width: 100,
		},
		{
			title: "Exchange Rate",
			width: 100,
		},
		{
			title: "Description",
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
		purchaseEnquiry?: string,
		deliverydate?: string,
		vendor?: string,
		currency?: string,
		exchangeRate?: string,
		description?: JSX.Element,
		created_by?: string,
		createdDate?: string,
		action?: JSX.Element
	) {
		return {
			index,
			code,
			purchaseEnquiry,
			deliverydate,
			vendor,
			currency,
			exchangeRate,
			description,
			created_by,
			createdDate,
			action,
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
		dispatch(
			deletePQ({
				id: deleteId,
				params: pageParams,
			})
		);
		dispatch(
			getPurchaseQuotations({
				...pageParams,
				search: "",
				page: 1,
				page_size: 10,
			})
		);
		handleDeleteClose();
	};
	const rows = useMemo(() => {
		return purchaseQuotationList?.map((row, key) => {
			const index =
				(pageParams.page - 1) * pageParams.page_size + (key + 1);

			const description = (
				<ReadMore
					text={row.description ? row.description : ""}
					maxLength={30}
				/>
			);
			const code = (
				<Tooltip
					TransitionComponent={Zoom}
					title="Click to view quotation details">
					<Link
						to={`/work_order/view/${id}/${tab}/project/purchase_quotation/view/${row.id}`}>
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
						justifyContent: "start",
					}}>
					{userAccessList?.indexOf("Quotation.change_quotation") !==
						-1 && (
						<Tooltip
							TransitionComponent={Zoom}
							title="Edit Quotation">
							<Link
								to={`/work_order/view/${id}/${tab}/project/purchase_quotation/${row.id}`}>
								<LuPencil
									style={{
										cursor: "pointer",
										color: "#fc6f03",
									}}
								/>
							</Link>
						</Tooltip>
					)}

					{userAccessList?.indexOf("Quotation.delete_quotation") !==
						-1 && (
						<>
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
						</>
					)}
				</Box>
			);

			return createData(
				index,
				code,
				row?.purchase_enquiry?.code,
				moment(row?.deliverydate).format("DD-MM-YYYY"),
				row?.vendor?.name,
				row?.currency?.name,
				row?.exchange_rate,
				description,
				row?.created_by?.fullname,
				row?.created_on,
				actions
			);
		});
	}, [purchaseQuotationList, createData]);

	const handleChangePage = (event: unknown, newPage: number) => {
		dispatch(
			getPurchaseQuotations({
				...pageParams,
				project_id: projectData?.id,
				search: "",
				page: newPage + 1,
			})
		);
	};

	const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
		dispatch(
			getPurchaseQuotations({
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
			getPurchaseQuotations({
				...pageParams,
				ordering: field,
				page: 1,
			})
		);
	};
	const handleSearch = ({ search }: { search?: string | undefined }) => {
		dispatch(
			getPurchaseQuotations({
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
				getPurchaseQuotations({
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
				permissionPreFix="Quotation"
				permissionPostFix="quotation"
				navigateLink={`/work_order/view/${id}/${tab}/project/purchase_quotation/0`}
				showAddButton={true}
				showFilterButton={true}
				openFilter={handleFilter}
				addButtonName="Add Quotation"
				handleSearch={handleSearch}
				filteredData={getFilterParams(pageParams, ["project_id"])}
			/>
			<Stack justifyContent="end" spacing={2}>
				<TableComponent
					count={purchaseQuotationCount}
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

export default PurchaseQuotation;
