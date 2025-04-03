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

export function BidPrintContent({
    tenderData,
    companyData,
}: {
    tenderData: any;
    companyData?: any;
}): React.JSX.Element {

    const splitDataIntoColumns = (data: any) => {
        const midpoint = Math.ceil(data.length / 2);
        return [data.slice(0, midpoint), data.slice(midpoint)];
    };
    const rows = [
        {
            label: "Name: ",
            value: tenderData?.name,
        },
        {
            label: "Lead: ",
            value: tenderData?.lead?.name,
        },
        {
            label: "Source Portal: ",
            value: tenderData?.sourceportal?.name,
        },
        {
            label: "Company: ",
            value: tenderData?.company?.name,
        },
        {
            label: "Customer: ",
            value: tenderData?.customer?.name,
        },
        {
            label: "Department: ",
            value: tenderData?.department,
        },
        {
			label: "Bid Type",
			value: tenderData?.tender_type?.name,
		},
        {
            label: "Product Type: ",
            value: tenderData?.product_type_name,
        },
        {
            label: "Bid Opening Date and Time: ",
            value: tenderData?.tender_open_datetime,
        },
        {
            label: "Bid End Date: ",
            value: tenderData?.tender_datetime,
        },
        {
            label: "Bid Extension Date: ",
            value: tenderData?.tender_extension_datetime,
        },
        {
            label: "Bid Assigned Date: ",
            value: tenderData?.assigned_on
                ? moment(tenderData?.assigned_on).format(
                    "DD-MM-YYYY hh:mm:ss a"
                )
                : ": ",
        },
        {
            label: "Pre-Bid Meeting Date: ",
            value: moment(tenderData?.pre_bid_date).format("DD-MM-YYYY"),
        },
        {
            label: "Pre-Bid Meeting Place: ",
            value: tenderData?.pre_bid_place,
        },
        {
            label: "Pre-Bid Meeting Address: ",
            value: tenderData?.pre_bid_meet_address,
        },
        {
            label: "Ministry/State: ",
            value: tenderData?.ministry,
        },
        {
            label: "Average Annual Turnover: ",
            value: tenderData?.annual_turnover,
        },
        {
            label: "Years of Experience: ",
            value: tenderData?.years_of_experiance,
        },
        {
            label: "MSS Exemption: ",
            value: tenderData?.is_mss_exemption ? "Yes" : "No: ",
        },
        {
            label: "Startup Exemption: ",
            value: tenderData?.is_start_exemption ? "Yes" : "No: ",
        },
        {
			label: "Reverse Auction",
			value: tenderData.is_reverse_auction ? "Yes" : "No",
		},
        {
            label: "Documents Required: ",
            value: tenderData?.documents_required_seller,
        },
        {
            label: "Time Allowed: ",
            value: tenderData?.time_allowed_clarification_days,
        },
        {
            label: "Inspection Required: ",
            value: tenderData?.is_inspection ? "Yes" : "No: ",
        },
        {
            label: "Evaluation Method: ",
            value: tenderData?.evaluation_method,
        },
        {
            label: "Description: ",
            value: tenderData?.description,
        },

        {
            label: "Status: ",
            value: tenderData?.status_name
        },
        {
            label: "Assigned Users: ",
            value: tenderData?.assign_to?.map((e: any) => e.fullname + ", ")
        },
    ];

    const [leftItems, rightItems] = splitDataIntoColumns(rows);

    const MyDoc = (
        <Document>
            <Page size="A4" style={styles.body}>
                <PDFHeader companyData={companyData} />
                <View style={styles.bid} fixed>
                    <Text style={styles.content}>
                        Bid Details
                    </Text>
                    <Text style={styles.companyDetails}>
                        Bid No: {tenderData?.tender_no}
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
                        <Text style={[styles.tableCellHeader, { flex: 2 }]}>Bid Item</Text>
                        <Text style={[styles.tableCellHeader, { flex: 1 }]}>Quantity</Text>
                    </View>

                    {tenderData?.tender_items?.map((item: any, index: number) => (
                        <View style={styles.tableRow}>
                            <Text key={index} style={[styles.tableCell, { flex: 0.5 }]}>{index + 1}</Text>
                            <Text key={index} style={[styles.tableCell, { flex: 2 }]}>{item.tenderitemmaster?.label}</Text>
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

