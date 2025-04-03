import { Page, Text, Image, Document, StyleSheet, Font, View } from '@react-pdf/renderer';
import moment from 'moment';
import React, { useEffect } from "react";
import styles from "./pdf";
import { PDFFooter, PDFHeader } from '.';

const splitDataIntoColumns = (data: any) => {
    const midpoint = Math.ceil(data.length / 2);
    return [data.slice(0, midpoint), data.slice(midpoint)];
};

export function PaymentRequestPrintContent({ paymentRequestData, companyData }: { paymentRequestData: any, companyData: any }): React.JSX.Element {

    const rows = [
        {
            label: "Date:",
            value: moment(paymentRequestData[0]?.purchase_order?.date).format("DD-MM-YYYY"),
        },
        {
            label: "Vendor:",
            value: paymentRequestData[0]?.purchase_order?.vendor?.name,
        },
        {
            label: "Location:",
            value: paymentRequestData[0]?.purchase_order?.location?.name,
        },
        {
            label: "Delivery:",
            value: paymentRequestData[0]?.purchase_order?.delivery,
        },
        {
            label: "Transport:",
            value: paymentRequestData[0]?.purchase_order?.transport,
        },
        {
            label: "Payment:",
            value: paymentRequestData[0]?.purchase_order?.payment,
        },
        {
            label: "Gst Type:",
            value: paymentRequestData[0]?.purchase_order?.gstdetails,
        },
        {
            label: "P & F:",
            value: paymentRequestData[0]?.purchase_order?.pnf,
        },
        {
            label: "Description:",
            value: paymentRequestData[0]?.purchase_order?.description,
        },
        {
            label: "Terms & Conditions:",
            value: paymentRequestData[0]?.purchase_order?.terms,
        },
        {
            label: "Remarks:",
            value: paymentRequestData[0]?.purchase_order?.remarks,
        },
    ];
    const [leftItems, rightItems] = splitDataIntoColumns(rows);


    const MyDoc = (
        <Document>
            <Page size="A4" style={styles.body}>
                <PDFHeader companyData={companyData} />
                <View style={styles.bid} fixed>
                    <Text style={styles.content}>
                        Purchase Order Details
                    </Text>
                    <Text style={styles.companyDetails}>
                        PO No: {paymentRequestData[0]?.purchase_order?.code}
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
                <View>
                    <Text style={{ fontSize: 14, margin: 10, fontWeight: "bold", fontFamily: "Roboto" }}>
                        Payment Requests
                    </Text>
                </View>
                <View style={styles.table}>
                    <View style={styles.tableRow}>
                        <Text style={[styles.tableCellHeader, { flex: 0.3 }]}>SI No</Text>
                        <Text style={[styles.tableCellHeader, { flex: 1 }]}>Code</Text>
                        <Text style={[styles.tableCellHeader, { flex: 1 }]}>Req Date</Text>
                        <Text style={[styles.tableCellHeader, { flex: 1 }]}>Vendor</Text>
                        <Text style={[styles.tableCellHeader, { flex: 1 }]}>Percentage</Text>
                        <Text style={[styles.tableCellHeader, { flex: 1.3 }]}>Percentage Amt</Text>
                        <Text style={[styles.tableCellHeader, { flex: 1 }]}>Due Date</Text>
                        <Text style={[styles.tableCellHeader, { flex: 1 }]}>Status</Text>
                    </View>

                    {paymentRequestData?.map((item: any, index: number) => (
                        <View style={styles.tableRow}>
                            <Text key={index} style={[styles.tableCell, { flex: 0.3 }]}>{index + 1}</Text>
                            <Text key={index} style={[styles.tableCell, { flex: 1 }]}>{item?.code}</Text>
                            <Text key={index} style={[styles.tableCell, { flex: 1 }]}>{moment(item.requested_date).format("DD-MM-YYYY")}</Text>
                            <Text key={index} style={[styles.tableCell, { flex: 1 }]}>{item.vendor?.name}</Text>
                            <Text key={index} style={[styles.tableCell, { flex: 1 }]}>{parseInt(item?.percentage)}</Text>
                            <Text key={index} style={[styles.tableCell, { flex: 1.3 }]}>{item?.percentage_amount}</Text>
                            <Text key={index} style={[styles.tableCell, { flex: 1 }]}>{moment(item.due_date).format("DD-MM-YYYY")}</Text>
                            <Text key={index} style={[styles.tableCell, { flex: 1 }]}>{item.approved_status_name}</Text>
                        </View>
                    ))}
                </View>
                <PDFFooter />
            </Page>
        </Document>
    );
    return MyDoc;
}