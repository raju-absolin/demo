import React, { useEffect } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import {
	Box,
	Button,
	Divider,
	Drawer,
	FormLabel,
	Grid2 as Grid,
	Stack,
} from "@mui/material";
import { CustomDatepicker } from "@src/components";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { useAppDispatch, useAppSelector } from "@src/store/store";
import {
	selectCompareQuotations,
	setPageParams,
} from "@src/store/sidemenu/tender_mangement/CompareQuotation/cq.slice";
import moment from "moment";
import { getCompareQuotations } from "@src/store/sidemenu/tender_mangement/CompareQuotation/cq.action";
import SelectComponent from "@src/components/form/SelectComponent";
import { getMiniEnquiry } from "@src/store/mini/mini.Action";
import { clearMiniEnquiry } from "@src/store/mini/mini.Slice";
import { useParams } from "react-router-dom";

type Props = {
	openFilter: boolean;
	handleFilter: (open: boolean) => void;
};

type FilterFormData = {
	end_date?: string;
	start_date?: string;
};

const Filters = ({ openFilter, handleFilter }: Props) => {
	const dispatch = useAppDispatch();
	// const {
	// 	bidingItems: { pageParams },
	// 	mini
	// } = useAppSelector((state) => ({
	// 	bidingItems: bidingItemSelector(state),
	// }));

	const {
		compareQuotation: { loading, pageParams, selectedData },
		tenders: { selectedData: tenderSelectedData },
		mini: { miniEnquiry },
		system: { userAccessList },
	} = useAppSelector((state) => selectCompareQuotations(state));
	//Form Submission
	const filterSchema = yup.object({
		end_date: yup.string().optional().nullable(),
		start_date: yup.string().optional().nullable(),
		purchase_enquiry: yup.object().optional().nullable(),
		cqstatus: yup.object().optional().nullable(),
	});
	const { id, tenderId, tab } = useParams();
	const { control, handleSubmit, reset, getValues } = useForm({
		resolver: yupResolver(filterSchema),
	});

	const clearFilters = () => {
		const formData = {
			end_date: "",
			start_date: "",
			purchase_enquiry: null,
			cqstatus: null,
		};
		dispatch(
			getCompareQuotations({
				...pageParams,
				...formData,
			})
		);
		reset(formData);
	};

	const handleFilterSubmit = handleSubmit((payload) => {
		const formData: any = {
			end_date: payload?.end_date
				? moment(payload?.end_date).add(1, "days").format("YYYY-MM-DD")
				: "",
			start_date: payload?.start_date
				? moment(payload?.start_date).format("YYYY-MM-DD")
				: "",
			...payload,
		};
		if (Object.values(payload).length > 0) {
			dispatch(
				getCompareQuotations({
					...pageParams,
					project_id: tenderSelectedData?.project?.id
						? tenderSelectedData?.project?.id
						: "",
					page_size: 10,
					page: 1,
					...formData,
				})
			);
		}
		handleFilter(false);
	});

	const cqstatus = [
		{
			id: 1,
			name: "Pending",
		},
		{
			id: 2,
			name: "Open",
		},
		{
			id: 3,
			name: "Close",
		},
	];

	const formData = getValues();

	useEffect(() => {
		reset({
			end_date: pageParams.end_date,
			start_date: pageParams.start_date,
			purchase_enquiry: pageParams.purchase_enquiry
				? pageParams.purchase_enquiry
				: null,
			cqstatus: pageParams.cqstatus ? pageParams.cqstatus : null,
		});
	}, [pageParams]);

	return (
		<>
			<Drawer
				anchor={"right"}
				open={openFilter}
				onClose={() => handleFilter(false)}>
				<Box
					sx={{
						width: 450,
						p: 2,
					}}>
					<Box sx={{ display: "flex", flexDirection: "column" }}>
						<form onSubmit={handleFilterSubmit}>
							<Box>
								<Stack
									direction="row"
									spacing={2}
									justifyContent={"space-between"}
									useFlexGap={false}>
									<Stack width={"100%"}>
										<CustomDatepicker
											control={control}
											name="start_date"
											hideAddon
											dateFormat="DD-MM-YYYY"
											showTimeSelect={false}
											timeFormat="h:mm a"
											timeCaption="time"
											inputClass="form-input"
											label={"From Date"}
											tI={1}
										/>
									</Stack>
									<Stack width={"100%"}>
										<CustomDatepicker
											control={control}
											name="end_date"
											hideAddon
											dateFormat="DD-MM-YYYY"
											showTimeSelect={false}
											timeFormat="h:mm a"
											timeCaption="time"
											inputClass="form-input"
											label={"To Date"}
											tI={1}
										/>
									</Stack>
								</Stack>

								<Grid container spacing={1} mt={1}>
									<Grid size={{ xs: 12, md: 6 }}>
										<SelectComponent
											name="purchase_enquiry"
											label="Purchase Enquiry"
											control={control}
											rules={{ required: true }}
											options={miniEnquiry.list.map(
												(e: {
													id: string | number;
													code: string;
												}) => ({
													id: e.id,
													name: e.code,
												})
											)}
											placeholder="Select enquiry"
											loading={miniEnquiry.loading}
											selectParams={{
												page: miniEnquiry.miniParams
													.page,
												page_size:
													miniEnquiry.miniParams
														.page_size,
												search: miniEnquiry.miniParams
													.search,
												no_of_pages:
													miniEnquiry.miniParams
														.no_of_pages,
												project: selectedData?.project
													?.id
													? selectedData?.project?.id
													: "",
											}}
											hasMore={
												miniEnquiry.miniParams.page <
												miniEnquiry.miniParams
													.no_of_pages
											}
											fetchapi={getMiniEnquiry}
											clearData={clearMiniEnquiry}
										/>
									</Grid>
									<Grid size={{ xs: 12, md: 6 }}>
										<SelectComponent
											name="cqstatus"
											label="Status"
											control={control}
											rules={{ required: true }}
											options={cqstatus}
										/>
									</Grid>
								</Grid>
							</Box>
							<Box mt={2}>
								<Divider />
								<Stack
									direction="row"
									justifyContent="flex-end"
									spacing={2}
									mt={2}>
									<Button
										variant="outlined"
										onClick={() => {
											handleFilter(false);
											clearFilters();
										}}>
										Clear
									</Button>
									<Button variant="contained" type="submit">
										Apply
									</Button>
								</Stack>
							</Box>
						</form>
					</Box>
				</Box>
			</Drawer>
		</>
	);
};

export default Filters;
