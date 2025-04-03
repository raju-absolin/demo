import { Box, Typography, Grid2 as Grid, Button } from "@mui/material";
import TableComponent from "@src/components/TableComponenet";
import TopComponent from "@src/pages/settings/TopComponent";
import { setPageParams } from "@src/store/sidemenu/tender_mangement/tenderitems/tenderItems.slice";
import { TenderItem } from "@src/store/sidemenu/tender_mangement/tenderitems/tenderItems.types";
import { selectTenders } from "@src/store/sidemenu/tender_mangement/tenders/tenders.slice";
import { useAppDispatch, useAppSelector } from "@src/store/store";
import React, { ChangeEvent, useEffect, useMemo, useState } from "react";
import { LuBook } from "react-icons/lu";
import { Link, useParams } from "react-router-dom";
import { } from "swiper/modules";

const TenderItems = () => {
	const { id } = useParams();
	const dispatch = useAppDispatch();
	const {
		system: { userAccessList },
		tenders: { selectedData },
	} = useAppSelector((state) => selectTenders(state));

	const [filterItems, setFilterItems] = useState<TenderItem[]>(
		selectedData?.tender_items ? selectedData?.tender_items : []
	);

	const [pageParams, setPageParams] = useState({
		page: 1,
		page_size: 10,
	});

	useEffect(() => {
		if (selectedData?.tender_items) {
			setFilterItems(selectedData?.tender_items);
		}
	}, [selectedData?.tender_items]);

	const columns = [
		{
			title: "S.No",
			width: 100,
		},
		{
			title: "Item",
			width: 100,
		},
		{
			title: "Quantity",
			width: 100,
		},
	];

	function createData(
		index: number,
		name: string,
		quantity: string | number
	) {
		return {
			index,
			name,
			quantity,
		};
	}

	// const rows = useMemo(() => {
	// 	return filterItems?.map((row, key) => {
	// 		const index =
	// 			(pageParams.page - 1) * pageParams.page_size + (key + 1);

	// 		return createData(
	// 			index,
	// 			row?.tenderitemmaster?.label,
	// 			row.quantity
	// 		);
	// 	});
	// }, [createData, filterItems, pageParams]);

	const rows = useMemo(() => {
		if (!filterItems) return [];

		// Calculate the starting and ending index for the current page
		const startIndex = (pageParams.page - 1) * pageParams.page_size;
		const endIndex = startIndex + pageParams.page_size;

		// Slice the filterItems array to get only the items for the current page
		const paginatedItems = filterItems.slice(startIndex, endIndex);

		return paginatedItems.map((row, key) => {
			const index = startIndex + (key + 1); // Adjust index according to the slice

			return createData(
				index,
				row?.tenderitemmaster?.label
					? row?.tenderitemmaster?.label
					: "",
				row.quantity ? row.quantity : ""
			);
		});
	}, [createData, filterItems, pageParams, selectedData]);

	const handleChangePage = (event: unknown, newPage: number) => {
		setPageParams({
			...pageParams,
			page: newPage + 1,
		});
	};

	const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
		setPageParams({
			...pageParams,
			page_size: parseInt(event.target.value),
		});
	};

	const handleSearch = ({ search }: { search?: string | undefined }) => {
		if (search && search != "") {
			const filter = selectedData?.tender_items?.filter((e) =>
				e.tenderitemmaster.label
					.toLowerCase()
					.startsWith(search.toLowerCase())
			);
			setFilterItems(filter ? filter : []);
		} else {
			setFilterItems(
				selectedData?.tender_items ? selectedData?.tender_items : []
			);
		}
	};
	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const search = event.target.value;
		if (search && search != "") {
			const filter = selectedData?.tender_items?.filter((e) =>
				e.tenderitemmaster.label
					.toLowerCase()
					.startsWith(search.toLowerCase())
			);
			setFilterItems(filter ? filter : []);
		} else {
			setFilterItems(
				selectedData?.tender_items ? selectedData?.tender_items : []
			);
		}
	};

	return (
		<Box>
			<Grid
				size={{
					xs: 12,
					lg: 6,
				}}
				mt={1}>
				<Box>
					<TopComponent
						permissionPreFix="TenderManagement"
						permissionPostFix="tenderitem"
						navigateLink={"/tenders/" + id}
						showAddButton={false}
						showFilterButton={false}
						addButtonName="Update Items"
						handleInputChange={handleInputChange}
						handleSearch={handleSearch}
						filteredData={pageParams}>
						{/* {userAccessList?.indexOf(
							`${"TenderManagement"}.change_${"tenderitem"}`
						) !== -1 && (
							<Link to={"/tenders/" + id}>
								<Button
									variant="outlined"
									color="primary"
									size="large">
									Edit Bid Items
								</Button>
							</Link>
						)} */}
					</TopComponent>
					<TableComponent
						count={selectedData.tender_items?.length ?? 0}
						columns={columns}
						rows={rows ? rows : []}
						loading={false}
						page={
							pageParams?.page
								? pageParams?.page
								: 1
						}
						pageSize={
							pageParams?.page_size
								? pageParams
									?.page_size
								: 10
						}
						handleChangePage={handleChangePage}
						handleChangeRowsPerPage={handleChangeRowsPerPage}
					/>
				</Box>
			</Grid>
		</Box>
	);
};

export default TenderItems;
