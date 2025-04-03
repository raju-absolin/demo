import { Page, Text, Image, Document, StyleSheet, Font, View } from '@react-pdf/renderer';
import moment from 'moment';
import React, { useEffect } from "react";
import styles from "./pdf";
import { PDFFooter, PDFHeader } from '.';

const splitDataIntoColumns = (data: any) => {
    const midpoint = Math.ceil(data.length / 2);
    return [data.slice(0, midpoint), data.slice(midpoint)];
};

export function PurchaseIndentPrintContent({
    purchaseIndentData,
    companyData,
}: {
    purchaseIndentData: any;
    companyData?: any;
}): React.JSX.Element {

    const rows = [
        {
            label: "PI Status:",
            value: purchaseIndentData?.pistatus_name,
        },
        {
            label: "Location:",
            value: purchaseIndentData?.location?.name,
        },
        {
            label: "Warehouse:",
            value: purchaseIndentData?.warehouse?.name,
        },
        {
            label: "Description:",
            value: purchaseIndentData?.description,
        },
    ];
    const [leftItems, rightItems] = splitDataIntoColumns(rows);


    const MyDoc = (
        <Document>
            <Page size="A4" style={styles.body}>
                <PDFHeader companyData={companyData} />
                <View style={styles.bid} fixed>
                    <Text style={styles.content}>
                        Purchase Indent
                    </Text>
                    <Text style={styles.companyDetails}>
                        PI Code : {purchaseIndentData?.code}
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
                        <Text style={[styles.tableCellHeader, { flex: 2 }]}>Make</Text>
                        <Text style={[styles.tableCellHeader, { flex: 2 }]}>Date</Text>
                        <Text style={[styles.tableCellHeader, { flex: 1 }]}>Quantity</Text>
                        <Text style={[styles.tableCellHeader, { flex: 1 }]}>Unit</Text>
                        <Text style={[styles.tableCellHeader, { flex: 1 }]}>Description</Text>
                    </View>

                    {purchaseIndentData?.piitems?.map((item: any, index: number) => (
                        <View style={styles.tableRow}>
                            <Text key={index} style={[styles.tableCell, { flex: 0.5 }]}>{index + 1}</Text>
                            <Text key={index} style={[styles.tableCell, { flex: 2 }]}>{item.item?.name}</Text>
                            <Text key={index} style={[styles.tableCell, { flex: 2 }]}>{item.make?.name}</Text>
                            <Text key={index} style={[styles.tableCell, { flex: 2 }]}>{moment(item?.date).format("DD-MM-YYYY")}</Text>
                            <Text key={index} style={[styles.tableCell, { flex: 1 }]}>{parseInt(item.qty)}</Text>
                            <Text key={index} style={[styles.tableCell, { flex: 1 }]}>{item.unit?.name}</Text>
                            <Text key={index} style={[styles.tableCell, { flex: 1 }]}>{item.description}</Text>
                        </View>
                    ))}
                </View>
                <PDFFooter />
            </Page>
        </Document>
    );
    return MyDoc;
}