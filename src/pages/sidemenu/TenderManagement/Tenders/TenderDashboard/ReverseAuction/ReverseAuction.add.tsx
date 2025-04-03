import styled from "@emotion/styled";
import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button, Card, CardContent, Typography } from "@mui/material";
import { FormInput } from "@src/components";
import GoBack from "@src/components/GoBack";
import React, { ChangeEvent, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import * as yup from "yup";
import { useAppDispatch, useAppSelector } from "@src/store/store";
import { LuSave } from "react-icons/lu";
import TableComponent from "@src/components/TableComponenet";
import {
	selectReverseAuctions,
	setReverseActionItems,
	setSelectedData,
	setTenderItems,
} from "@src/store/sidemenu/tender_mangement/ReverseAuction/reverseAuction.slice";
import {
	editReverseAuction,
	getReverseAuctionById,
	postReverseAuction,
	getTenderById,
	getReverseAuctions,
} from "@src/store/sidemenu/tender_mangement/ReverseAuction/reverseAuction.action";
import { updateSidenav } from "@src/store/customise/customise";
import Swal from "sweetalert2";

interface RowErrors {
	[key: string]: string;
}

const AddReverseAuction = () => {
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const { id, tenderId } = useParams();
	const {
		reverseAuction: {
			selectedData,
			pageParams,
			tenderItems,
			reverseAuctionList,
			reverse_auctionItems,
		},
		tenders: { selectedData: tenderSelectedData },
		system: { userAccessList },
	} = useAppSelector((state) => selectReverseAuctions(state));

	const [costExceeded, setCostExceeded] = useState(false);

	const [rowDiscCost, setRowDiscCost] = useState(
		reverse_auctionItems?.map(() => "") || []
	);
	const [rowErrors, setRowErrors] = useState<RowErrors>(
		reverse_auctionItems?.reduce((acc, _, index) => {
			acc[`l1_reference_${index}`] = ""; // Initialize errors for each item
			return acc;
		}, {} as RowErrors) || {} // Empty object fallback
	);

	function clearDataFn() {
		dispatch(setSelectedData({}));
	}

	useEffect(() => {
		dispatch(
			updateSidenav({
				showMobileMenu: false,
			})
		);
		clearDataFn();
	}, []);

	useEffect(() => {
		dispatch(
			getReverseAuctions({
				...pageParams,
				tender_id: tenderId ? tenderId : "",
				search: "",
				page: 1,
				page_size: 10,
			})
		);
	}, [tenderId]);

	useEffect(() => {
		if (id !== "0") {
			dispatch(getReverseAuctionById({ id: id ? id : "" }));
		}
		setCostExceeded(false);
	}, [id, tenderItems]);

	useEffect(() => {
		const reverseAuctionItems = tenderItems?.filter((val) => {
			return !reverseAuctionList?.some((list) => {
				return (
					list?.tender_item_master?.id === val?.tenderitemmaster?.id
				);
			});
		});
		dispatch(setReverseActionItems(reverseAuctionItems));
	}, [tenderItems, reverseAuctionList, dispatch]);

	const temp_columns = [
		{
			title: "S.No",
			width: 100,
		},
		{
			title: "Bid Item",
			width: 100,
		},
		{
			title: "Landing cost",
			width: 150,
		},
		{
			title: "Discounted Landing cost",
			width: 150,
		},
		{
			title: "Margin (%)",
			width: 100,
		},
		{
			title: "Margin amount",
			width: 100,
			readOnly: true,
		},
		{
			title: "GST (%)",
			width: 100,
		},
		{
			title: "GST amount",
			width: 100,
			readOnly: true,
		},
		{
			title: "Total",
			width: 100,
			readOnly: true,
		},
		{
			title: "L1 amount",
			width: 150,
		},
		{
			title: "Difference with L1",
			width: 150,
			readOnly: true,
		},
		{
			title: "Action",
			width: 100,
		},
	];

	const columns = temp_columns.filter((e) => {
		if (e.title === "L1 amount" || e.title === "Difference with L1") {
			// Only include these columns if the user has the required access
			return userAccessList?.indexOf("System.all_data") !== -1;
		}
		// Include all other columns by default
		return true;
	});

	function createData(props: {
		index: number;
		tender_master_item: string;
		landing_cost: JSX.Element;
		discounted_landing_cost: JSX.Element;
		landing_cost_margin: JSX.Element;
		landing_cost_margin_amount: number;
		landing_cost_margin_with_gst: JSX.Element;
		landing_cost_margin_with_gst_amount: number;
		total: number;
		l1_reference_price?: React.JSX.Element;
		difference?: string | number;
		actions: React.JSX.Element;
	}) {
		return props;
	}

	const handleChangePage = (event: unknown, newPage: number) => {
		// dispatch(
		// 	getTenders({
		// 		...pageParams,
		// 		search: "",
		// 		page: newPage + 1,
		// 	})
		// );
	};

	const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
		// dispatch(
		// 	getTenders({
		// 		...pageParams,
		// 		search: "",
		// 		page: 1,
		// 		page_size: parseInt(event.target.value),
		// 	})
		// );
	};

	// add item form
	const reverseAuctionSchema = yup.object().shape({
		// tenderItems: yup.array().of(
		// 	yup.object().shape({
		// 		landing_cost: yup.string().required("Landing cost is required"),
		// 		discount_landing_cost: yup
		// 			.string()
		// 			.required("Discount landing cost is required"),
		// 		landing_cost_margin: yup
		// 			.string()
		// 			.required("Landing cost margin is required"),
		// 		landing_cost_gst: yup
		// 			.string()
		// 			.required("Landing cost gst is required"),
		// 		l1_price: yup.string().required("l1 reference is required"),
		// 	})
		// ),
	});

	const {
		control,
		handleSubmit,
		reset: tenderRest,
		getValues,
		setValue,
		formState: { errors },
	} = useForm<any>({
		resolver: yupResolver(reverseAuctionSchema),
		// [id == "0" ? "defaultValues" : "values"]: {
		// 	tenderItems: tenderItems?.map((e) => ({
		// 		...e,
		// 	})),
		// },
	});

	const remove_record_after_save = (data: any) => {
		setValue(`landing_cost_${data.rowIndex}`, "");
		setValue(`discount_landing_cost_${data.rowIndex}`, "");
		setValue(`landing_cost_margin_${data.rowIndex}`, "");
		setValue(`landing_cost_gst_${data.rowIndex}`, "");
		setValue(`l1_reference_${data.rowIndex}`, "");

		const tenderitems = tenderItems?.filter((e) => {
			return e?.id !== data.id;
		});
		dispatch(setTenderItems(tenderitems));
	};

	const onSave = (payload: any) => {
		if (!costExceeded) {
			const data = {
				tender_id: tenderId,
				tender_item_master_id: payload?.tenderitemmaster?.id,
				tender_item_id: payload.id,
				landing_cost: payload[`landing_cost_${payload.rowIndex}`],
				discount_landing_cost:
					payload[`discount_landing_cost_${payload.rowIndex}`],
				landing_cost_margin:
					payload[`landing_cost_margin_${payload.rowIndex}`],
				landing_cost_gst:
					payload[`landing_cost_gst_${payload.rowIndex}`],
			};

			dispatch(
				postReverseAuction({
					data,
					params: {
						...pageParams,
						tender_id: tenderId ? tenderId : "",
					},
					tenderRest: () => {
						remove_record_after_save(payload);
					},
					navigate,
				})
			);
		}
	};
	const rows = useMemo(() => {
		return reverse_auctionItems?.map((row, key) => {
			const index =
				(pageParams.page - 1) * pageParams.page_size + (key + 1);

			const landing_cost = (
				<Box
					sx={{
						width: 200,
					}}>
					<form action="">
						<FormInput
							control={control}
							name={`landing_cost_${key}`}
							helperText=""
							label=""
							type="number"
							placeholder="Enter landing cost here..."
							onChange={(event) => {
								const tenderitems = reverse_auctionItems?.map(
									(e) => {
										if (e?.id == row?.id) {
											return {
												...e,
												landing_cost:
													event.target.value,
											};
										}
										return e;
									}
								);
								dispatch(setReverseActionItems(tenderitems));
							}}
						/>
					</form>
				</Box>
			);
			const discounted_landing_cost = (
				<Box
					sx={{
						width: 200,
					}}>
					<form action="">
						<FormInput
							control={control}
							name={`discount_landing_cost_${key}`}
							label=""
							type="number"
							placeholder="Enter discounted landing cost here..."
							onChange={(event) => {
								const disc_cost = event.target.value;
								const updatedCost = [...rowDiscCost];
								updatedCost[key] = disc_cost;
								setRowDiscCost(updatedCost);
								const updatedErrors: RowErrors = {
									...rowErrors,
								};
								if (
									Number(disc_cost) >
									Number(row?.landing_cost)
								) {
									updatedErrors[
										`discount_landing_cost_${key}`
									] =
										`Discounted Landing Cost exceeds maximum limit of ${Number(row?.landing_cost)}.`;
									setCostExceeded(true);
								} else {
									updatedErrors[
										`discount_landing_cost_${key}`
									] = "";
									setCostExceeded(false);
								}
								setRowErrors(updatedErrors);
								const updatedItems = reverse_auctionItems ?? [];
								const newItems = updatedItems.map(
									(item, idx) => {
										if (item?.id === row?.id) {
											return {
												...item,
												discount_landing_cost:
													disc_cost,
											};
										}
										return item;
									}
								);
								dispatch(setReverseActionItems(newItems));
							}}
						/>
						{rowErrors[`discount_landing_cost_${key}`] && (
							<Typography
								color="error"
								variant="body2"
								sx={{ mt: 0 }}>
								{rowErrors[`discount_landing_cost_${key}`]}
							</Typography>
						)}
					</form>
				</Box>
			);
			const landing_cost_margin = (
				<Box
					sx={{
						width: 200,
					}}>
					<form action="">
						<FormInput
							control={control}
							name={`landing_cost_margin_${key}`}
							helperText=""
							label=""
							type="number"
							placeholder="Enter landing cost margin here..."
							onChange={(event) => {
								const tenderitems = reverse_auctionItems?.map(
									(e) => {
										if (e?.id == row.id) {
											return {
												...e,
												landing_cost_margin:
													event.target.value,
											};
										}
										return e;
									}
								);
								dispatch(setReverseActionItems(tenderitems));
							}}
						/>
					</form>
				</Box>
			);

			const margin_percentage = row?.landing_cost_margin
				? parseFloat(row?.landing_cost_margin)
				: 0;

			const discount_amount = row?.discount_landing_cost
				? parseFloat(row?.discount_landing_cost)
				: 0;

			const margin_amount = parseFloat(
				(discount_amount * (margin_percentage / 100)).toFixed(2)
			);

			const landing_cost_margin_amount = discount_amount
				? discount_amount + margin_amount
				: 0;

			const landing_cost_margin_with_gst = (
				<Box
					sx={{
						width: 200,
					}}>
					<form action="">
						<FormInput
							control={control}
							name={`landing_cost_gst_${key}`}
							helperText=""
							label=""
							type="number"
							placeholder="Enter GST percentage..."
							onChange={(event) => {
								const tenderitems = reverse_auctionItems?.map(
									(e) => {
										if (e?.id == row.id) {
											return {
												...e,
												landing_cost_gst:
													event.target.value,
											};
										}
										return e;
									}
								);
								dispatch(setReverseActionItems(tenderitems));
							}}
						/>
					</form>
				</Box>
			);

			const landing_cost_gst = row?.landing_cost_gst
				? parseInt(row?.landing_cost_gst)
				: 0;
			const landing_cost_gst_amount = parseFloat(
				(landing_cost_margin_amount * (landing_cost_gst / 100)).toFixed(
					2
				)
			);

			const total = parseFloat(
				(landing_cost_gst_amount + landing_cost_margin_amount).toFixed(
					2
				)
			);

			const l1_price = row?.l1_price ? parseFloat(row?.l1_price) : 0;

			const L1_reference = (
				<Box
					sx={{
						width: 200,
					}}>
					<form action="">
						<FormInput
							control={control}
							name={`l1_reference_${key}`}
							helperText=""
							label=""
							type="number"
							placeholder="Enter l1 reference here..."
							onChange={(event) => {
								const l1ref = event.target.value;
								const updatedCost = [...rowDiscCost];
								updatedCost[key] = l1ref;
								setRowDiscCost(updatedCost);
								const updatedErrors: RowErrors = {
									...rowErrors,
								};
								let diff = total - parseInt(l1ref);
								if (total < parseInt(l1ref)) {
									updatedErrors[`l1_reference_${key}`] =
										"Total amount should not exceeds ";
									setCostExceeded(true);
								} else {
									updatedErrors[`l1_reference_${key}`] = "";
									setCostExceeded(false);
								}
								setRowErrors(updatedErrors);
								const updatedItems = reverse_auctionItems ?? [];
								const newItems = updatedItems.map(
									(item, idx) => {
										if (item?.id === row?.id) {
											return {
												...item,
												l1_price: l1ref,
											};
										}
										return item;
									}
								);
								dispatch(setReverseActionItems(newItems));
							}}
						/>
						{rowErrors[`l1_reference_${key}`] && (
							<Typography
								color="error"
								variant="body2"
								sx={{ mt: 0 }}>
								{rowErrors[`l1_reference_${key}`]}
							</Typography>
						)}
					</form>
				</Box>
			);

			const difference = (total - l1_price).toFixed(2);

			const actions = (
				<Box
					sx={{
						display: "flex",
						gap: 2,
					}}>
					{/* <LuDelete
						style={{ cursor: "pointer", color: "#fc6f03" }}
						// onClick={() => {
						// 	const fiteredItems =
						// 		selectedData.quotationitems?.map((e) => {
						// 			if (e?.item?.id == row?.item?.id) {
						// 				return {
						// 					...e,
						// 					dodelete: true,
						// 				};
						// 			}
						// 			return e;
						// 		});
						// 	dispatch(
						// 		setSelectedData({
						// 			...selectedData,
						// 			quotationitems: fiteredItems,
						// 		})
						// 	);
						// }}
					/> */}

					<Box textAlign={"right"} mt={2}>
						<Button
							color="success"
							type="submit"
							onClick={handleSubmit((payload) =>
								onSave({
									...payload,
									...row,
									rowIndex: key,
								})
							)}
							variant="contained"
							size="large">
							<LuSave size={18} style={{ marginRight: "6px" }} />{" "}
							Save
						</Button>
					</Box>
				</Box>
			);
			return createData({
				index,
				tender_master_item: row?.tenderitemmaster?.name
					? row?.tenderitemmaster?.name
					: "",
				landing_cost,
				discounted_landing_cost,
				landing_cost_margin,
				landing_cost_margin_amount,
				landing_cost_margin_with_gst,
				landing_cost_margin_with_gst_amount: landing_cost_gst_amount,
				total,
				...(userAccessList?.indexOf("System.all_data") !== -1 && {
					l1_reference_price: L1_reference,
					difference,
				}),
				actions,
			});
		});
	}, [selectedData, createData]);

	useEffect(() => {
		dispatch(
			getTenderById({
				id: tenderId ? tenderId : "",
			})
		);
	}, []);

	return (
		<GoBack
			is_goback={true}
			title={`${id && id != "0" ? "Update" : "Add"} Reverse Auction`}
			showSaveButton={false}
			loading={false}>
			<Box
				sx={{
					my: 1,
				}}>
				<Card
					sx={{
						p: 2,
					}}>
					{/* <AddItemForm
							control={control}
							handleSubmit={handleSubmit}
							reset={tenderRest}
							getValues={getValues}
						/> */}
					{/* <Divider
							sx={{
								mt: 2,
							}}
						/> */}
					<Box mt={0}>
						<TableComponent
							count={tenderItems?.length ?? 0}
							columns={columns}
							rows={rows ? rows : []}
							loading={false}
							page={1}
							pageSize={10}
							handleChangePage={handleChangePage}
							handleChangeRowsPerPage={handleChangeRowsPerPage}
							showPagination={false}
						/>
						{/* <Grid size={{ xs: 12 }}> */}
						{/* <Box textAlign={"right"} mt={2}>
								<Button
									color="success"
									type="submit"
									onClick={handleSubmit(onSave)}
									variant="contained"
									size="large">
									<LuSave
										size={18}
										style={{ marginRight: "6px" }}
									/>{" "}
									Save
								</Button>
							</Box> */}
						{/* </Grid> */}
					</Box>
				</Card>
			</Box>
		</GoBack>
	);
};

export default AddReverseAuction;
