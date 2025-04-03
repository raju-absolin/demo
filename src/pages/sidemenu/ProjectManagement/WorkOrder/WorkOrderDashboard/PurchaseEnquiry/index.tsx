import React, { ChangeEvent, useEffect } from "react";
import { PageBreadcrumb } from "@src/components";
import TableComponent from "@src/components/TableComponenet";
import {
	isModalOpen,
	selectEnquiry,
	setIsFilterOpen,
	setSelectedData,
} from "@src/store/sidemenu/project_management/purchaseEnquiry/purchase_enquiry.slice";
import {
	Box,
	Button,
	Card,
	CardContent,
	CardHeader,
	Stack,
	Tooltip,
	Zoom,
} from "@mui/material";
import { Link, useNavigate, useParams } from "react-router-dom";
import { LuEye, LuPencil } from "react-icons/lu";
import TopComponent from "@src/pages/settings/TopComponent";
import Filters from "./Filters";
import { getPurchaseEnquiry } from "@src/store/sidemenu/project_management/purchaseEnquiry/purchase_enquiry.action";
import AddPurchaseEnquiry from "./PurchaseEnquiry.add";
import { useAppDispatch, useAppSelector } from "@src/store/store";
import ReadMore from "@src/components/ReadMoreText";
import { getFilterParams } from "@src/helpers";
import moment from "moment";

const PurchaseEnquiry = () => {
	const dispatch = useAppDispatch();
	const { id, tab } = useParams();
	const navigate = useNavigate();
	const {
		purchaseEnquiry: {
			itemsList,
			loading,
			pageParams,
			itemsCount,
			modal,
			selectedData,
			isFilterOpen,
		},
		system: { userAccessList },
	} = useAppSelector((state) => selectEnquiry(state));

	const columns = [
		{
			title: "S.No",
			width: 100,
		},
		{
			title: "PE Code",
			width: 100,
			sortable: true,
			field: "code",
		},
		{
			title: "No.of Items",
			width: 100,
		},
		{
			title: "Required Date",
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
		no_of_items?: string | number,
		required_date?: string,
		description?: JSX.Element,
		created_by?: string,
		created_on?: string,
		action?: JSX.Element
	) {
		return {
			index,
			code,
			no_of_items,
			required_date,
			description,
			created_by,
			created_on,
			action,
		};
	}

	const rows = itemsList?.map((row, key) => {
		const index = (pageParams.page - 1) * pageParams.page_size + (key + 1);

		const status = <></>;

		const code = (
			<Tooltip
				TransitionComponent={Zoom}
				title="Click to view enquiry details">
				<Link
					to={`/work_order/view/${id}/${tab}/project/purchase_enquiry/view/${row.id}`}>
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
					gap: 2,
					justifyContent: "flex-start",
				}}>
				{userAccessList?.indexOf(
					"PurchaseEnquiry.change_purchaseenquiry"
				) !== -1 && (
					<Tooltip TransitionComponent={Zoom} title="Edit Enquiry">
						<Link
							to={`/work_order/view/${id}/${tab}/project/purchase_enquiry/${row.id}`}>
							<LuPencil
								style={{ cursor: "pointer", color: "#fc6f03" }}
							/>
						</Link>
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
			row?.pqitems?.length,
			moment(row?.required_date).format("DD-MM-YYYY"),
			description,
			row?.created_by?.fullname,
			moment(row?.created_on).format("DD-MM-YYYY"),
			actions
		);
	});

	const handleSearch = ({ search }: { search?: string | undefined }) => {
		dispatch(
			getPurchaseEnquiry({
				...pageParams,
				search: search ? search : "",
				page: 1,
				page_size: 10,
			})
		);
	};

	const handleChangePage = (event: unknown, newPage: number) => {
		dispatch(
			getPurchaseEnquiry({
				...pageParams,
				search: "",
				page: newPage + 1,
			})
		);
	};

	const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
		dispatch(
			getPurchaseEnquiry({
				...pageParams,
				search: "",
				page: 1,
				page_size: parseInt(event.target.value),
			})
		);
	};
	const handleSort = (field: any) => {
		dispatch(
			getPurchaseEnquiry({
				...pageParams,
				ordering: field,
				page: 1,
			})
		);
	};
	const destroyModal = () => {
		openModal(false);
		dispatch(
			setSelectedData({
				name: "",
			})
		);
	};

	const openModal = (value: boolean) => {
		dispatch(isModalOpen(value));
	};

	const handleFilter = (open: boolean) => {
		dispatch(setIsFilterOpen(open));
	};

	useEffect(() => {
		dispatch(
			getPurchaseEnquiry({
				...pageParams,
				project_id: id,
				page: 1,
				page_size: 10,
				search: "",
			})
		);
	}, [id]);
	return (
		<Box>
			{/* <CardContent> */}
			<TopComponent
				permissionPreFix="PurchaseEnquiry"
				permissionPostFix="purchaseenquiry"
				navigateLink={`/work_order/view/${id}/${tab}/project/purchase_enquiry/0`}
				showAddButton={true}
				addButtonName="Add Enquiry"
				handleSearch={handleSearch}
				showFilterButton={true}
				openFilter={handleFilter}
				openModal={openModal}
				filteredData={getFilterParams(pageParams, ["project_id"])}
			/>
			{/* </CardContent> */}
			<TableComponent
				count={itemsCount}
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

export default PurchaseEnquiry;
