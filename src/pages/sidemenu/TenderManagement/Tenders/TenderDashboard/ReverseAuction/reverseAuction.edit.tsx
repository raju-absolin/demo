import { yupResolver } from "@hookform/resolvers/yup";
import {
	Box,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Grid2 as Grid,
	IconButton,
} from "@mui/material";
import { FormInput } from "@src/components";
import {
	editReverseAuction,
	getReverseAuctions,
	postReverseAuction,
} from "@src/store/sidemenu/tender_mangement/ReverseAuction/reverseAuction.action";
import { selectReverseAuctions } from "@src/store/sidemenu/tender_mangement/ReverseAuction/reverseAuction.slice";
import { useAppDispatch, useAppSelector } from "@src/store/store";
import React from "react";
import { useForm } from "react-hook-form";
import { LuX } from "react-icons/lu";
import { useParams } from "react-router-dom";
import * as yup from "yup";

const ReverseAuctionEdit = ({
	isOpen,
	hide,
}: {
	isOpen: boolean;
	hide: () => void;
}) => {
	const { id } = useParams();
	const dispatch = useAppDispatch();
	const {
		reverseAuction: { selectedData, pageParams, tenderItems },
		tenders: { selectedData: tendersSelectedData },
	} = useAppSelector((state) => selectReverseAuctions(state));

	const reverseAuctionSchema = yup.object().shape({
		landing_cost: yup.string().required("Landing cost is required"),
		discount_landing_cost: yup
			.string()
			.required("Discount landing cost is required")
			.test(
				"is-less-than-landing-cost",
				"Discount landing cost should not be greater than landing cost",
				function (value) {
					const { landing_cost } = this.parent;
					return value <= landing_cost;
				}
			),
		landing_cost_margin: yup
			.string()
			.required("Landing cost margin is required"),
		landing_cost_gst: yup.string().required("Landing cost gst is required"),
		l1_price: yup.string().required("l1 reference is required"),
	});

	const {
		control,
		handleSubmit,
		reset: auctionReset,
		getValues,
		setValue,
	} = useForm<any>({
		resolver: yupResolver(reverseAuctionSchema),
		[selectedData?.id == "0" ? "defaultValues" : "values"]: {
			landing_cost: selectedData?.landing_cost,
			discount_landing_cost: selectedData?.discount_landing_cost,
			landing_cost_margin: selectedData?.landing_cost_margin,
			landing_cost_gst: selectedData?.landing_cost_gst,
			l1_price: selectedData?.l1_price,
		},
	});

	const onSave = (payload: any) => {
		const data = {
			tender_id: id,
			tender_item_master_id: selectedData?.tender_item_master?.id,
			tender_item_id: selectedData?.tender_item?.id,
			landing_cost: payload[`landing_cost`],
			discount_landing_cost: payload[`discount_landing_cost`],
			landing_cost_margin: payload[`landing_cost_margin`],
			landing_cost_gst: payload[`landing_cost_gst`],
			l1_price: payload[`l1_price`],
		};

		dispatch(
			editReverseAuction({
				id: selectedData?.id ? selectedData?.id : "",
				data,
				params: {
					...pageParams,
					tender_id: id ? id : "",
				},
				auctionReset,
				hide,
			})
		);
		dispatch(
			getReverseAuctions({
				...pageParams,
				tender_id: id ? id : "",
				search: "",
				page: 1,
				page_size: 10,
			})
		);
	};

	return (
		<Dialog open={isOpen} onClose={hide} maxWidth={"md"} fullWidth>
			<DialogTitle
				sx={{
					// bgcolor: "primary.main",
					// color: "white",
					p: 1,
					px: 2,
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
				}}
				variant="h4"
				id="alert-dialog-title">
				{"Edit reverse auction"}
				<IconButton onClick={hide}>
					<LuX color="white" />
				</IconButton>
			</DialogTitle>
			<DialogContent
				sx={{
					overflow: "none",
					// px: "24px",
					// pt: "12px !important",
					// pb: 0,
				}}
				dividers>
				<Box>
					<form action="">
						<Box>
							<Grid container spacing={2}>
								<Grid size={{ xs: 12, md: 6 }}>
									<FormInput
										control={control}
										name={`landing_cost`}
										helperText=""
										label="Landing Cost"
										type="number"
										placeholder="Enter landing cost here..."
									/>
								</Grid>
								<Grid size={{ xs: 12, md: 6 }}>
									<FormInput
										control={control}
										name={`discount_landing_cost`}
										helperText=""
										label="Discount Landing Cost"
										type="number"
										placeholder="Enter discount landing cost here..."
									/>
								</Grid>
								<Grid size={{ xs: 12, md: 6 }}>
									<FormInput
										control={control}
										name={`landing_cost_margin`}
										helperText=""
										label="Landing Cost Margin"
										type="number"
										placeholder="Enter landing cost margin here..."
									/>
								</Grid>
								<Grid size={{ xs: 12, md: 6 }}>
									<FormInput
										control={control}
										name={`landing_cost_gst`}
										helperText=""
										label="Landing Cost GST"
										type="number"
										placeholder="Enter landing cost gst here..."
									/>
								</Grid>
								<Grid size={{ xs: 12, md: 6 }}>
									<FormInput
										control={control}
										name={`l1_price`}
										helperText=""
										label="L1 Price"
										type="number"
										placeholder="Enter l1 price here..."
									/>
								</Grid>
							</Grid>
						</Box>
					</form>
				</Box>
			</DialogContent>
			<DialogActions sx={{ p: 2 }}>
				<Button onClick={hide} variant="outlined" color="secondary">
					Cancel
				</Button>
				<Button
					variant="contained"
					onClick={handleSubmit(onSave)}
					type="submit"
					color="primary"
					autoFocus>
					Save
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default ReverseAuctionEdit;
