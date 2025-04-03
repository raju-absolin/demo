import React, { ChangeEvent, useEffect } from "react";
import { PageBreadcrumb } from "@src/components";
import TableComponent from "@src/components/TableComponenet";
import {
	clearPurchaseQuotation,
	PESetSelectedData,
	selectCompareQuotations,
	setcheckedList,
	setIsFilterOpen,
	setPOByPE,
	setSelectedData,
	setSelectedVendor,
	setVendorRelatedItems,
} from "@src/store/sidemenu/project_management/CompareQuotation/cq.slice";
import {
	Box,
	Button,
	Card,
	CardContent,
	CardHeader,
	Chip,
	Stack,
	Typography,
} from "@mui/material";
import { Link, useNavigate, useParams } from "react-router-dom";
import { LuEye, LuPencil } from "react-icons/lu";
import TopComponent from "@src/pages/settings/TopComponent";
import Filters from "./Filters";
import { getCompareQuotations } from "@src/store/sidemenu/project_management/CompareQuotation/cq.action";
import { useAppDispatch, useAppSelector } from "@src/store/store";
import ReadMore from "@src/components/ReadMoreText";
import { getFilterParams } from "@src/helpers";
import moment from "moment";

const CompareQuotation = () => {
	const dispatch = useAppDispatch();
	const { id, tab } = useParams();
	const {
		compareQuotation: {
			compareQuotationList,
			loading,
			pageParams,
			compareQuotationCount,
			selectedData,
			isFilterOpen,
		},
		system: { userAccessList },
	} = useAppSelector((state) => selectCompareQuotations(state));

	const clearData = () => {
		dispatch(setSelectedData({}));
		dispatch(PESetSelectedData({}));
		dispatch(setcheckedList({}));
		dispatch(clearPurchaseQuotation({}));

		dispatch(setSelectedVendor(null));
		dispatch(setVendorRelatedItems([]));
		dispatch(setPOByPE([]));
	};

	useEffect(() => {
		clearData();
	}, []);

	const columns = [
		{
			title: "S.No",
			width: 100,
		},
		{
			title: "CQ Code",
			width: 100,
			sortable: true,
			field: "code",
		},
		{
			title: "PE Code",
			width: 100,
		},
		{
			title: "Date",
			width: 100,
			sortable: true,
			field: "created_on",
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
			title: "Action",
			width: 100,
		},
	];
	function createData(
		index: number,
		code?: JSX.Element,
		pecode?: string,
		required_date?: string,
		createdBy?: string,
		status?: JSX.Element,
		action?: JSX.Element
	) {
		return {
			index,
			code,
			pecode,
			required_date,
			createdBy,
			status,
			action,
		};
	}

	const rows = compareQuotationList?.map((row, key) => {
		const index = (pageParams.page - 1) * pageParams.page_size + (key + 1);

		const status = (
			<>
				<span>
					{!row.cqstatus ? (
						"None"
					) : (
						<Chip
							label={<Typography>{row.cqstatus_name}</Typography>}
							color={(() => {
								let tagColor:
									| "default"
									| "primary"
									| "secondary"
									| "success"
									| "error"
									| "info"
									| "warning" = "default";
								switch (row.cqstatus) {
									case 1:
										tagColor = "warning";
										break;
									case 2:
										tagColor = "success"; // MUI does not have 'blue', using 'info' instead
										break;
									case 3:
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
			<Link
				to={`/work_order/view/${id}/${tab}/project/compare_quotation/view/${row.id}`}>
				<Button
					color="primary"
					variant="contained"
					sx={{
						width: 150,
					}}>
					{row?.code}
				</Button>
			</Link>
		);

		const description = (
			<ReadMore
				text={row?.description ? row.description : ""}
				maxLength={30}
			/>
		);

		const actions = (
			<Box
				sx={{
					display: "flex",
					justifyContent: "center",
					gap: 2,
				}}>
				{row.cqstatus != 3 &&
					userAccessList?.indexOf(
						"CompareQuotation.change_comparequotation"
					) !== -1 && (
						<Link
							to={`/work_order/view/${id}/${tab}/project/compare_quotation/${row.id}`}>
							<LuPencil
								style={{ cursor: "pointer", color: "#fc6f03" }}
							/>
						</Link>
					)}

				{/* <LuEye
					style={{ cursor: "pointer", color: "#fc6f03" }}
					onClick={() =>
						navigate(
							`/tenders/view/${id}/${tab}/compare_quotation/view/${row.id}`
						)
					}
				/> */}
			</Box>
		);

		return createData(
			index,
			code,
			row?.purchase_enquiry?.code,
			row?.date ? moment(row?.date).format("DD-MM-YYYY") : "",
			row?.created_by?.fullname,
			status,
			actions
		);
	});

	const handleSearch = ({ search }: { search?: string | undefined }) => {
		dispatch(
			getCompareQuotations({
				...pageParams,
				project_id: id ? id : "",
				search: search ? search : "",
				page: 1,
				page_size: 10,
			})
		);
	};

	const handleChangePage = (event: unknown, newPage: number) => {
		dispatch(
			getCompareQuotations({
				...pageParams,
				project_id: id ? id : "",
				search: "",
				page: newPage + 1,
			})
		);
	};

	const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
		dispatch(
			getCompareQuotations({
				...pageParams,
				project_id: id ? id : "",
				search: "",
				page: 1,
				page_size: parseInt(event.target.value),
			})
		);
	};
	const handleSort = (field: any) => {
		dispatch(
			getCompareQuotations({
				...pageParams,
				ordering: field,
				page: 1,
			})
		);
	};
	const handleFilter = (open: boolean) => {
		dispatch(setIsFilterOpen(open));
	};

	useEffect(() => {
		if (id) {
			dispatch(
				getCompareQuotations({
					...pageParams,
					project_id: id,
					page: 1,
					page_size: 10,
					search: "",
				})
			);
		}
	}, [id]);

	return (
		<Box>
			<Box
				sx={{
					display: "grid",
					gap: 1,
				}}>
				<TopComponent
					permissionPreFix="CompareQuotation"
					permissionPostFix="comparequotation"
					navigateLink={`/work_order/view/${id}/${tab}/project/compare_quotation/0`}
					showAddButton={true}
					addButtonName="New Compare"
					handleSearch={handleSearch}
					showFilterButton={true}
					openFilter={handleFilter}
					filteredData={getFilterParams(pageParams, ["project_id"])}
				/>
				<TableComponent
					count={compareQuotationCount}
					columns={columns}
					rows={rows}
					loading={loading}
					page={pageParams.page}
					pageSize={pageParams.page_size}
					handleSort={handleSort}
					handleChangePage={handleChangePage}
					handleChangeRowsPerPage={handleChangeRowsPerPage}
				/>
			</Box>
			<Filters openFilter={isFilterOpen} handleFilter={handleFilter} />
			{/* <AddPurchaseEnquiry isOpen={modal} hide={destroyModal} /> */}
		</Box>
	);
};

export default CompareQuotation;
