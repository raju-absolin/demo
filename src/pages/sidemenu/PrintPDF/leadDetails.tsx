import { Page, Text, Image, Document, StyleSheet, Font, View } from '@react-pdf/renderer';
import moment from 'moment';
import React, { useEffect } from "react";
import styles from "./pdf";
import { PDFFooter, PDFHeader } from '.';

const splitDataIntoColumns = (data: any) => {
    const midpoint = Math.ceil(data.length / 2);
    return [data.slice(0, midpoint), data.slice(midpoint)];
};

export function LeadPrintContent({
    leadData,
    companyData,
}: {
    leadData: any;
    companyData?: any;
}): React.JSX.Element {

    const rows = [
        {
            label: "Priority:",
            value: leadData.priority_name,
        },
        {
            label: "Name:",
            value: leadData?.name,
        },
        {
            label: "Mobile Number:",
            value: leadData?.mobile,
        },
        {
            label: "Email:",
            value: leadData?.email,
        },
        {
            label: "Location:",
            value: leadData?.location?.name,
        },
        {
            label: "Company:",
            value: leadData?.company?.name,
        },
        {
            label: "Customer:",
            value: leadData?.customer?.name,
        },
        {
            label: "Created On:",
            value: leadData?.created_on,
        },
        {
			label: "Pre Qualification Criteria",
			value: leadData?.pre_qualification_criteria,
		},
		{
			label: "Pre Qualification Requirement",
			value: leadData?.pre_qualification_requirement,
		},
        {
            label: "Assignees:",
            value: leadData?.assignees?.map((e: any) => e.fullname + ", ")
        },
    ];
    const [leftItems, rightItems] = splitDataIntoColumns(rows);


    const MyDoc = (
        <Document>
            <Page size="A4" style={styles.body}>
               <PDFHeader companyData={companyData} />
                <View style={styles.bid} fixed>
                    <Text style={styles.content}>
                        Lead Details
                    </Text>
                    <Text style={styles.companyDetails}>
                        Lead No: {leadData?.code}
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
                        <Text style={[styles.tableCellHeader, { flex: 2 }]}>Lead Item</Text>
                        <Text style={[styles.tableCellHeader, { flex: 1 }]}>Quantity</Text>
                        <Text style={[styles.tableCellHeader, { flex: 1 }]}>Unit</Text>
                        <Text style={[styles.tableCellHeader, { flex: 1 }]}>Vendors</Text>
                        <Text style={[styles.tableCellHeader, { flex: 1 }]}>Specification</Text>
                    </View>

                    {leadData?.lead_items?.map((item: any, index: number) => (
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