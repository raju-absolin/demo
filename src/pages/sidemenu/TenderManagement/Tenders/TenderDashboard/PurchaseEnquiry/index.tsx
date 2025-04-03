import React, { ChangeEvent, useEffect } from "react";
import { PageBreadcrumb } from "@src/components";
import TableComponent from "@src/components/TableComponenet";
import {
	isModalOpen,
	selectEnquiry,
	setIsFilterOpen,
	setSelectedData,
} from "@src/store/sidemenu/tender_mangement/purchaseEnquiry/purchase_enquiry.slice";
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
import Filters from "./Filters";
import { getPurchaseEnquiry } from "@src/store/sidemenu/tender_mangement/purchaseEnquiry/purchase_enquiry.action";
import AddPurchaseEnquiry from "./PurchaseEnquiry.add";
import { useAppDispatch, useAppSelector } from "@src/store/store";
import { purchaseEnquirySelector } from "@src/store/sidemenu/tender_mangement/purchaseEnquiry/purchase_enquiry.slice";
import { getTenderById } from "@src/store/sidemenu/tender_mangement/tenders/tenders.action";
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
		tenders: { selectedData: tenderSelectedData },
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
		action?: JSX.Element
	) {
		return {
			index,
			code,
			no_of_items,
			required_date,
			description,
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
					to={`/tenders/view/${id}/${tab}/purchase_enquiry/view/${row.id}`}>
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
					justifyContent: "start",
				}}>
				{userAccessList?.indexOf(
					"PurchaseEnquiry.change_purchaseenquiry"
				) !== -1 && (
					<Tooltip TransitionComponent={Zoom} title="Edit Enquiry">
						<Link
							to={`/tenders/view/${id}/${tab}/purchase_enquiry/${row.id}`}>
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
		if (id) {
			dispatch(getTenderById({ id: id ? id : "" }));
		}
	}, [id]);

	useEffect(() => {
		if (tenderSelectedData.project && tenderSelectedData.project?.id) {
			dispatch(
				getPurchaseEnquiry({
					...pageParams,
					project_id: tenderSelectedData.project?.id,
					page: 1,
					page_size: 10,
					search: "",
				})
			);
		}
	}, [tenderSelectedData.project]);
	return (
		<Box>
			{/* <CardContent> */}
			<TopComponent
				permissionPreFix="PurchaseEnquiry"
				permissionPostFix="purchaseenquiry"
				navigateLink={`/tenders/view/${id}/${tab}/purchase_enquiry/0`}
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
				handleChangePage={handleChangePage}
				handleChangeRowsPerPage={handleChangeRowsPerPage}
			/>
			<Filters openFilter={isFilterOpen} handleFilter={handleFilter} />
		</Box>
	);
};

export default PurchaseEnquiry;
