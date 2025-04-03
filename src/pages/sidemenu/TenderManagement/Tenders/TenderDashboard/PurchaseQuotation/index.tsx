import { TurnLeftRounded } from "@mui/icons-material";
import { Box, Button, Stack, Tooltip, Zoom } from "@mui/material";
import ReadMore from "@src/components/ReadMoreText";
import TableComponent from "@src/components/TableComponenet";
import TopComponent from "@src/pages/settings/TopComponent";
import { getPurchaseQuotations } from "@src/store/sidemenu/tender_mangement/PurchaseQuotation/pq.action";
import {
	selectPurchaseQuotations,
	setIsFilterOpen,
} from "@src/store/sidemenu/tender_mangement/PurchaseQuotation/pq.slice";
import { useAppDispatch, useAppSelector } from "@src/store/store";
import React, { ChangeEvent, useEffect, useMemo } from "react";
import { LuEye, LuPencil, LuPlus } from "react-icons/lu";
import { Link, useParams } from "react-router-dom";
import Filters from "./Filters";
import { getFilterParams } from "@src/helpers";
import moment from "moment";

const PurchaseQuotation = () => {
	const { id, tab } = useParams();
	const dispatch = useAppDispatch();
	const {
		purchaseQuotation: {
			purchaseQuotationList,
			pageParams,
			purchaseQuotationCount,
			isFilterOpen,
		},
		tenders: { selectedData: tenderSelectedData },
		system: { userAccessList },
	} = useAppSelector((state) => selectPurchaseQuotations(state));

	const columns = [
		{
			title: "S.No",
			width: 100,
		},
		{
			title: "Quotation Code",
			width: 100,
		},
		{
			title: "No.of Items",
			width: 100,
		},
		{
			title: "Submited On",
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
			title: "Description",
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
		no_of_items?: string | number,
		created_on?: string,
		deliverydate?: string,
		vendor?: string,
		description?: JSX.Element,
		action?: JSX.Element
	) {
		return {
			index,
			code,
			no_of_items,
			created_on,
			deliverydate,
			vendor,
			description,
			action,
		};
	}

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
						to={`/tenders/view/${id}/${tab}/purchase_quotation/${row.id}/view`}>
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
					{userAccessList?.indexOf(
						"TenderManagement.change_tenderitemmaster"
					) !== -1 && (
						<Tooltip
							TransitionComponent={Zoom}
							title="Edit Quotation">
							<Link
								to={`/tenders/view/${id}/${tab}/purchase_quotation/${row.id}`}>
								<LuPencil
									style={{
										cursor: "pointer",
										color: "#fc6f03",
									}}
								/>
							</Link>
						</Tooltip>
					)}

					{/* <Link to={`/tenders/view/${id}/${tab}/purchase_quotation/${row.id}/view`}>
						<LuEye
							style={{ cursor: "pointer", color: "#fc6f03" }}
						/>
					</Link> */}
				</Box>
			);

			return createData(
				index,
				code,
				row?.quotationitems?.length,
				row?.created_on,
				moment(row?.deliverydate).format("DD-MM-YYYY"),
				row?.vendor?.name,
				description,
				actions
			);
		});
	}, [purchaseQuotationList, createData]);

	const handleChangePage = (event: unknown, newPage: number) => {
		dispatch(
			getPurchaseQuotations({
				...pageParams,
				project_id: tenderSelectedData?.project?.id,
				search: "",
				page: newPage + 1,
			})
		);
	};

	const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
		dispatch(
			getPurchaseQuotations({
				...pageParams,
				project_id: tenderSelectedData?.project?.id,
				search: "",
				page: 1,
				page_size: parseInt(event.target.value),
			})
		);
	};
	const handleSearch = ({ search }: { search?: string | undefined }) => {
		dispatch(
			getPurchaseQuotations({
				...pageParams,
				project_id: tenderSelectedData?.project?.id,
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
		if (tenderSelectedData?.project?.id) {
			dispatch(
				getPurchaseQuotations({
					...pageParams,
					project_id: tenderSelectedData?.project?.id,
					search: "",
					page: 1,
					page_size: 10,
				})
			);
		}
	}, [tenderSelectedData]);
	return (
		<Box>
			<TopComponent
				permissionPreFix="Quotation"
				permissionPostFix="quotation"
				navigateLink={`/tenders/view/${id}/${tab}/purchase_quotation/0`}
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
					loading={false}
					page={pageParams?.page ? pageParams?.page : 1}
					pageSize={
						pageParams?.page_size ? pageParams?.page_size : 10
					}
					handleChangePage={handleChangePage}
					handleChangeRowsPerPage={handleChangeRowsPerPage}
				/>
			</Stack>
			<Filters openFilter={isFilterOpen} handleFilter={handleFilter} />
		</Box>
	);
};

export default PurchaseQuotation;
