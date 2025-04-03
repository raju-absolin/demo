import { Box, Typography, Grid2 as Grid, Button } from "@mui/material";
import ReadMore from "@src/components/ReadMoreText";
import TableComponent from "@src/components/TableComponenet";
import TopComponent from "@src/pages/settings/TopComponent";
import { selectLeads } from "@src/store/sidemenu/strategic_management/leads/leads.slice";
import { LeadItem } from "@src/store/sidemenu/strategic_management/leads/leads.types";
import { useAppDispatch, useAppSelector } from "@src/store/store";
import React, { ChangeEvent, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";

const LeadItems = () => {
	const { id } = useParams();
	const dispatch = useAppDispatch();
	const {
		leads: { selectedData },
		system: { userAccessList },
	} = useAppSelector((state) => selectLeads(state));

	const [pageParams, setPageParams] = useState({
		page: 1,
		page_size: 10,
	});

	const [filterItems, setFilterItems] = useState<LeadItem[]>(
		selectedData?.lead_items ? selectedData?.lead_items : []
	);

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
		{
			title: "Unit",
			width: 100,
		},
		{
			title: "Vendor",
			width: 100,
		},
		{
			title: "Specifications",
			width: 100,
		},
	];

	function createData(
		index: number,
		name: string,
		quantity: string | number,
		unit: string,
		vendor: string,
		specifications: React.JSX.Element
	) {
		return {
			index,
			name,
			quantity,
			unit,
			vendor,
			specifications,
		};
	}

	const rows = useMemo(() => {
		if (!filterItems) return [];

		// Calculate the starting and ending index for the current page
		const startIndex = (pageParams.page - 1) * pageParams.page_size;
		const endIndex = startIndex + pageParams.page_size;

		// Slice the filterItems array to get only the items for the current page
		const paginatedItems = filterItems.slice(startIndex, endIndex);

		return paginatedItems.map((row, key) => {
			const index = startIndex + (key + 1); // Adjust index according to the slice
			const specifications = (
				<ReadMore
					text={
						row?.item_specifications ? row?.item_specifications : ""
					}
					maxLength={30}
				/>
			);
			const vendor = row?.vendors
				?.map((item: { name: string; id: string }) => {
					return item?.name;
				})
				.join(", ");
			return createData(
				index,
				row?.item?.label,
				row.quantity,
				row?.unit?.name || "",
				vendor,
				specifications
			);
		});
	}, [createData, filterItems, pageParams]);

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
			const filter = selectedData?.lead_items?.filter((e) =>
				e.item.label.toLowerCase().startsWith(search.toLowerCase())
			);
			setFilterItems(filter ? filter : []);
		} else {
			setFilterItems(
				selectedData?.lead_items ? selectedData?.lead_items : []
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
						permissionPreFix="LeadManagement"
						permissionPostFix="lead"
						navigateLink={"/tenders/" + id}
						showAddButton={false}
						showFilterButton={false}
						addButtonName="Update Items"
						handleSearch={handleSearch}
						filteredData={pageParams}>
						{userAccessList?.indexOf(
							`${"LeadManagement"}.change_${"leaditem"}`
						) !== -1 && (
							<Link to={"/leads/" + id}>
								<Button
									variant="outlined"
									color="primary"
									size="large">
									Edit Lead Items
								</Button>
							</Link>
						)}
					</TopComponent>
					<TableComponent
						count={selectedData?.lead_items?.length ?? 0}
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
				</Box>
			</Grid>
		</Box>
	);
};

export default LeadItems;
