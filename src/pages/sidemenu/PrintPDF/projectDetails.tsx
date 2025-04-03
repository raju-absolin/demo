import React, { useRef, useState } from "react";
import PDFDocument from "@src/pages/sidemenu/PrintPDF/pdf";
import ReactQuill, { Quill } from "react-quill";
import { PDFViewer } from "@react-pdf/renderer";
import { ComponentContainerCard, PageBreadcrumb } from "@src/components";
import { Box, Card, Typography } from "@mui/material";
import "react-quill/dist/quill.snow.css";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Page, Text, Image, Document, StyleSheet, Font, View } from '@react-pdf/renderer';
import moment from "moment";
import styles from "./pdf";
import { PDFHeader, PDFFooter } from "./index";

export function ProjectPrintContent({
    projectData,
    companyData,
}: {
    projectData: any;
    companyData?: any;
}): React.JSX.Element {

    const splitDataIntoColumns = (data: any) => {
        const midpoint = Math.ceil(data.length / 2);
        return [data.slice(0, midpoint), data.slice(midpoint)];
    };

    const rows = [
		{
			label: "Start Date",
			value: projectData?.start_date,
		},
		{
			label: "Due Date",
			value: projectData?.due_date,
		},
		{
			label: "Warranty  Period",
			value: projectData?.warrenty_period,
		},
		{
			label: "Project",
			value: projectData?.name,
		},
		{
			label: "Work Order Number",
			value: projectData?.project_no,
		},
		{
			label: "Bid Number",
			value: projectData?.tender_no,
		},
		{
			label: "Source Portal",
			value: projectData?.sourceportal?.name,
		},
		{
			label: "Bid Type",
			value: projectData?.tender_type_name,
		},

		{
			label: "Company",
			value: projectData?.company?.name,
		},
		{
			label: "Department",
			value: projectData?.department_name,
		},
		{
			label: "Product Type",
			value: projectData?.product_type_name,
		},
		{
			label: "Product Value",
			value: projectData?.amount,
		},
		// {
		// 	label: "Tax Type",
		// 	value: projectData?.taxtype_name,
		// },
		// {
		// 	label: "Tax",
		// 	value: projectData?.tax?.name,
		// },
		{
			label: "Tax Amount",
			value: projectData?.taxamount,
		},
		{
			label: "Total Value",
			value: projectData?.total_value,
		},
		{
			label: "Manager",
			value: projectData?.manager?.fullname,
		},
		{
			label: "Customer",
			value: projectData?.customer?.name,
		},
		{
			label: "Is Performance Bank Guarantee",
			value: projectData?.is_performace_bank_guarantee ? "Yes" : "No",
		},
		{
			label: "Pre Dispatch Inspection",
			value: projectData?.is_pre_dispatch_inspection ? "Yes" : "No",
		},
		{
			label: "Is Inspection Agency",
			value: projectData?.is_inspection_agency ? "Yes" : "No",
		},
		{
			label: "Inspection Agency",
			value: projectData?.inspection_agency?.concerned_officer || "N/A",
		},
		{
			label: "Stagewise Inspection",
			value: projectData?.is_stagewise_inspection ? "Yes" : "No",
		},
		// {
		// 	label: "GST Percentage",
		// 	value: projectData?.gst_percentage,
		// },
		{
			label: "Delivery In Lots",
			value: projectData?.delivery_in_lots,
		},
		{
			label: "Bid Open Date",
			value: moment(
				projectData?.tender?.tender_open_datetime,
				"DD-MM-YYYY HH:mm"
			).format("LL"),
		},
		{
			label: "Bid Due Date",
			value: moment(
				projectData?.tender_due_datetime,
				"DD-MM-YYYY HH:mm"
			).format("LL"),
		},

		{
			label: "Delivery Terms",
			value: projectData?.deliver_terms,
		},
		{
			label: "Financial Terms",
			value: projectData?.financial_terms,
		},

		{
			label: "Remarks",
			value: projectData?.remarks,
		},
		{
			label: "Created On",
			value: moment(projectData?.created_on, "DD-MM-YYYY HH:mm").format(
				"LLL"
			),
		},
		{
			label: "Created By",
			value: projectData?.created_by?.fullname,
		},
		{
			label: "Status",
			value: projectData?.status_name
		},
	];

    const [leftItems, rightItems] = splitDataIntoColumns(rows);

    const MyDoc = (
        <Document>
            <Page size="A4" style={styles.body}>
                <PDFHeader companyData={companyData} />
                <View style={styles.bid} fixed>
                    <Text style={styles.content}>
                        Project Details
                    </Text>
                    <Text style={styles.companyDetails}>
                        Project No: {projectData?.project_no}
                    </Text>
                </View>
                <View style={styles.tablefeilds}>
                    <View style={styles.tableRow}>
                        <View style={styles.column}>
                            {leftItems.map((item: any, index: number) => (
                                <View style={styles.itemRow} key={`left-${index}`}>
                                    <Text style={styles.labelCell}>{item.label}</Text>
                                    <Text style={styles.valueCell}>{item.value}</Text>
                                </View>
                            ))}
                        </View>
                        <View style={styles.column}>
                            {rightItems.map((item: any, index: number) => (
                                <View style={styles.itemRow} key={`right-${index}`}>
                                    <Text style={styles.labelCell}>{item.label}</Text>
                                    <Text style={styles.valueCell}>{item.value}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                </View>
                <View style={styles.table}>
                    <View style={styles.tableRow}>
                        <Text style={[styles.tableCellHeader, { flex: 0.5 }]}>SI No</Text>
                        <Text style={[styles.tableCellHeader, { flex: 2 }]}>Item</Text>
                        <Text style={[styles.tableCellHeader, { flex: 2 }]}>Price</Text>
                        <Text style={[styles.tableCellHeader, { flex: 1 }]}>Quantity</Text>
                    </View>

                    {projectData?.project_items?.map((item: any, index: number) => (
                        <View style={styles.tableRow}>
                            <Text key={index} style={[styles.tableCell, { flex: 0.5 }]}>{index + 1}</Text>
                            <Text key={index} style={[styles.tableCell, { flex: 2 }]}>{item.tenderitemmaster?.label}</Text>
                            <Text key={index} style={[styles.tableCell, { flex: 2 }]}>{item.price}</Text>
                            <Text key={index} style={[styles.tableCell, { flex: 1 }]}>{parseInt(item.quantity)}</Text>
                        </View>
                    ))}
                </View>
                <PDFFooter />
            </Page>
        </Document>

    );
    return MyDoc;
};

