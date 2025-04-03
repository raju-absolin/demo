import { Box, Grid2 as Grid, Button } from "@mui/material";
import TableComponent from "@src/components/TableComponenet";
import TopComponent from "@src/pages/settings/TopComponent";
import { selectWorkOrders } from "@src/store/sidemenu/project_management/work_order/work_order.slice";
import { project_items } from "@src/store/sidemenu/project_management/work_order/work_order.types";
import { useAppDispatch, useAppSelector } from "@src/store/store";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";

const TenderItems = () => {
	const { id } = useParams();
	const dispatch = useAppDispatch();
	const {
		system: { userAccessList },
		workOrder: { selectedData },
	} = useAppSelector((state) => selectWorkOrders(state));

	const [filterItems, setFilterItems] = useState<project_items[]>(
		selectedData?.project_items ? selectedData?.project_items : []
	);

	const [pageParams, setPageParams] = useState({
		page: 1,
		page_size: 10,
	});

	useEffect(() => {
		if (selectedData?.project_items) {
			setFilterItems(selectedData?.project_items);
		}
	}, [selectedData?.project_items]);

	const columns = [
		{
			title: "S.No",
			width: 100,
		},
		{
			title: "Bid Item",
			width: 100,
		},
		{
			title: "Quantity",
			width: 100,
		},
		{
			title: "Price",
			width: 100,
		},
		{
			title: "Discount",
			width: 100,
		},
		{
			title: "Price After Discount",
			width: 100,
		},
		{
			title: "Gross",
			width: 100,
		},
		{
			title: "Tax Type",
			width: 100,
		},
		{
			title: "Tax",
			width: 100,
		},
		// {
		// 	title: "Tax Amount",
		// 	width: 100,
		// },
		// {
		// 	title: "Total",
		// 	width: 100,
		// },
	];

	function createData(
		index: number,
		bid_item: string,
		quantity: number,
		price: number,
		discount: string,
		afterdiscount: number,
		gross: number,
		taxtype: string,
		tax: string,
		// taxamt: string,
		// total: string
	) {
		return {
			index,
			bid_item,
			quantity,
			price,
			discount,
			afterdiscount,
			gross,
			taxtype,
			tax,
			// taxamt,
			// total,
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

			const qty = row?.quantity ? +row?.quantity : 0;
			const tem_price = row?.price ? parseFloat(`${row?.price}`) : 0;

			const discount_percentage = row?.discount ? +row?.discount : 0;
			const discount_amount =
				(discount_percentage / 100) * Number(tem_price);

			const price_after_discount = discount_percentage
				? parseFloat(
						parseFloat(
							`${Number(tem_price) - discount_amount}`
						).toFixed(2)
					)
				: tem_price;
			let gross = parseFloat(
				parseFloat(
					`${qty * parseFloat(`${price_after_discount}`)}`
				).toFixed(2)
			);

			let totall: number = 0; // Ensure `total` is always a number
			const taxType: number = (row?.taxtype as number) || 0;
			const tax_amount = (() => {
				const taxRate: number = row?.tax?.tax || 0;

				const numericTaxRate =
					typeof taxRate === "string" ? parseFloat(taxRate) : taxRate;

				if (taxType == 2) {
					// Exclusive Tax
					if (row?.tax?.id) {
						const taxAmt = parseFloat(
							`${gross * (numericTaxRate / 100)}`
						);
						totall = gross + taxAmt;
						return taxAmt;
					}
					return 0; // No tax if tax ID is not provided
				} else if (taxType == 1) {
					// Inclusive Tax
					if (taxRate > 0) {
						const basicValue = gross / (1 + numericTaxRate / 100); // Calculate the net price excluding tax
						const taxAmt = basicValue * (numericTaxRate / 100); // Tax amount for inclusive tax
						totall = gross; // Total is the gross (inclusive of tax)
						return taxAmt;
					}
					return 0; // No tax if tax rate is 0
				}
				return 0; // Default to 0 if no valid tax type is provided
			})();

			const total = parseFloat(`${totall}`).toFixed(2);

			return createData(
				index,
				row?.tenderitemmaster?.label
					? row?.tenderitemmaster?.label
					: "",
				// row?.tender_item?.label ? row?.tender_item?.label : "",
				qty,
				tem_price,
				`${discount_percentage} %`,
				price_after_discount,
				gross,
				row?.taxtype_name || "",
				`${row?.tax?.label} (${(row?.tax && row?.tax?.value?.tax) || ""}%)`,
				// tax_amount.toFixed(2),
				// total
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
			const filter = selectedData?.project_items?.filter((e) =>
				e?.tenderitemmaster?.label
					?.toLowerCase()
					?.includes(search.toLowerCase())
					// ?.startsWith(search.toLowerCase())
			);
			setFilterItems(filter ? filter : []);
		} else {
			setFilterItems(
				selectedData?.project_items ? selectedData?.project_items : []
			);
		}
	};
	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const search = event.target.value;
		if (search && search != "") {
			const filter = selectedData?.project_items?.filter((e) =>
				e?.tenderitemmaster?.label
					?.toLowerCase()
					?.startsWith(search.toLowerCase())
			);
			setFilterItems(filter ? filter : []);
		} else {
			setFilterItems(
				selectedData?.project_items ? selectedData?.project_items : []
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
						permissionPreFix="ProjectManagement"
						permissionPostFix="projectitem"
						navigateLink={""}
						showAddButton={false}
						showFilterButton={false}
						addButtonName="Update Items"
						handleSearch={handleSearch}
						handleInputChange={handleInputChange}
						filteredData={pageParams}
					/>
					<TableComponent
						count={selectedData?.project_items?.length ?? 0}
						columns={columns}
						rows={rows ? rows : []}
						loading={false}
						page={pageParams.page ? pageParams.page : 1}
						pageSize={
							pageParams.page_size ? pageParams?.page_size : 10
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
