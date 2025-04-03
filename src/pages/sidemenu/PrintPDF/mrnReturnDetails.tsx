import { Page, Text, Image, Document, StyleSheet, Font, View } from '@react-pdf/renderer';
import moment from 'moment';
import React, { useEffect } from "react";
import styles from "./pdf";
import { PDFFooter, PDFHeader } from '.';

const splitDataIntoColumns = (data: any) => {
    const midpoint = Math.ceil(data.length / 2);
    return [data.slice(0, midpoint), data.slice(midpoint)];
};


export function MRNReturnPrintContent({ mrnReturnData, companyData }: { mrnReturnData: any, companyData: any }): React.JSX.Element {

    const rows = [
        {
            label: "Created Date:",
            value: moment(mrnReturnData?.created_on).format("DD-MM-YYYY"),
        },
        {
            label: "MRN Code:",
            value: mrnReturnData?.mrn?.code,
        },
        {
            label: "Vendor:",
            value: mrnReturnData?.vendor?.name,
        },
        {
            label: "Location:",
            value: mrnReturnData?.location?.name,
        },
        {
            label: "Warehouse:",
            value: mrnReturnData?.warehouse?.name,
        },
    ];
    const [leftItems, rightItems] = splitDataIntoColumns(rows);


    const MyDoc = (
        <Document>
            <Page size="A4" style={styles.body}>
                <PDFHeader companyData={companyData} />
                <View style={styles.bid} fixed>
                    <Text style={styles.content}>
                        MRN Return
                    </Text>
                    <Text style={styles.companyDetails}>
                        MRN Return No: {mrnReturnData?.code}
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
                        <Text style={[styles.tableCellHeader, { flex: 1 }]}>Quantity</Text>
                        <Text style={[styles.tableCellHeader, { flex: 1 }]}>Unit</Text>
                        <Text style={[styles.tableCellHeader, { flex: 1 }]}>Batch</Text>
                    </View>

                    {mrnReturnData?.mrnreturn_items?.map((item: any, index: number) => (
                        <View style={styles.tableRow}>
                            <Text key={index} style={[styles.tableCell, { flex: 0.5 }]}>{index + 1}</Text>
                            <Text key={index} style={[styles.tableCell, { flex: 2 }]}>{item.item?.name}</Text>
                            <Text key={index} style={[styles.tableCell, { flex: 1 }]}>{item.qty}</Text>
                            <Text key={index} style={[styles.tableCell, { flex: 1 }]}>{item.unit?.name}</Text>
                            <Text key={index} style={[styles.tableCell, { flex: 1 }]}>{item.batch?.name}</Text>
                        </View>
                    ))}
                </View>
                <PDFFooter />
            </Page>
        </Document>
    );
    return MyDoc;
}