import { Page, Text, Image, Document, StyleSheet, Font, View } from '@react-pdf/renderer';
import moment from 'moment';
import React, { useEffect } from "react";
import styles from "./pdf";
import { PDFFooter, PDFHeader } from '.';

const splitDataIntoColumns = (data: any) => {
    const midpoint = Math.ceil(data.length / 2);
    return [data.slice(0, midpoint), data.slice(midpoint)];
};

// export function BudgetQuotationPrintContent({ budgetQuotaionData }: { budgetQuotaionData: any }): React.JSX.Element {
export function BudgetQuotationPrintContent({ budgetQuotaionData, companyData }: {
    budgetQuotaionData: any;
    companyData?: any;
}): React.JSX.Element {

    const rows = [
        {
            label: "Name:",
            value: budgetQuotaionData?.lead?.name,
        },
        {
            label: "Mobile Number:",
            value: budgetQuotaionData?.lead?.mobile,
        },
        {
            label: "Email:",
            value: budgetQuotaionData?.lead?.email,
        },
        {
            label: "Location:",
            value: budgetQuotaionData?.lead?.location?.name,
        },
        {
            label: "Company:",
            value: budgetQuotaionData?.lead?.company?.name,
        },
        {
            label: "Priority:",
            value: budgetQuotaionData?.lead?.priority_name,
        },
        {
            label: "Created Date:",
            value: moment(budgetQuotaionData?.date).format("DD-MM-YYYY"),
        },
        {
            label: "BD Name:",
            value: budgetQuotaionData?.bdm_name,
        },
        {
            label: "Company Name:",
            value: budgetQuotaionData?.organization_name,
        },
        {
            label: "User:",
            value: budgetQuotaionData?.user?.fullname,
        },
        {
            label: "Assignees:",
            value: budgetQuotaionData?.lead?.assignees?.map((e: any) => e.fullname + ", ")
        },

    ];
    const [leftItems, rightItems] = splitDataIntoColumns(rows);


    const MyDoc = (
        <Document>
            <Page size="A4" style={styles.body}>
                <PDFHeader companyData={companyData} />
                <View style={styles.bid} fixed>
                    <Text style={styles.content}>
                        Budget Quotation
                    </Text>
                    <Text style={styles.companyDetails}>
                        Lead No: {budgetQuotaionData?.lead?.code}
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
                        <Text style={[styles.tableCellHeader, { flex: 1 }]}>Vendors</Text>
                        <Text style={[styles.tableCellHeader, { flex: 1 }]}>Specification</Text>
                    </View>

                    {budgetQuotaionData?.budgetaryquotationitems?.map((item: any, index: number) => (
                        <View style={styles.tableRow}>
                            <Text key={index} style={[styles.tableCell, { flex: 0.5 }]}>{index + 1}</Text>
                            <Text key={index} style={[styles.tableCell, { flex: 2 }]}>{item.item?.name}</Text>
                            <Text key={index} style={[styles.tableCell, { flex: 1 }]}>{parseInt(item.quantity)}</Text>
                            <Text key={index} style={[styles.tableCell, { flex: 1 }]}>{item.unit?.name}</Text>
                            <Text key={index} style={[styles.tableCell, { flex: 1 }]}>{item?.vendors?.map((item: { name: string; id: string }) => {
                                return item?.name;
                            }).join(", ")}</Text>
                            <Text key={index} style={[styles.tableCell, { flex: 1 }]}>{item.item_specifications}</Text>
                        </View>
                    ))}
                </View>
                <PDFFooter />
            </Page>
        </Document>
    );
    return MyDoc;
}