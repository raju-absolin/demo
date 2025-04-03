import { Page, Text, Image, Document, StyleSheet, Font, View } from '@react-pdf/renderer';
import moment from 'moment';
import React, { useEffect } from "react";
import styles from "./pdf";
import { PDFFooter, PDFHeader } from '.';

const splitDataIntoColumns = (data: any) => {
    const midpoint = Math.ceil(data.length / 2);
    return [data.slice(0, midpoint), data.slice(midpoint)];
};


export function MRNPrintContent({ mrnData, companyData }: { mrnData: any, companyData: any }): React.JSX.Element {

    const rows = [
        {
            label: "Created Date:",
            value: moment(mrnData?.created_on).format("DD-MM-YYYY"),
        },
        {
            label: "Purchase Order Code:",
            value: mrnData?.purchaseorder?.code,
        },
        {
            label: "Vendor:",
            value: mrnData?.vendor?.name,
        },
        {
            label: "Location:",
            value: mrnData?.location?.name,
        },
        {
            label: "Warehouse:",
            value: mrnData?.warehouse?.name,
        },
        {
            label: "Invoice Number:",
            value: mrnData?.invoice_no,
        },
        {
            label: "Invoice Date:",
            value: moment(mrnData?.invoice_date).format("DD-MM-YYYY"),
        },
        {
            label: "Invoice Amount:",
            value: mrnData?.invoice_amount,
        },
        {
			label: "Currency",
			value: mrnData?.currency?.name,
		},
		{
			label: "Exchange Rate",
			value: mrnData?.exchange_rate,
		},
        {
			label: "Description",
			value: mrnData?.description,
		},
    ];
    const [leftItems, rightItems] = splitDataIntoColumns(rows);


    const MyDoc = (
        <Document>
            <Page size="A4" style={styles.body}>
                <PDFHeader companyData={companyData} />

                <View style={styles.bid} fixed>
                    <Text style={styles.content}>
                        Material Received Notes
                    </Text>
                    <Text style={styles.companyDetails}>
                        MRN No: {mrnData?.code}
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
                // ,balance qty,received qty,units,make
                <View style={styles.table}>
                    <View style={styles.tableRow}>
                        <Text style={[styles.tableCellHeader, { flex: 0.5 }]}>SI No</Text>
                        <Text style={[styles.tableCellHeader, { flex: 2 }]}>Item</Text>
                        <Text style={[styles.tableCellHeader, { flex: 1 }]}>Make</Text>
                        <Text style={[styles.tableCellHeader, { flex: 1 }]}>Bal Qty</Text>
                        <Text style={[styles.tableCellHeader, { flex: 1 }]}>MRN Qty</Text>
                        <Text style={[styles.tableCellHeader, { flex: 1 }]}>Rejected Qty</Text>
                        <Text style={[styles.tableCellHeader, { flex: 1 }]}>Qty</Text>
                        <Text style={[styles.tableCellHeader, { flex: 1 }]}>Units</Text>
                        <Text style={[styles.tableCellHeader, { flex: 1 }]}>Price</Text>
                        <Text style={[styles.tableCellHeader, { flex: 1 }]}>Batch</Text>
                        <Text style={[styles.tableCellHeader, { flex: 2}]}>Tax Type</Text>
                        <Text style={[styles.tableCellHeader, { flex: 1 }]}>Tax</Text>
                        <Text style={[styles.tableCellHeader, { flex: 1 }]}>Description</Text>
                    </View>

                    {mrnData?.mrn_items?.map((item: any, index: number) => (
                        <View style={styles.tableRow}>
                            <Text key={index} style={[styles.tableCell, { flex: 0.5 }]}>{index + 1}</Text>
                            <Text key={index} style={[styles.tableCell, { flex: 2 }]}>{item?.item?.name}</Text>
                            <Text key={index} style={[styles.tableCell, { flex: 1 }]}>{item?.make?.name}</Text>
                            <Text key={index} style={[styles.tableCell, { flex: 1 }]}>{item?.balance_quantity}</Text>
                            <Text key={index} style={[styles.tableCell, { flex: 1 }]}>{item?.received_quantity}</Text>
                            <Text key={index} style={[styles.tableCell, { flex: 1 }]}>{item?.rejected_quantity}</Text>
                            <Text key={index} style={[styles.tableCell, { flex: 1 }]}>{item?.qty}</Text>
                            <Text key={index} style={[styles.tableCell, { flex: 1 }]}>{item?.unit?.name}</Text>
                            <Text key={index} style={[styles.tableCell, { flex: 1 }]}>{parseInt(item?.price)}</Text>
                            <Text key={index} style={[styles.tableCell, { flex: 1 }]}>{item?.batch?.name}</Text>
                            <Text key={index} style={[styles.tableCell, { flex: 2 }]}>{item?.taxtype_name}</Text>
                            <Text key={index} style={[styles.tableCell, { flex: 1 }]}>{item?.tax?.tax ? item?.tax?.tax : "N/A"}</Text>
                            <Text key={index} style={[styles.tableCell, { flex: 1 }]}>{item?.description}</Text>
                        </View>
                    ))}
                </View>
                <PDFFooter />
            </Page>
        </Document>
    );
    return MyDoc;
}