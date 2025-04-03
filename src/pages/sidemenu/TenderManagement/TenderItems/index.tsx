import React, { ChangeEvent, useEffect } from "react";
import { PageBreadcrumb } from "@src/components";
import TableComponent from "@src/components/TableComponenet";
import { getItems } from "@src/store/sidemenu/tender_mangement/bidingitems/biding_items.action";
import { useAppDispatch, useAppSelector } from "@src/store/store";
import {
	bidingItemSelector,
	isModalOpen,
	setIsFilterOpen,
	setSelectedData,
} from "@src/store/sidemenu/tender_mangement/bidingitems/biding_items.slice";
import { systemSelector } from "@src/store/system/system.slice";
import {
	Box,
	Button,
	Card,
	CardContent,
	CardHeader,
	Stack,
} from "@mui/material";
import { Link } from "react-router-dom";
import { LuEye, LuPencil } from "react-icons/lu";
import TopComponent from "@src/pages/settings/TopComponent";
import AddBidItem from "./TenderItem.add";
import Filters from "./Filters";
import { getFilterParams } from "@src/helpers";

const BidItems = () => {
	const dispatch = useAppDispatch();
	const {
		bidingItems: {
			itemsList,
			loading,
			pageParams,
			itemsCount,
			modal,
			selectedData,
			isFilterOpen,
		},
		system: { userAccessList },
	} = useAppSelector((state) => ({
		bidingItems: bidingItemSelector(state),
		system: systemSelector(state),
	}));
	const columns = [
		{
			title: "S.No",
			width: 100,
		},
		{
			title: "Name",
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
		actions: React.JSX.Element
	) {
		return {
			index,
			name,
			actions,
		};
	}

	const rows = itemsList.map((row, key) => {
		const index = (pageParams.page - 1) * pageParams.page_size + (key + 1);

		const status = <></>;

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
					<LuPencil
						style={{ cursor: "pointer", color: "#fc6f03" }}
						onClick={() => {
							dispatch(
								setSelectedData({
									...selectedData,
									name: row.name,
									id: row.id,
								})
							);
							openModal(true);
						}}
					/>
				)}

				{/* <Link to={`/pages/settings/user-details/` + row.id}>
					<LuEye style={{ cursor: "pointer", color: "#fc6f03" }} />
				</Link> */}
			</Box>
		);

		return createData(index, row.name, actions);
	});

	const handleSearch = ({ search }: { search?: string | undefined }) => {
		dispatch(
			getItems({
				...pageParams,
				search: search ? search : "",
				page: 1,
				page_size: 10,
			})
		);
	};

	const handleChangePage = (event: unknown, newPage: number) => {
		dispatch(
			getItems({
				...pageParams,
				search: "",
				page: newPage + 1,
			})
		);
	};

	const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
		dispatch(
			getItems({
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
		dispatch(
			getItems({
				...pageParams,
				page: 1,
				page_size: 10,
			})
		);
	}, []);
	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const search = event.target.value;
		dispatch(
			getItems({
				...pageParams,
				search: search ? search : "",
				page: 1,
				page_size: 10,
			})
		);
	};
	return (
		<Box>
			<Box
				sx={{
					display: "grid",
					gap: 1,
					mt: 2,
				}}>
				<Card
					sx={{
						px: 2,
						pt: 2,
					}}>
					<PageBreadcrumb
						title="Bid Items"
						subName="Bid Management"
					/>
					{/* <CardContent> */}
					<TopComponent
						permissionPreFix="TenderManagement"
						permissionPostFix="tenderitemmaster"
						navigateLink={""}
						showAddButton={true}
						addButtonName="Add Item"
						handleSearch={handleSearch}
						handleInputChange={handleInputChange}
						showFilterButton={true}
						openFilter={handleFilter}
						openModal={openModal}
						filteredData={getFilterParams(pageParams)}
					/>
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
					{/* </CardContent> */}
				</Card>
			</Box>
			{isFilterOpen && (
				<Filters
					openFilter={isFilterOpen}
					handleFilter={handleFilter}
				/>
			)}
			{modal && <AddBidItem isOpen={modal} hide={destroyModal} />}
		</Box>
	);
};

export default BidItems;
