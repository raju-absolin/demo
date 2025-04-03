import { Box, Card, CardContent } from "@mui/material";
import TopComponent from "@src/pages/settings/TopComponent";
import React, { ChangeEvent, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@src/store/store";
import {
	isModalOpen,
	selectTenderValue,
	setIsFilterOpen,
	setSelectedData,
	tenderValueSelector,
} from "@src/store/sidemenu/tender_mangement/TenderValue/tender_value.slice";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getTenderValue } from "@src/store/sidemenu/tender_mangement/TenderValue/tender_value.action";
import AddTenderValue from "./TenderValue.add";
import TableComponent from "@src/components/TableComponenet";
import { LuPencil } from "react-icons/lu";
import Filters from "./Filters";
import { getFilterParams } from "@src/helpers";

const TenderValue = () => {
	const { id, tab } = useParams();

	const {
		tenderValue: {
			itemsList,
			loading,
			pageParams,
			itemsCount,
			modal,
			selectedData,
			isFilterOpen,
		},
		system: { userAccessList },
	} = useAppSelector((state) => selectTenderValue(state));

	const columns = [
		{
			title: "S.No",
			width: 100,
		},
		{
			title: "Bid Value",
			width: 100,
		},
		{
			title: "Project Name",
			width: 100,
		},
		{
			title: "Bid Type",
			width: 100,
		},
		{
			title: "Company Name",
			width: 100,
		},

		{
			title: "Actions",
			width: 100,
		},
	];

	function createData(
		index: number,
		name: string,
		project: string,
		TenderType: string,
		companyName: string,
		actions: React.JSX.Element
	) {
		return {
			index,
			name,
			project,
			TenderType,
			companyName,
			actions,
		};
	}

	const rows = itemsList?.map((row: any, key) => {
		const index = (pageParams.page - 1) * pageParams.page_size + (key + 1);

		const status = <></>;

		const actions = (
			<Box
				sx={{
					display: "flex",
					gap: 2,
					justifyContent: "center",
				}}>
				<LuPencil
					style={{ cursor: "pointer", color: "#fc6f03" }}
					onClick={() => {
						dispatch(
							setSelectedData({
								...selectedData,
								name: row?.amount,
								id: row.id,
							})
						);
						openModal(true);
					}}
				/>

				{/* <Link to={`/pages/settings/user-details/` + row.id}>
				<LuEye style={{ cursor: "pointer", color: "#fc6f03" }} />
			</Link> */}
			</Box>
		);

		return createData(
			index,
			row?.amount ? row?.amount : "",
			row?.tender?.project?.name ? row?.tender?.project?.name : "",
			row?.tender?.tender_type_name ? row?.tender?.tender_type_name : "",
			row?.tender?.company?.name ? row?.tender?.company?.name : "",
			actions
		);
	});

	const dispatch = useAppDispatch();
	const handleFilter = (open: boolean) => {
		dispatch(setIsFilterOpen(open));
	};

	const handleSearch = ({ search }: { search?: string | undefined }) => {
		dispatch(
			getTenderValue({
				...pageParams,
				search: search ? search : "",
				page: 1,
				page_size: 10,
				tender: id,
			})
		);
	};

	const handleChangePage = (event: unknown, newPage: number) => {
		dispatch(
			getTenderValue({
				...pageParams,
				search: "",
				page: newPage + 1,
				tender: id,
			})
		);
	};

	const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
		dispatch(
			getTenderValue({
				...pageParams,
				search: "",
				page: 1,
				page_size: parseInt(event.target.value),
				tender: id,
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

	useEffect(() => {
		dispatch(
			getTenderValue({
				...pageParams,
				page: 1,
				page_size: 10,
				search: "",
				tender: id,
			})
		);
	}, []);

	return (
		<Box>
			<Card
				sx={{
					px: 2,
					pt: 2,
				}}>
				{/* <CardContent> */}
				<TopComponent
					permissionPreFix="TenderManagement"
					permissionPostFix="tenderitemmaster"
					navigateLink={""}
					showAddButton={itemsList.length ? false : true}
					addButtonName="Add Bid value"
					handleSearch={handleSearch}
					showFilterButton={true}
					openFilter={handleFilter}
					openModal={openModal}
					filteredData={getFilterParams(pageParams, ["tender"])}
				/>
				{/* </CardContent> */}
			</Card>

			<TableComponent
				count={itemsCount}
				columns={columns}
				rows={rows}
				loading={loading}
				page={pageParams.page}
				pageSize={pageParams.page_size}
				handleChangePage={handleChangePage}
				handleChangeRowsPerPage={handleChangeRowsPerPage}
				showPagination={false}
			/>

			<Filters openFilter={isFilterOpen} handleFilter={handleFilter} />
			<AddTenderValue isOpen={modal} hide={destroyModal} />
		</Box>
	);
};

export default TenderValue;
