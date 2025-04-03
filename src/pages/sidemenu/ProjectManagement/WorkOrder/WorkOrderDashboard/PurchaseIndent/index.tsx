import React, { ChangeEvent, useEffect } from "react";
import { PageBreadcrumb } from "@src/components";
import TableComponent from "@src/components/TableComponenet";
import {
	isModalOpen,
	selectIndent,
	setIsFilterOpen,
	setSelectedData,
} from "@src/store/sidemenu/project_management/purchaseIndent/purchase_indent.slice";
import { systemSelector } from "@src/store/system/system.slice";
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
// import Filters from "./Filters";
import { getPurchaseIndent } from "@src/store/sidemenu/project_management/purchaseIndent/purchase_indent.action";
// import AddPurchaseIndent from "./PurchaseIndent.add";
import { useAppDispatch, useAppSelector } from "@src/store/store";
import { getTenderById } from "@src/store/sidemenu/tender_mangement/tenders/tenders.action";
import ReadMore from "@src/components/ReadMoreText";
import { getFilterParams } from "@src/helpers";
import Filters from "./Filters";
import moment from "moment";

const PurchaseIndent = () => {
	const dispatch = useAppDispatch();
	const { id, tab } = useParams();
	const navigate = useNavigate();
	const {
		purchaseIndent: {
			list,
			loading,
			pageParams,
			count,
			selectedData,
			isFilterOpen,
		},
		system: { userAccessList },
	} = useAppSelector((state) => selectIndent(state));
	const columns = [
		{
			title: "S.No",
			width: 100,
		},
		{
			title: "PI Code",
			width: 100,
			sortable: true,
			field: "code",
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
		location?: string,
		warehouse?: string,
		description?: JSX.Element,
		created_by?: string,
		created_on?: string,
		action?: JSX.Element
	) {
		return {
			index,
			code,
			location,
			warehouse,
			description,
			created_by,
			created_on,
			action,
		};
	}

	const rows = list?.map((row, key) => {
		const index = (pageParams.page - 1) * pageParams.page_size + (key + 1);

		const status = <></>;

		const code = (
			<Tooltip
				TransitionComponent={Zoom}
				title="Click to view indent details">
				<Link
					to={`/work_order/view/${id}/${tab}/project/purchase_indent/view/${row.id}`}>
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
					justifyContent: "center",
				}}>
				{userAccessList?.indexOf(
					"PurchaseIndent.change_purchaseindent"
				) !== -1 && (
					<Tooltip TransitionComponent={Zoom} title="Edit Indent">
						<Link
							to={`/work_order/view/${id}/${tab}/project/purchase_indent/${row.id}`}>
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
			row?.location?.name,
			row?.warehouse?.name,
			description,
			row?.created_by?.fullname,
			moment(row?.created_on).format("DD-MM-YYYY"),
			actions
		);
	});

	const handleSearch = ({ search }: { search?: string | undefined }) => {
		dispatch(
			getPurchaseIndent({
				...pageParams,
				search: search ? search : "",
				page: 1,
				page_size: 10,
			})
		);
	};

	const handleChangePage = (event: unknown, newPage: number) => {
		dispatch(
			getPurchaseIndent({
				...pageParams,
				search: "",
				page: newPage + 1,
			})
		);
	};

	const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
		dispatch(
			getPurchaseIndent({
				...pageParams,
				search: "",
				page: 1,
				page_size: parseInt(event.target.value),
			})
		);
	};

	const handleSort = (field: any) => {
		dispatch(
			getPurchaseIndent({
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
			getPurchaseIndent({
				...pageParams,
				project: id ? id : "",
				page: 1,
				page_size: 10,
				search: "",
			})
		);
	}, []);
	return (
		<Box>
			{/* <CardContent> */}
			<TopComponent
				permissionPreFix="PurchaseIndent"
				permissionPostFix="purchaseindent"
				navigateLink={`/work_order/view/${id}/${tab}/project/purchase_indent/0`}
				showAddButton={true}
				addButtonName="Add Indent"
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

export default PurchaseIndent;
