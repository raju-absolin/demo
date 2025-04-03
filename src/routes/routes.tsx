import VerticalLayout from "@src/layouts/VerticalLayout";
import { LazyExoticComponent, ReactNode, Suspense, lazy } from "react";
import { Navigate, Outlet, type RouteProps } from "react-router-dom";

// Define the type for your routes
interface ChildRoute {
	path: string;
	element: RouteProps["element"];
}

export interface RoutesProps {
	path: RouteProps["path"];
	element: RouteProps["element"];
	exact?: boolean;
	children?: ChildRoute[];
}

const LoadComponent = ({
	component: Component,
}: {
	component: LazyExoticComponent<() => ReactNode>;
}) => {
	return (
		<Suspense fallback={null}>
			<Component />
		</Suspense>
	);
};

const Reports: RoutesProps[] = [
	{
		path: "/reports",
		element: (
			<LoadComponent
				component={lazy(() => import("@src/pages/reports"))}
			/>
		),
		exact: true,
	},
	{
		path: "/reports/tenders",
		element: (
			<LoadComponent
				component={lazy(() => import("@src/pages/reports/Tenders"))}
			/>
		),
		exact: true,
	},
	{
		path: "/reports/compare_quotation",
		element: (
			<LoadComponent
				component={lazy(
					() => import("@src/pages/reports/CompareQuotation")
				)}
			/>
		),
		exact: true,
	},
	{
		path: "/reports/tender_pending_document",
		element: (
			<LoadComponent
				component={lazy(
					() =>
						import("@src/pages/reports/TenderPendingDocument/index")
				)}
			/>
		),
		exact: true,
	},
	{
		path: "/reports/tender_count_against_user",
		element: (
			<LoadComponent
				component={lazy(
					() =>
						import(
							"@src/pages/reports/TenderCountAgainstUser/index"
						)
				)}
			/>
		),
		exact: true,
	},
	{
		path: "/reports/Lead",
		element: (
			<LoadComponent
				component={lazy(() => import("@src/pages/reports/Lead/index"))}
			/>
		),
		exact: true,
	},
	{
		path: "/reports/budget_quotation",
		element: (
			<LoadComponent
				component={lazy(
					() => import("@src/pages/reports/BudgetaryQuotation/index")
				)}
			/>
		),
		exact: true,
	},
	{
		path: "/reports/material_consumption",
		element: (
			<LoadComponent
				component={lazy(
					() => import("@src/pages/reports/MaterialComsumption/index")
				)}
			/>
		),
		exact: true,
	},
	{
		path: "/reports/mrn",
		element: (
			<LoadComponent
				component={lazy(
					() => import("@src/pages/reports/MaterialReceivedNotes")
				)}
			/>
		),
		exact: true,
	},
	{
		path: "/reports/mrn_return",
		element: (
			<LoadComponent
				component={lazy(
					() => import("@src/pages/reports/MRNReturn/index")
				)}
			/>
		),
		exact: true,
	},
	{
		path: "/reports/material_request",
		element: (
			<LoadComponent
				component={lazy(
					() => import("@src/pages/reports/MaterialRequest")
				)}
			/>
		),
		exact: true,
	},
	{
		path: "/reports/material_issue",
		element: (
			<LoadComponent
				component={lazy(
					() => import("@src/pages/reports/MaterialIssue")
				)}
			/>
		),
		exact: true,
	},
	{
		path: "/reports/material_receipt",
		element: (
			<LoadComponent
				component={lazy(
					() => import("@src/pages/reports/MaterialReceipt")
				)}
			/>
		),
		exact: true,
	},
	{
		path: "/reports/isssue_to_production",
		element: (
			<LoadComponent
				component={lazy(
					() => import("@src/pages/reports/IssueToProduction/index")
				)}
			/>
		),
		exact: true,
	},
	{
		path: "/reports/stock_out",
		element: (
			<LoadComponent
				component={lazy(
					() => import("@src/pages/reports/StockTransferOut")
				)}
			/>
		),
		exact: true,
	},
	{
		path: "/reports/production_receipt",
		element: (
			<LoadComponent
				component={lazy(
					() =>
						import("@src/pages/reports/ReportFromProduction/index")
				)}
			/>
		),
		exact: true,
	},
	{
		path: "/reports/stock_in",
		element: (
			<LoadComponent
				component={lazy(
					() => import("@src/pages/reports/StockTransferIn")
				)}
			/>
		),
		exact: true,
	},
	{
		path: "/reports/delivery_challan",
		element: (
			<LoadComponent
				component={lazy(
					() => import("@src/pages/reports/DeliveryChallan")
				)}
			/>
		),
		exact: true,
	},
	{
		path: "/reports/delivery_note_return",
		element: (
			<LoadComponent
				component={lazy(
					() => import("@src/pages/reports/DeliveryReturnNotes")
				)}
			/>
		),
		exact: true,
	},
	{
		path: "/reports/purchase_order",
		element: (
			<LoadComponent
				component={lazy(
					() => import("@src/pages/reports/PurchaseOrder")
				)}
			/>
		),
		exact: true,
	},
	{
		path: "/reports/payment_request",
		element: (
			<LoadComponent
				component={lazy(
					() => import("@src/pages/reports/PaymentRequest")
				)}
			/>
		),
		exact: true,
	},
	{
		path: "/reports/expenditure_sheet",
		element: (
			<LoadComponent
				component={lazy(
					() => import("@src/pages/reports/ExpenditureSheet")
				)}
			/>
		),
		exact: true,
	},
];

const appsRoutes: RoutesProps[] = [
	{
		path: "/tender/tender_items",
		// path: "/tender_items",
		element: (
			<LoadComponent
				component={lazy(
					() =>
						import(
							"@src/pages/sidemenu/TenderManagement/TenderItems"
						)
				)}
			/>
		),
		exact: true,
	},

	{
		path: "/tenders",
		element: (
			<LoadComponent
				component={lazy(
					() => import("@src/pages/sidemenu/TenderManagement/Tenders")
				)}
			/>
		),
		exact: true,
	},
	{
		path: "/tenders/:id",
		element: (
			<LoadComponent
				component={lazy(
					() =>
						import(
							"@src/pages/sidemenu/TenderManagement/Tenders/new_Tender.add"
						)
				)}
			/>
		),
		exact: true,
	},
	{
		path: "/tenders/view/:id",
		element: (
			<LoadComponent
				component={lazy(
					() =>
						import(
							"@src/pages/sidemenu/TenderManagement/Tenders/TenderDashboard"
						)
				)}
			/>
		),
		children: [
			{
				path: "/tenders/view/:id/:tab",
				element: (
					<LoadComponent
						component={lazy(
							() =>
								import(
									"@src/pages/sidemenu/TenderManagement/Tenders/TenderDashboard/OverView"
								)
						)}
					/>
				),
			},

			{
				path: "/tenders/view/:id/:tab/tender_items",
				element: (
					<LoadComponent
						component={lazy(
							() =>
								import(
									"@src/pages/sidemenu/TenderManagement/Tenders/TenderDashboard/TenderItems"
								)
						)}
					/>
				),
			},
			{
				path: "/tenders/view/:id/:tab/comments",
				element: (
					<LoadComponent
						component={lazy(
							() =>
								import(
									"@src/pages/sidemenu/TenderManagement/Tenders/TenderDashboard/Comment"
								)
						)}
					/>
				),
			},
			{
				path: "/tenders/view/:id/:tab/purchase_enquiry",
				element: (
					<LoadComponent
						component={lazy(
							() =>
								import(
									"@src/pages/sidemenu/TenderManagement/Tenders/TenderDashboard/PurchaseEnquiry"
								)
						)}
					/>
				),
			},
			{
				path: "/tenders/view/:id/:tab/purchase_quotation",
				element: (
					<LoadComponent
						component={lazy(
							() =>
								import(
									"@src/pages/sidemenu/TenderManagement/Tenders/TenderDashboard/PurchaseQuotation"
								)
						)}
					/>
				),
			},
			{
				path: "/tenders/view/:id/:tab/compare_quotation",
				element: (
					<LoadComponent
						component={lazy(
							() =>
								import(
									"@src/pages/sidemenu/TenderManagement/Tenders/TenderDashboard/CompareQuotation"
								)
						)}
					/>
				),
			},
			{
				path: "/tenders/view/:id/:tab/case_sheet",
				element: (
					<LoadComponent
						component={lazy(
							() =>
								import(
									"@src/pages/sidemenu/TenderManagement/Tenders/TenderDashboard/CaseSheet"
								)
						)}
					/>
				),
			},
			{
				path: "/tenders/view/:id/:tab/reverse_auction",
				element: (
					<LoadComponent
						component={lazy(
							() =>
								import(
									"@src/pages/sidemenu/TenderManagement/Tenders/TenderDashboard/ReverseAuction"
								)
						)}
					/>
				),
			},
			{
				path: "/tenders/view/:id/:tab/documents",
				element: (
					<LoadComponent
						component={lazy(
							() =>
								import(
									"@src/pages/sidemenu/TenderManagement/Tenders/TenderDashboard/Document"
								)
						)}
					/>
				),
			},
			{
				path: "/tenders/view/:id/:tab/tender_value",
				element: (
					<LoadComponent
						component={lazy(
							() =>
								import(
									"@src/pages/sidemenu/TenderManagement/Tenders/TenderDashboard/TenderValue"
								)
						)}
					/>
				),
			},
		],
		exact: true,
	},
	{
		path: "/tenders/view/:tenderId/:tab/purchase_enquiry/:id",
		element: (
			<LoadComponent
				component={lazy(
					() =>
						import(
							"@src/pages/sidemenu/TenderManagement/Tenders/TenderDashboard/PurchaseEnquiry/PurchaseEnquiry.add"
						)
				)}
			/>
		),
		exact: true,
	},

	{
		path: "/tenders/view/:tenderId/:tab/documents/:documentId",
		element: (
			<LoadComponent
				component={lazy(
					() =>
						import(
							"@src/pages/sidemenu/TenderManagement/Tenders/TenderDashboard/Document/document.Edit"
						)
				)}
			/>
		),
		exact: true,
	},

	{
		path: "/tenders/view/:tenderId/:tab/case_sheet/:caseSheetId",
		element: (
			<LoadComponent
				component={lazy(
					() =>
						import(
							"@src/pages/sidemenu/TenderManagement/Tenders/TenderDashboard/CaseSheet/caseSheet.Edit"
						)
				)}
			/>
		),
		exact: true,
	},

	{
		path: "/tenders/view/:tenderId/:tab/purchase_enquiry/view/:id",
		element: (
			<LoadComponent
				component={lazy(
					() =>
						import(
							"@src/pages/sidemenu/TenderManagement/Tenders/TenderDashboard/PurchaseEnquiry/PurchaseEnquiry.view"
						)
				)}
			/>
		),
		exact: true,
	},
	{
		path: "/tenders/view/:tenderId/:tab/purchase_quotation/:id",
		element: (
			<LoadComponent
				component={lazy(
					() =>
						import(
							"@src/pages/sidemenu/TenderManagement/Tenders/TenderDashboard/PurchaseQuotation/Pq.add"
						)
				)}
			/>
		),
		exact: true,
	},
	{
		path: "/tenders/view/:tenderId/:tab/purchase_quotation/:id/view",
		element: (
			<LoadComponent
				component={lazy(
					() =>
						import(
							"@src/pages/sidemenu/TenderManagement/Tenders/TenderDashboard/PurchaseQuotation/pq.view"
						)
				)}
			/>
		),
		exact: true,
	},
	{
		path: "/tenders/view/:tenderId/:tab/compare_quotation/:id",
		element: (
			<LoadComponent
				component={lazy(
					() =>
						import(
							"@src/pages/sidemenu/TenderManagement/Tenders/TenderDashboard/CompareQuotation/cq.add"
						)
				)}
			/>
		),
		exact: true,
	},
	{
		path: "/tenders/view/:tenderId/:tab/compare_quotation/view/:id",
		element: (
			<LoadComponent
				component={lazy(
					() =>
						import(
							"@src/pages/sidemenu/TenderManagement/Tenders/TenderDashboard/CompareQuotation/cq.view"
						)
				)}
			/>
		),
		exact: true,
	},
	{
		path: "/tenders/view/:tenderId/:tab/reverse_auction/:id",
		element: (
			<LoadComponent
				component={lazy(
					() =>
						import(
							"@src/pages/sidemenu/TenderManagement/Tenders/TenderDashboard/ReverseAuction/ReverseAuction.add"
						)
				)}
			/>
		),
		exact: true,
	},
	{
		path: "/tenders/view/:tenderId/:tab/reverse_auction/:id/view",
		element: (
			<LoadComponent
				component={lazy(
					() =>
						import(
							"@src/pages/sidemenu/TenderManagement/Tenders/TenderDashboard/ReverseAuction/ReverseAuction.view"
						)
				)}
			/>
		),
		exact: true,
	},

	{
		path: "/leads",
		element: (
			<LoadComponent
				component={lazy(
					() =>
						import("@src/pages/sidemenu/StrategicManagement/Leads")
				)}
			/>
		),
		exact: true,
	},
	{
		path: "/leads/:id",
		element: (
			<LoadComponent
				component={lazy(
					() =>
						import(
							"@src/pages/sidemenu/StrategicManagement/Leads/Add.leads"
						)
				)}
			/>
		),
		exact: true,
	},
	{
		path: "/leads/view/:id",
		element: (
			<LoadComponent
				component={lazy(
					() =>
						import(
							"@src/pages/sidemenu/StrategicManagement/Leads/view.leads"
						)
				)}
			/>
		),
		children: [
			{
				path: "/leads/view/:id/:tab/",
				element: (
					<LoadComponent
						component={lazy(
							() =>
								import(
									"@src/pages/sidemenu/StrategicManagement/Leads/LeadsDashboard/LeadDetails"
								)
						)}
					/>
				),
			},
			{
				path: "/leads/view/:id/:tab/lead_items",
				element: (
					<LoadComponent
						component={lazy(
							() =>
								import(
									"@src/pages/sidemenu/StrategicManagement/Leads/LeadsDashboard/LeadItems"
								)
						)}
					/>
				),
			},
			{
				path: "/leads/view/:id/:tab/budget_quotation",
				element: (
					<LoadComponent
						component={lazy(
							() =>
								import(
									"@src/pages/sidemenu/StrategicManagement/Leads/LeadsDashboard/BudgetQuotation"
								)
						)}
					/>
				),
			},
			{
				path: "/leads/view/:id/:tab/comments",
				element: (
					<LoadComponent
						component={lazy(
							() =>
								import(
									"@src/pages/sidemenu/StrategicManagement/Leads/LeadsDashboard/Comments"
								)
						)}
					/>
				),
			},
		],
		exact: true,
	},
	{
		path: "/work_order",
		element: (
			<LoadComponent
				component={lazy(
					() =>
						import(
							"@src/pages/sidemenu/ProjectManagement/WorkOrder"
						)
				)}
			/>
		),
		exact: true,
	},
	{
		path: "/work_order/:tenderId/:id",
		element: (
			<LoadComponent
				component={lazy(
					() =>
						import(
							"@src/pages/sidemenu/ProjectManagement/WorkOrder/add.work_order"
						)
				)}
			/>
		),
		exact: true,
	},
	{
		path: "/work_order/view/:id/:tab",
		element: (
			<LoadComponent
				component={lazy(
					() =>
						import(
							"@src/pages/sidemenu/ProjectManagement/WorkOrder/view.work_order"
						)
				)}
			/>
		),
		children: [
			{
				path: "/work_order/view/:id/:tab/",
				element: (
					<LoadComponent
						component={lazy(
							() =>
								import(
									"@src/pages/sidemenu/ProjectManagement/WorkOrder/WorkOrderDashboard/ProjectDetails/index"
								)
						)}
					/>
				),
			},
			{
				path: "/work_order/view/:id/:tab/project/project_items",
				element: (
					<LoadComponent
						component={lazy(
							() =>
								import(
									"@src/pages/sidemenu/ProjectManagement/WorkOrder/WorkOrderDashboard/ProjectItems/index"
								)
						)}
					/>
				),
			},
			{
				path: "/work_order/view/:id/:tab/project/performance_bank_guarantee",
				element: (
					<LoadComponent
						component={lazy(
							() =>
								import(
									"@src/pages/sidemenu/ProjectManagement/WorkOrder/WorkOrderDashboard/PerformanceBankGuarantee/index"
								)
						)}
					/>
				),
			},
			{
				path: "/work_order/view/:id/:tab/project/extended_due_date",
				element: (
					<LoadComponent
						component={lazy(
							() =>
								import(
									"@src/pages/sidemenu/ProjectManagement/WorkOrder/WorkOrderDashboard/ExtendedEndDate/index"
								)
						)}
					/>
				),
			},
			{
				path: "/work_order/view/:id/:tab/project/groups",
				element: (
					<LoadComponent
						component={lazy(
							() =>
								import(
									"@src/pages/sidemenu/ProjectManagement/WorkOrder/WorkOrderDashboard/ProjectGroups/index"
								)
						)}
					/>
				),
			},
			{
				path: "/work_order/view/:id/:tab/project/purchase_indent",
				element: (
					<LoadComponent
						component={lazy(
							() =>
								import(
									"@src/pages/sidemenu/ProjectManagement/WorkOrder/WorkOrderDashboard/PurchaseIndent/index"
								)
						)}
					/>
				),
			},
			{
				path: "/work_order/view/:id/:tab/project/teams",
				element: (
					<LoadComponent
						component={lazy(
							() =>
								import(
									"@src/pages/sidemenu/ProjectManagement/WorkOrder/WorkOrderDashboard/ProjectTeams/index"
								)
						)}
					/>
				),
			},
			{
				path: "/work_order/view/:id/:tab/project/purchase_enquiry",
				element: (
					<LoadComponent
						component={lazy(
							() =>
								import(
									"@src/pages/sidemenu/ProjectManagement/WorkOrder/WorkOrderDashboard/PurchaseEnquiry/index"
								)
						)}
					/>
				),
			},
			{
				path: "/work_order/view/:id/:tab/project/project_activity",
				element: (
					<LoadComponent
						component={lazy(
							() =>
								import(
									"@src/pages/sidemenu/ProjectManagement/WorkOrder/WorkOrderDashboard/ProjectActivity/index"
								)
						)}
					/>
				),
			},
			{
				path: "/work_order/view/:id/:tab/project/purchase_quotation",
				element: (
					<LoadComponent
						component={lazy(
							() =>
								import(
									"@src/pages/sidemenu/ProjectManagement/WorkOrder/WorkOrderDashboard/PurchaseQuotation/index"
								)
						)}
					/>
				),
			},
			{
				path: "/work_order/view/:id/:tab/project/material_received_notes",
				element: (
					<LoadComponent
						component={lazy(
							() =>
								import(
									"@src/pages/sidemenu/ProjectManagement/WorkOrder/WorkOrderDashboard/MaterialReceivedNotes/index"
								)
						)}
					/>
				),
			},
			{
				path: "/work_order/view/:id/:tab/project/compare_quotation",
				element: (
					<LoadComponent
						component={lazy(
							() =>
								import(
									"@src/pages/sidemenu/ProjectManagement/WorkOrder/WorkOrderDashboard/CompareQuotation/index"
								)
						)}
					/>
				),
			},
			{
				path: "/work_order/view/:id/:tab/project/purchase_order",
				element: (
					<LoadComponent
						component={lazy(
							() =>
								import(
									"@src/pages/sidemenu/ProjectManagement/WorkOrder/WorkOrderDashboard/PurchaseOrder/index"
								)
						)}
					/>
				),
			},
			{
				path: "/work_order/view/:id/:tab/project/mrn_return",
				element: (
					<LoadComponent
						component={lazy(
							() =>
								import(
									"@src/pages/sidemenu/ProjectManagement/WorkOrder/WorkOrderDashboard/MRNReturn/index"
								)
						)}
					/>
				),
			},
			{
				path: "/work_order/view/:id/:tab/project/milestones",
				element: (
					<LoadComponent
						component={lazy(
							() =>
								import(
									"@src/pages/sidemenu/TaskManagement/Millestones/index"
								)
						)}
					/>
				),
			},
			{
				path: "/work_order/view/:id/:tab/project/tasks",
				element: (
					<LoadComponent
						component={lazy(
							() =>
								import(
									"@src/pages/sidemenu/TaskManagement/Tasks/index"
								)
						)}
					/>
				),
			},
			{
				path: "/work_order/view/:id/:tab/project/material_request",
				element: (
					<LoadComponent
						component={lazy(
							() =>
								import(
									"@src/pages/sidemenu/ProjectManagement/WorkOrder/WorkOrderDashboard/MaterialRequest/index"
								)
						)}
					/>
				),
			},
			{
				path: "/work_order/view/:id/:tab/project/material_issue",
				element: (
					<LoadComponent
						component={lazy(
							() =>
								import(
									"@src/pages/sidemenu/ProjectManagement/WorkOrder/WorkOrderDashboard/MaterialIssue/index"
								)
						)}
					/>
				),
			},
			{
				path: "/work_order/view/:id/:tab/project/material_receipt",
				element: (
					<LoadComponent
						component={lazy(
							() =>
								import(
									"@src/pages/sidemenu/ProjectManagement/WorkOrder/WorkOrderDashboard/MaterialReceipt/index"
								)
						)}
					/>
				),
			},
			{
				path: "/work_order/view/:id/:tab/project/issue_to_production",
				element: (
					<LoadComponent
						component={lazy(
							() =>
								import(
									"@src/pages/sidemenu/ProjectManagement/WorkOrder/WorkOrderDashboard/IssueToProduction/index"
								)
						)}
					/>
				),
			},
			{
				path: "/work_order/view/:id/:tab/project/material_consumption",
				element: (
					<LoadComponent
						component={lazy(
							() =>
								import(
									"@src/pages/sidemenu/ProjectManagement/WorkOrder/WorkOrderDashboard/MaterialConsumption/index"
								)
						)}
					/>
				),
			},
			{
				path: "/work_order/view/:id/:tab/project/stock_transfer_in",
				element: (
					<LoadComponent
						component={lazy(
							() =>
								import(
									"@src/pages/sidemenu/ProjectManagement/WorkOrder/WorkOrderDashboard/StockTransferIn/index"
								)
						)}
					/>
				),
			},
			{
				path: "/work_order/view/:id/:tab/project/stock_transfer_out",
				element: (
					<LoadComponent
						component={lazy(
							() =>
								import(
									"@src/pages/sidemenu/ProjectManagement/WorkOrder/WorkOrderDashboard/StockTransferOut/index"
								)
						)}
					/>
				),
			},
			{
				path: "/work_order/view/:id/:tab/project/receipt_from_production",
				element: (
					<LoadComponent
						component={lazy(
							() =>
								import(
									"@src/pages/sidemenu/ProjectManagement/WorkOrder/WorkOrderDashboard/ReceiptFromProduction/index"
								)
						)}
					/>
				),
			},
			{
				path: "/work_order/view/:id/:tab/project/delivery_challan",
				element: (
					<LoadComponent
						component={lazy(
							() =>
								import(
									"@src/pages/sidemenu/ProjectManagement/WorkOrder/WorkOrderDashboard/DeliveryChallan/index"
								)
						)}
					/>
				),
			},
			{
				path: "/work_order/view/:id/:tab/project/delivery_note_return",
				element: (
					<LoadComponent
						component={lazy(
							() =>
								import(
									"@src/pages/sidemenu/ProjectManagement/WorkOrder/WorkOrderDashboard/DeliveryReturnNotes/index"
								)
						)}
					/>
				),
			},
			{
				path: "/work_order/view/:id/:tab/project/expenditure_sheet",
				element: (
					<LoadComponent
						component={lazy(
							() =>
								import(
									"@src/pages/sidemenu/ProjectManagement/WorkOrder/WorkOrderDashboard/ExpenditureSheet/index"
								)
						)}
					/>
				),
			},
		],
		exact: true,
	},
	{
		path: "/work_order/view/:projectId/:tab/project/purchase_indent/:id",
		element: (
			<LoadComponent
				component={lazy(
					() =>
						import(
							"@src/pages/sidemenu/ProjectManagement/WorkOrder/WorkOrderDashboard/PurchaseIndent/PurchaseIndent.add"
						)
				)}
			/>
		),
		exact: true,
	},
	{
		path: "/work_order/view/:projectId/:tab/project/purchase_order/view/:purchaseOrderId/payment_request/:id",
		element: (
			<LoadComponent
				component={lazy(
					() =>
						import(
							"@src/pages/sidemenu/ProjectManagement/WorkOrder/WorkOrderDashboard/PurchaseOrder/payment_request.add"
						)
				)}
			/>
		),
		exact: true,
	},
	{
		path: "/work_order/view/:projectId/:tab/project/purchase_indent/view/:id",
		element: (
			<LoadComponent
				component={lazy(
					() =>
						import(
							"@src/pages/sidemenu/ProjectManagement/WorkOrder/WorkOrderDashboard/PurchaseIndent/PurchaseIndent.view"
						)
				)}
			/>
		),
		exact: true,
	},
	{
		path: "/work_order/view/:projectId/:tab/project/purchase_enquiry/:id",
		element: (
			<LoadComponent
				component={lazy(
					() =>
						import(
							"@src/pages/sidemenu/ProjectManagement/WorkOrder/WorkOrderDashboard/PurchaseEnquiry/PurchaseEnquiry.add"
						)
				)}
			/>
		),
		exact: true,
	},
	{
		path: "/work_order/view/:projectId/:tab/project/material_received_notes/:id",
		element: (
			<LoadComponent
				component={lazy(
					() =>
						import(
							"@src/pages/sidemenu/ProjectManagement/WorkOrder/WorkOrderDashboard/MaterialReceivedNotes/mrn.add"
						)
				)}
			/>
		),
		exact: true,
	},
	{
		path: "/work_order/view/:projectId/:tab/project/mrn_return/:id",
		element: (
			<LoadComponent
				component={lazy(
					() =>
						import(
							"@src/pages/sidemenu/ProjectManagement/WorkOrder/WorkOrderDashboard/MRNReturn/mrn_return.add"
						)
				)}
			/>
		),
		exact: true,
	},
	{
		path: "/work_order/view/:projectId/:tab/project/material_request/:id",
		element: (
			<LoadComponent
				component={lazy(
					() =>
						import(
							"@src/pages/sidemenu/ProjectManagement/WorkOrder/WorkOrderDashboard/MaterialRequest/material_request.add"
						)
				)}
			/>
		),
		exact: true,
	},
	{
		path: "/work_order/view/:projectId/:tab/project/material_issue/:id",
		element: (
			<LoadComponent
				component={lazy(
					() =>
						import(
							"@src/pages/sidemenu/ProjectManagement/WorkOrder/WorkOrderDashboard/MaterialIssue/material_issue.add"
						)
				)}
			/>
		),
		exact: true,
	},
	{
		path: "/work_order/view/:projectId/:tab/project/material_receipt/:id",
		element: (
			<LoadComponent
				component={lazy(
					() =>
						import(
							"@src/pages/sidemenu/ProjectManagement/WorkOrder/WorkOrderDashboard/MaterialReceipt/material_receipt.add"
						)
				)}
			/>
		),
		exact: true,
	},
	{
		path: "/work_order/view/:projectId/:tab/project/material_consumption/:id",
		element: (
			<LoadComponent
				component={lazy(
					() =>
						import(
							"@src/pages/sidemenu/ProjectManagement/WorkOrder/WorkOrderDashboard/MaterialConsumption/material_consumption.add"
						)
				)}
			/>
		),
		exact: true,
	},
	{
		path: "/work_order/view/:projectId/:tab/project/stock_transfer_out/:id",
		element: (
			<LoadComponent
				component={lazy(
					() =>
						import(
							"@src/pages/sidemenu/ProjectManagement/WorkOrder/WorkOrderDashboard/StockTransferOut/stock_out.add"
						)
				)}
			/>
		),
		exact: true,
	},
	{
		path: "/work_order/view/:projectId/:tab/project/stock_transfer_in/:id",
		element: (
			<LoadComponent
				component={lazy(
					() =>
						import(
							"@src/pages/sidemenu/ProjectManagement/WorkOrder/WorkOrderDashboard/StockTransferIn/stock_in.add"
						)
				)}
			/>
		),
		exact: true,
	},
	{
		path: "/work_order/view/:projectId/:tab/project/expenditure_sheet/:id",
		element: (
			<LoadComponent
				component={lazy(
					() =>
						import(
							"@src/pages/sidemenu/ProjectManagement/WorkOrder/WorkOrderDashboard/ExpenditureSheet/expenditure_sheet.add"
						)
				)}
			/>
		),
		exact: true,
	},
	{
		path: "/work_order/view/:projectId/:tab/project/material_received_notes/view/:id",
		element: (
			<LoadComponent
				component={lazy(
					() =>
						import(
							"@src/pages/sidemenu/ProjectManagement/WorkOrder/WorkOrderDashboard/MaterialReceivedNotes/mrn.view"
						)
				)}
			/>
		),
	},
	{
		path: "/work_order/view/:projectId/:tab/project/mrn_return/view/:id",
		element: (
			<LoadComponent
				component={lazy(
					() =>
						import(
							"@src/pages/sidemenu/ProjectManagement/WorkOrder/WorkOrderDashboard/MRNReturn/mrn_retrun.view"
						)
				)}
			/>
		),
	},
	{
		path: "/work_order/view/:projectId/:tab/project/purchase_enquiry/view/:id",
		element: (
			<LoadComponent
				component={lazy(
					() =>
						import(
							"@src/pages/sidemenu/ProjectManagement/WorkOrder/WorkOrderDashboard/PurchaseEnquiry/PurchaseEnquiry.view"
						)
				)}
			/>
		),
		exact: true,
	},
	{
		path: "/work_order/view/:projectId/:tab/project/material_issue/view/:id",
		element: (
			<LoadComponent
				component={lazy(
					() =>
						import(
							"@src/pages/sidemenu/ProjectManagement/WorkOrder/WorkOrderDashboard/MaterialIssue/material_issue.view"
						)
				)}
			/>
		),
	},
	{
		path: "/work_order/view/:projectId/:tab/project/material_receipt/view/:id",
		element: (
			<LoadComponent
				component={lazy(
					() =>
						import(
							"@src/pages/sidemenu/ProjectManagement/WorkOrder/WorkOrderDashboard/MaterialReceipt/material_receipt.view"
						)
				)}
			/>
		),
	},
	{
		path: "/work_order/view/:projectId/:tab/project/material_consumption/view/:id",
		element: (
			<LoadComponent
				component={lazy(
					() =>
						import(
							"@src/pages/sidemenu/ProjectManagement/WorkOrder/WorkOrderDashboard/MaterialConsumption/material_consumption.view"
						)
				)}
			/>
		),
	},
	{
		path: "/work_order/view/:projectId/:tab/project/stock_transfer_out/view/:id",
		element: (
			<LoadComponent
				component={lazy(
					() =>
						import(
							"@src/pages/sidemenu/ProjectManagement/WorkOrder/WorkOrderDashboard/StockTransferOut/stock_out.view"
						)
				)}
			/>
		),
	},
	{
		path: "/work_order/view/:projectId/:tab/project/stock_transfer_in/view/:id",
		element: (
			<LoadComponent
				component={lazy(
					() =>
						import(
							"@src/pages/sidemenu/ProjectManagement/WorkOrder/WorkOrderDashboard/StockTransferIn/stock_in.view"
						)
				)}
			/>
		),
	},
	{
		path: "/work_order/view/:projectId/:tab/project/purchase_quotation/:id",
		element: (
			<LoadComponent
				component={lazy(
					() =>
						import(
							"@src/pages/sidemenu/ProjectManagement/WorkOrder/WorkOrderDashboard/PurchaseQuotation/Pq.add"
						)
				)}
			/>
		),
	},
	{
		path: "/work_order/view/:projectId/:tab/project/purchase_quotation/view/:id",
		element: (
			<LoadComponent
				component={lazy(
					() =>
						import(
							"@src/pages/sidemenu/ProjectManagement/WorkOrder/WorkOrderDashboard/PurchaseQuotation/pq.view"
						)
				)}
			/>
		),
	},
	{
		path: "/work_order/view/:projectId/:tab/project/compare_quotation/:id",
		element: (
			<LoadComponent
				component={lazy(
					() =>
						import(
							"@src/pages/sidemenu/ProjectManagement/WorkOrder/WorkOrderDashboard/CompareQuotation/cq.add"
						)
				)}
			/>
		),
	},
	{
		path: "/work_order/view/:projectId/:tab/project/compare_quotation/view/:id",
		element: (
			<LoadComponent
				component={lazy(
					() =>
						import(
							"@src/pages/sidemenu/ProjectManagement/WorkOrder/WorkOrderDashboard/CompareQuotation/cq.view"
						)
				)}
			/>
		),
	},
	{
		path: "/work_order/view/:projectId/:tab/project/purchase_order/view/:id",
		element: (
			<LoadComponent
				component={lazy(
					() =>
						import(
							"@src/pages/sidemenu/ProjectManagement/WorkOrder/WorkOrderDashboard/PurchaseOrder/po.view"
						)
				)}
			/>
		),
		exact: true,
	},
	{
		path: "/work_order/view/:projectId/:tab/project/material_request/view/:id",
		element: (
			<LoadComponent
				component={lazy(
					() =>
						import(
							"@src/pages/sidemenu/ProjectManagement/WorkOrder/WorkOrderDashboard/MaterialRequest/material_request.view"
						)
				)}
			/>
		),
		exact: true,
	},
	{
		path: "/work_order/view/:projectId/:tab/project/issue_to_production/:id",
		element: (
			<LoadComponent
				component={lazy(
					() =>
						import(
							"@src/pages/sidemenu/ProjectManagement/WorkOrder/WorkOrderDashboard/IssueToProduction/IssueToProduction.add"
						)
				)}
			/>
		),
		exact: true,
	},
	{
		path: "/work_order/view/:projectId/:tab/project/issue_to_production/view/:id",
		element: (
			<LoadComponent
				component={lazy(
					() =>
						import(
							"@src/pages/sidemenu/ProjectManagement/WorkOrder/WorkOrderDashboard/IssueToProduction/IssueToProduction.view"
						)
				)}
			/>
		),
		exact: true,
	},
	{
		path: "/work_order/view/:projectId/:tab/project/receipt_from_production/:id",
		element: (
			<LoadComponent
				component={lazy(
					() =>
						import(
							"@src/pages/sidemenu/ProjectManagement/WorkOrder/WorkOrderDashboard/ReceiptFromProduction/RFP.add"
						)
				)}
			/>
		),
		exact: true,
	},
	{
		path: "/work_order/view/:projectId/:tab/project/receipt_from_production/view/:id",
		element: (
			<LoadComponent
				component={lazy(
					() =>
						import(
							"@src/pages/sidemenu/ProjectManagement/WorkOrder/WorkOrderDashboard/ReceiptFromProduction/RFP.view"
						)
				)}
			/>
		),
		exact: true,
	},
	{
		path: "/work_order/view/:projectId/:tab/project/delivery_challan/:id",
		element: (
			<LoadComponent
				component={lazy(
					() =>
						import(
							"@src/pages/sidemenu/ProjectManagement/WorkOrder/WorkOrderDashboard/DeliveryChallan/DC.add"
						)
				)}
			/>
		),
		exact: true,
	},
	{
		path: "/work_order/view/:projectId/:tab/project/delivery_challan/view/:id",
		element: (
			<LoadComponent
				component={lazy(
					() =>
						import(
							"@src/pages/sidemenu/ProjectManagement/WorkOrder/WorkOrderDashboard/DeliveryChallan/DC.view"
						)
				)}
			/>
		),
		exact: true,
	},
	{
		path: "/work_order/view/:projectId/:tab/project/delivery_note_return/:id",
		element: (
			<LoadComponent
				component={lazy(
					() =>
						import(
							"@src/pages/sidemenu/ProjectManagement/WorkOrder/WorkOrderDashboard/DeliveryReturnNotes/DeliveryReturnNotes.add"
						)
				)}
			/>
		),
		exact: true,
	},
	{
		path: "/work_order/view/:projectId/:tab/project/delivery_note_return/view/:id",
		element: (
			<LoadComponent
				component={lazy(
					() =>
						import(
							"@src/pages/sidemenu/ProjectManagement/WorkOrder/WorkOrderDashboard/DeliveryReturnNotes/DeliveryReturnNotes.view"
						)
				)}
			/>
		),
		exact: true,
	},
	{
		path: "/work_order/view/:projectId/:tab/project/expenditure_sheet/view/:id",
		element: (
			<LoadComponent
				component={lazy(
					() =>
						import(
							"@src/pages/sidemenu/ProjectManagement/WorkOrder/WorkOrderDashboard/ExpenditureSheet/expenditure_sheet.view"
						)
				)}
			/>
		),
		exact: true,
	},
	{
		path: "/service_request",
		element: (
			<LoadComponent
				component={lazy(
					() =>
						import(
							"@src/pages/sidemenu/ServiceManagement/ServiceRequest/index"
						)
				)}
			/>
		),
		exact: true,
	},
	{
		path: "/service_request_approvals",
		element: (
			<LoadComponent
				component={lazy(
					() =>
						import(
							"@src/pages/sidemenu/ServiceManagement/ServiceRequestAprrovals/index"
						)
				)}
			/>
		),
		exact: true,
	},
	{
		path: "/assigned_service_request",
		element: (
			<LoadComponent
				component={lazy(
					() =>
						import(
							"@src/pages/sidemenu/ServiceManagement/ServiceRequestAssigned/index"
						)
				)}
			/>
		),
		exact: true,
	},
	{
		path: "/file_system",
		element: (
			<LoadComponent
				component={lazy(
					() => import("@src/pages/sidemenu/FileSystem/index")
				)}
			/>
		),
		children: [
			{
				path: "/file_system/:id",
				element: (
					<LoadComponent
						component={lazy(
							() => import("@src/pages/sidemenu/FileSystem/index")
						)}
					/>
				),
			},
		],
		exact: true,
	},
	{
		path: "/file_system/shared",
		element: (
			<LoadComponent
				component={lazy(
					() => import("@src/pages/sidemenu/FileSystem/SharedFiles")
				)}
			/>
		),
		exact: true,
	},
	{
		path: "/tasks",
		element: (
			<LoadComponent
				component={lazy(
					() => import("@src/pages/sidemenu/TaskManagement/Tasks")
				)}
			/>
		),
		exact: true,
	},
	{
		path: "/thumbnail_view",
		element: (
			<LoadComponent
				component={lazy(() => import("@src/components/ThumbnailView"))}
			/>
		),
		exact: true,
	},
];

const otherRotes: RoutesProps[] = [
	{
		path: "/pages/error-page-403",
		element: (
			<LoadComponent
				component={lazy(() => import("@src/pages/error/Error404"))}
			/>
		),
		exact: true,
	},
	{
		path: "/pages/error-page-500",
		element: (
			<LoadComponent
				component={lazy(() => import("@src/pages/error/Error500"))}
			/>
		),
		exact: true,
	},
	{
		path: "*",
		element: (
			<LoadComponent
				component={lazy(() => import("@src/pages/error/Error404"))}
			/>
		),
		exact: true,
	},
];

const authRoutes: RoutesProps[] = [
	{
		path: "/pages/auth/login",
		element: (
			<LoadComponent
				component={lazy(() => import("@src/pages/auth/Login"))}
			/>
		),
		exact: true,
	},
	{
		path: "/pages/auth/register",
		element: (
			<LoadComponent
				component={lazy(() => import("@src/pages/auth/Register"))}
			/>
		),
		exact: true,
	},
	{
		path: "/pages/auth/logout",
		element: (
			<LoadComponent
				component={lazy(() => import("@src/pages/auth/Logout"))}
			/>
		),
		exact: true,
	},
	{
		path: "/pages/auth/recover-password",
		element: (
			<LoadComponent
				component={lazy(() => import("@src/pages/auth/ResetPassword"))}
			/>
		),
		exact: true,
	},
	{
		path: "/pages/auth/lock-screen",
		element: (
			<LoadComponent
				component={lazy(() => import("@src/pages/auth/LockScreen"))}
			/>
		),
		exact: true,
	},
	{
		path: "/pages/auth/confirm-mail",
		element: (
			<LoadComponent
				component={lazy(() => import("@src/pages/auth/ConfirmMail"))}
			/>
		),
		exact: true,
	},
];

const adminRoutes: RoutesProps[] = [
	{
		path: "/dashboard",
		element: (
			<LoadComponent
				component={lazy(() => import("@src/pages/dashboard/index"))}
			/>
		),
		exact: true,
	},
	{
		path: "/pages/settings",
		element: (
			<LoadComponent
				component={lazy(() => import("@src/pages/settings/index"))}
			/>
		),
		exact: true,
		children: [
			// {
			// 	path: "/pages/settings/assign_user",
			// 	element: (
			// 		<LoadComponent
			// 			component={lazy(
			// 				() =>
			// 					import("@src/pages/settings/AssignUsers/index")
			// 			)}
			// 		/>
			// 	),
			// },
			{
				path: "/pages/settings/audit_logs",
				element: (
					<LoadComponent
						component={lazy(
							() => import("@src/pages/settings/AuditLogs/index")
						)}
					/>
				),
			},
			{
				path: "/pages/settings/current_login_users",
				element: (
					<LoadComponent
						component={lazy(
							() =>
								import(
									"@src/pages/settings/CurrentLoggedUsers/index"
								)
						)}
					/>
				),
			},
			{
				path: "/pages/settings/authorization",
				element: (
					<LoadComponent
						component={lazy(
							() =>
								import(
									"@src/pages/settings/Authorization/index"
								)
						)}
					/>
				),
			},
			{
				path: "/pages/settings/manage-profile",
				element: (
					<LoadComponent
						component={lazy(
							() => import("@src/pages/settings/ManageGroups")
						)}
					/>
				),
			},
			{
				path: "/pages/settings/app-settings",
				element: (
					<LoadComponent
						component={lazy(
							() =>
								import("@src/pages/settings/AppSettings/index")
						)}
					/>
				),
			},
			{
				path: "/pages/settings/export-csv",
				element: (
					<LoadComponent
						component={lazy(
							() => import("@src/pages/settings/Exports/exports")
						)}
					/>
				),
			},
			{
				path: "/pages/settings/backup-database",
				element: (
					<LoadComponent
						component={lazy(
							() =>
								import(
									"@src/pages/settings/BackupDatabase/backup-database"
								)
						)}
					/>
				),
			},
			{
				path: "/pages/settings/synchronization",
				element: (
					<LoadComponent
						component={lazy(
							() =>
								import(
									"@src/pages/settings/Synchronization/index"
								)
						)}
					/>
				),
			},
			{
				path: "/pages/settings/scheduled-alerts",
				element: (
					<LoadComponent
						component={lazy(
							() =>
								import(
									"@src/pages/settings/ScheduleReports/index"
								)
						)}
					/>
				),
			},
			{
				path: "/pages/settings/import-csv",
				element: (
					<LoadComponent
						component={lazy(
							() => import("@src/pages/settings/Imports/index")
						)}
					/>
				),
			},
			{
				path: "/pages/settings/manage-users",
				element: (
					<LoadComponent
						component={lazy(
							() => import("@src/pages/settings/ManageUsers")
						)}
					/>
				),
			},
			{
				path: "/pages/settings/usertype",
				element: (
					<LoadComponent
						component={lazy(
							() =>
								import(
									"@src/pages/settings/Permissions/UserType"
								)
						)}
					/>
				),
			},
			{
				path: "/pages/settings/assignee",
				element: (
					<LoadComponent
						component={lazy(
							() =>
								import(
									"@src/pages/settings/Permissions/Assignees"
								)
						)}
					/>
				),
			},
			{
				path: "/pages/settings/approvals",
				element: (
					<LoadComponent
						component={lazy(
							() =>
								import(
									"@src/pages/settings/Permissions/Approvals"
								)
						)}
					/>
				),
			},
			{
				path: "/pages/settings/department_users",
				element: (
					<LoadComponent
						component={lazy(
							() =>
								import(
									"@src/pages/settings/Permissions/DepartmentUsers"
								)
						)}
					/>
				),
			},
		],
	},
	{
		path: "/pages/settings/manage-profile/:id",
		element: (
			<LoadComponent
				component={lazy(
					() =>
						import(
							"@src/pages/settings/ManageGroups/Add.manage_group"
						)
				)}
			/>
		),
		exact: true,
	},
	{
		path: "/pages/settings/datapermissions/:id",
		element: (
			<LoadComponent
				component={lazy(
					() =>
						import(
							"@src/pages/settings/ManageGroups/DataPermission"
						)
				)}
			/>
		),
		exact: true,
	},
	{
		path: "/pages/settings/manage-users/:id",
		element: (
			<LoadComponent
				component={lazy(
					() =>
						import(
							"@src/pages/settings/ManageUsers/Add.manage_user"
						)
				)}
			/>
		),
		exact: true,
	},
	{
		path: "/pages/settings/manage-users/:id/view",
		element: (
			<LoadComponent
				component={lazy(
					() =>
						import(
							"@src/pages/settings/ManageUsers/View.manage_user"
						)
				)}
			/>
		),
		exact: true,
	},
	{
		path: "/pages/settings/view-profile",
		element: (
			<LoadComponent
				component={lazy(
					() => import("@src/pages/settings/ViewProfile")
				)}
			/>
		),
	},
	// {
	// 	path: "/pages/settings/usertype",
	// 	element: (
	// 		<LoadComponent
	// 			component={lazy(
	// 				() =>
	// 					import(
	// 						"@src/pages/settings/Permissions/UserType/index"
	// 					)
	// 			)}
	// 		/>
	// 	),
	// 	exact: true,
	// },
	{
		path: "/pages/masters",
		element: (
			<LoadComponent
				component={lazy(() => import("@src/pages/masters/index"))}
			/>
		),
		exact: true,
	},
	{
		path: "/pages/masters/client_location",
		element: (
			<LoadComponent
				component={lazy(
					() => import("@src/pages/masters/ClientLocations/index")
				)}
			/>
		),
		exact: true,
	},
	{
		path: "/pages/masters/vendor_items",
		element: (
			<LoadComponent
				component={lazy(
					() => import("@src/pages/masters/VendorItems/index")
				)}
			/>
		),
		exact: true,
	},
	// {
	// 	path: "/tender_items",
	// 	element: (
	// 		<LoadComponent
	// 			component={lazy(
	// 				() =>
	// 					import(
	// 						"@src/pages/sidemenu/TenderManagement/TenderItems"
	// 					)
	// 			)}
	// 		/>
	// 	),
	// 	exact: true,
	// },
	{
		path: "/pages/masters/departments",
		element: (
			<LoadComponent
				component={lazy(
					() => import("@src/pages/masters/Department/index")
				)}
			/>
		),
		exact: true,
	},
	{
		path: "/pages/masters/account_type",
		element: (
			<LoadComponent
				component={lazy(
					() => import("@src/pages/masters/AccountType/index")
				)}
			/>
		),
		exact: true,
	},
	{
		path: "/pages/masters/document",
		element: (
			<LoadComponent
				component={lazy(
					() => import("@src/pages/masters/Document/index")
				)}
			/>
		),
		exact: true,
	},
	{
		path: "/pages/masters/locations",
		element: (
			<LoadComponent
				component={lazy(
					() => import("@src/pages/masters/Locations/index")
				)}
			/>
		),
		exact: true,
	},
	{
		path: "/pages/masters/document",
		element: (
			<LoadComponent
				component={lazy(
					() => import("@src/pages/masters/Document/index")
				)}
			/>
		),
		exact: true,
	},
	{
		path: "/pages/masters/locations",
		element: (
			<LoadComponent
				component={lazy(
					() => import("@src/pages/masters/Locations/index")
				)}
			/>
		),
		exact: true,
	},
	{
		path: "/pages/masters/batchs",
		element: (
			<LoadComponent
				component={lazy(() => import("@src/pages/masters/Batch/index"))}
			/>
		),
		exact: true,
	},
	{
		path: "/pages/masters/item",
		element: (
			<LoadComponent
				component={lazy(() => import("@src/pages/masters/Item/index"))}
			/>
		),
		exact: true,
	},
	{
		path: "/pages/masters/accounts",
		element: (
			<LoadComponent
				component={lazy(
					() => import("@src/pages/masters/Accounts/index")
				)}
			/>
		),
		exact: true,
	},

	{
		path: "/pages/masters/items/:id",
		element: (
			<LoadComponent
				component={lazy(() => import("@src/pages/masters/Item/index"))}
			/>
		),
		exact: true,
	},
	{
		path: "/pages/masters/accounts/:id",
		element: (
			<LoadComponent
				component={lazy(
					() => import("@src/pages/masters/Accounts/index")
				)}
			/>
		),
		exact: true,
	},
	{
		path: "/pages/masters/item/add",
		element: (
			<LoadComponent
				component={lazy(
					() => import("@src/pages/masters/Item/add.item")
				)}
			/>
		),
		exact: true,
	},
	{
		path: "/pages/masters/account/add/:id",
		element: (
			<LoadComponent
				component={lazy(
					() => import("@src/pages/masters/Accounts/add.account")
				)}
			/>
		),
		exact: true,
	},
	{
		path: "/pages/masters/item/:id",
		element: (
			<LoadComponent
				component={lazy(
					() => import("@src/pages/masters/Item/add.item")
				)}
			/>
		),
		exact: true,
	},
	{
		path: "/pages/masters/make",
		element: (
			<LoadComponent
				component={lazy(() => import("@src/pages/masters/Make/index"))}
			/>
		),
		exact: true,
	},
	{
		path: "/pages/masters/moc",
		element: (
			<LoadComponent
				component={lazy(() => import("@src/pages/masters/Moc/index"))}
			/>
		),
		exact: true,
	},
	{
		path: "/pages/masters/country",
		element: (
			<LoadComponent
				component={lazy(
					() => import("@src/pages/masters/Country/index")
				)}
			/>
		),
		exact: true,
	},
	{
		path: "/pages/masters/vendors",
		element: (
			<LoadComponent
				component={lazy(
					() => import("@src/pages/masters/Vendors/index")
				)}
			/>
		),
		exact: true,
	},
	{
		path: "/pages/masters/company",
		element: (
			<LoadComponent
				component={lazy(
					() => import("@src/pages/masters/Company/index")
				)}
			/>
		),
		exact: true,
	},
	{
		path: "/pages/masters/tax",
		element: (
			<LoadComponent
				component={lazy(() => import("@src/pages/masters/Tax/index"))}
			/>
		),
		exact: true,
	},
	{
		path: "/pages/masters/states",
		element: (
			<LoadComponent
				component={lazy(() => import("@src/pages/masters/State/index"))}
			/>
		),
		exact: true,
	},
	{
		path: "/pages/masters/sections",
		element: (
			<LoadComponent
				component={lazy(
					() => import("@src/pages/masters/Sections/index")
				)}
			/>
		),
		exact: true,
	},
	{
		path: "/pages/masters/city",
		element: (
			<LoadComponent
				component={lazy(() => import("@src/pages/masters/City/index"))}
			/>
		),
		exact: true,
	},
	{
		path: "/pages/masters/category",
		element: (
			<LoadComponent
				component={lazy(
					() => import("@src/pages/masters/Category/index")
				)}
			/>
		),
		exact: true,
	},
	{
		path: "/pages/masters/expendituretype",
		element: (
			<LoadComponent
				component={lazy(
					() => import("@src/pages/masters/ExpenditureType/index")
				)}
			/>
		),
		exact: true,
	},
	{
		path: "/pages/masters/unit",
		element: (
			<LoadComponent
				component={lazy(() => import("@src/pages/masters/Unit/index"))}
			/>
		),
		exact: true,
	},
	{
		path: "/pages/masters/uom",
		element: (
			<LoadComponent
				component={lazy(
					() => import("@src/pages/masters/BaseUnit/index")
				)}
			/>
		),
		exact: true,
	},
	{
		path: "/pages/masters/sourceportal",
		element: (
			<LoadComponent
				component={lazy(
					() => import("@src/pages/masters/BidNature/index")
				)}
			/>
		),
		exact: true,
	},
	{
		path: "/pages/masters/customers",
		element: (
			<LoadComponent
				component={lazy(
					() => import("@src/pages/masters/Customers/index")
				)}
			/>
		),
		exact: true,
	},
	{
		path: "/pages/masters/stages",
		element: (
			<LoadComponent
				component={lazy(
					() => import("@src/pages/masters/Stages/index")
				)}
			/>
		),
		exact: true,
	},
	{
		path: "/pages/masters/warehouse",
		element: (
			<LoadComponent
				component={lazy(
					() => import("@src/pages/masters/Warehouse/index")
				)}
			/>
		),
		exact: true,
	},
	{
		path: "/pages/masters/expenses",
		element: (
			<LoadComponent
				component={lazy(
					() => import("@src/pages/masters/Expenses/index")
				)}
			/>
		),
		exact: true,
	},
	{
		path: "/pages/masters/agencies",
		element: (
			<LoadComponent
				component={lazy(
					() => import("@src/pages/masters/InspectionAgencies/index")
				)}
			/>
		),
		exact: true,
	},
];

export const defaultLayoutRoutes = [...otherRotes, ...authRoutes];

export const verticalLayoutRoutes = [
	{ path: "/", element: <Navigate to="/pages/auth/login" /> },
	...adminRoutes,
	...appsRoutes,
	...Reports,
];
