import { Box, Button, Stack } from "@mui/material";
import ReadMore from "@src/components/ReadMoreText";
import TableComponent from "@src/components/TableComponenet";
import TopComponent from "@src/pages/settings/TopComponent";
import { getReverseAuctions } from "@src/store/sidemenu/tender_mangement/ReverseAuction/reverseAuction.action";
import {
	selectReverseAuctions,
	setIsEditModalOpen,
	setIsFilterOpen,
	setSelectedData,
} from "@src/store/sidemenu/tender_mangement/ReverseAuction/reverseAuction.slice";
import { useAppDispatch, useAppSelector } from "@src/store/store";
import React, { ChangeEvent, useEffect, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import Filters from "./Filters";
import { LuEye, LuPencil } from "react-icons/lu";
import ReverseAuctionEdit from "./reverseAuction.edit";
import { getFilterParams } from "@src/helpers";
import { pdf } from "@react-pdf/renderer";
import { ReverseAuctionContent } from "@src/pages/sidemenu/PrintPDF/bidReverseAuction";
import {
	companySelector,
	setCompanyData,
} from "@src/store/masters/Company/company.slice";
import { getCompanyById } from "@src/store/masters/Company/company.action";

const ReverseAuction = () => {
	const { id, tab } = useParams();
	const dispatch = useAppDispatch();
	const {
		reverseAuction: {
			reverseAuctionList,
			pageParams,
			reverseAuctionCount,
			isFilterOpen,
			openEditModal,
		},
		tenders: { selectedData: tenderSelectedData },
		system: { userAccessList },
	} = useAppSelector((state) => selectReverseAuctions(state));

	const {
		company: { companyData },
	} = useAppSelector((state) => {
		return {
			company: companySelector(state),
		};
	});

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
			title: "Landing Cost",
			width: 100,
		},
		{
			title: "Discounted Landing Cost",
			width: 100,
		},
		{
			title: "Landing Cost Margin (%)",
			width: 100,
		},
		{
			title: "Landing Cost Margin Amount",
			width: 100,
		},
		{
			title: "Landing Cost GST (%)",
			width: 100,
		},
		{
			title: "Landing Cost GST Amount",
			width: 100,
		},
		{
			title: "Landing Cost Total",
			width: 100,
		},
		{
			title: "Total",
			width: 100,
		},
		{
			title: "Created On",
			width: 100,
		},
		{
			title: "Action",
			width: 100,
		},
	];

	function createData(
		index: number,
		tender_item_master_name?: string | number,
		landing_cost?: string | number,
		discount_landing_cost?: string | number,
		landing_cost_margin?: string | number,
		landing_cost_margin_amount?: string | number,
		landing_cost_gst?: string | number,
		landing_cost_gst_amount?: string | number,
		landing_cost_total?: string | number,
		total?: string | number,
		totalcreated_on?: string | number,

		action?: JSX.Element
	) {
		return {
			index,
			tender_item_master_name,
			landing_cost,
			discount_landing_cost,
			landing_cost_margin,
			landing_cost_margin_amount,
			landing_cost_gst,
			landing_cost_gst_amount,
			landing_cost_total,
			total,
			totalcreated_on,
			action,
		};
	}

	const openModal = (value: boolean) => {
		dispatch(setIsEditModalOpen(value));
	};

	const destroyModal = () => {
		openModal(false);
		dispatch(setSelectedData({}));
	};

	const rows = useMemo(() => {
		return reverseAuctionList?.map((row, key) => {
			const index =
				(pageParams.page - 1) * pageParams.page_size + (key + 1);

			const actions = (
				<Box
					sx={{
						display: "flex",
						gap: 2,
						justifyContent: "center",
					}}>
					{userAccessList?.indexOf(
						"TenderManagement.change_tenderitemmaster"
					) !== -1 && (
						// <Link
						// 	to={`/tenders/view/${id}/${tab}/reverse_auction/${row.id}`}>
						<LuPencil
							style={{ cursor: "pointer", color: "#fc6f03" }}
							onClick={() => {
								dispatch(setSelectedData(row));
								openModal(true);
							}}
						/>
						// </Link>
					)}
					{/* <Link
						to={`/tenders/view/${id}/${tab}/reverse_auction/${row.id}/view`}>
						<LuEye
							style={{ cursor: "pointer", color: "#fc6f03" }}
						/>
					</Link> */}
				</Box>
			);
			return createData(
				index,
				row?.tender_item_master?.name,
				row?.landing_cost,
				row?.discount_landing_cost,
				row?.landing_cost_margin,
				row?.landing_cost_margin_amount,
				row?.landing_cost_gst,
				row?.landing_cost_gst_amount,
				row?.landing_cost_total,
				row?.total,
				row?.created_on,
				actions
			);
		});
	}, [reverseAuctionList, createData]);

	const handleChangePage = (event: unknown, newPage: number) => {
		dispatch(
			getReverseAuctions({
				...pageParams,
				tender_id: id ? id : "",
				search: "",
				page: newPage + 1,
			})
		);
	};

	const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
		dispatch(
			getReverseAuctions({
				...pageParams,
				tender_id: id ? id : "",
				search: "",
				page: 1,
				page_size: parseInt(event.target.value),
			})
		);
	};
	const handleSearch = ({ search }: { search?: string | undefined }) => {
		dispatch(
			getReverseAuctions({
				...pageParams,
				tender_id: id ? id : "",
				search: search ? search : "",
				page: 1,
				page_size: 10,
			})
		);
	};

	const handleFilter = (open: boolean) => {
		dispatch(setIsFilterOpen(open));
	};

	useEffect(() => {
		if (tenderSelectedData?.project?.id) {
			dispatch(
				getReverseAuctions({
					...pageParams,
					tender_id: id ? id : "",
					search: "",
					page: 1,
					page_size: 10,
				})
			);
		}
		dispatch(setCompanyData({}));
	}, [tenderSelectedData]);

	const onHandlePrintPreview = async (companyData: any) => {
		const blob = await pdf(
			<ReverseAuctionContent
				reverseAuctionData={reverseAuctionList}
				companyData={companyData}
			/>
		).toBlob();
		var blobURL = URL.createObjectURL(blob);

		var iframe = document.createElement("iframe"); //load content in an iframe to print later
		document.body.appendChild(iframe);

		iframe.style.display = "none";
		iframe.src = blobURL;
		iframe.onload = function () {
			setTimeout(function () {
				iframe.focus();
				iframe.contentWindow?.print();
			}, 1);
		};
	};
	async function onHandleDownload(companyData: any) {
		const blob = await pdf(
			<ReverseAuctionContent
				reverseAuctionData={reverseAuctionList}
				companyData={companyData}
			/>
		).toBlob();
		if (blob) {
			const url = URL.createObjectURL(blob);
			const link = document.createElement("a");
			link.href = url;
			link.download = "Tender_ReverseAuction.pdf";
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			URL.revokeObjectURL(url);
		} else {
			console.error("Failed to generate PDF");
		}
	}
	return (
		<Box>
			<TopComponent
				permissionPreFix="TenderManagement"
				permissionPostFix="reverseauction"
				navigateLink={`/tenders/view/${id}/${tab}/reverse_auction/0`}
				showAddButton={true}
				showFilterButton={true}
				openFilter={handleFilter}
				addButtonName="Add Reverse Auction"
				handleSearch={handleSearch}
				filteredData={getFilterParams(pageParams, ["tender_id"])}
				children={
					userAccessList?.indexOf("System.all_data") !== -1 && (
						<>
							<Box display="flex" justifyContent="flex-end">
								<Button
									variant="contained"
									size="large"
									onClick={() => {
										if (
											!companyData ||
											Object.keys(companyData).length ===
												0
										) {
											dispatch(
												getCompanyById({
													id: reverseAuctionList[0]
														?.tender?.company?.id,
												})
											).then(async (res: any) => {
												onHandlePrintPreview(
													res.payload?.response
												);
											});
										} else {
											onHandlePrintPreview(companyData);
										}
									}}>
									Print
								</Button>
							</Box>
							<Box display="flex" justifyContent="flex-end">
								<Button
									variant="contained"
									size="large"
									onClick={() => {
										if (
											!companyData ||
											Object.keys(companyData).length ===
												0
										) {
											dispatch(
												getCompanyById({
													id: reverseAuctionList[0]
														?.tender?.company?.id,
												})
											).then(async (res: any) => {
												onHandleDownload(
													res.payload?.response
												);
											});
										} else {
											onHandleDownload(companyData);
										}
									}}>
									Download PDF
								</Button>
							</Box>
						</>
					)
				}
			/>
			<Stack justifyContent="end" spacing={2}>
				<TableComponent
					count={reverseAuctionCount}
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
			</Stack>
			<Filters openFilter={isFilterOpen} handleFilter={handleFilter} />
			<ReverseAuctionEdit isOpen={openEditModal} hide={destroyModal} />
		</Box>
	);
};

export default ReverseAuction;
