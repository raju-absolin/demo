import { Page, Text, Image, Document, StyleSheet, Font, View } from '@react-pdf/renderer';
import moment from 'moment';
import React, { useEffect } from "react";
import styles from "./pdf";
import { PDFFooter, PDFHeader } from './index';

const splitDataIntoColumns = (data: any) => {
    const midpoint = Math.ceil(data.length / 2);
    return [data.slice(0, midpoint), data.slice(midpoint)];
};

export function CaseSheetPrintContent({
    caseSheetList,
    companyData,
}: {
    caseSheetList: any;
    companyData?: any;
}): React.JSX.Element {
    const rows = [
        {
            label: "Contact Person: ",
            value: caseSheetList?.contact_person,
        },
        {
            label: "Phone: ",
            value: caseSheetList?.phone,
        },
        {
            label: "Email: ",
            value: caseSheetList?.email,
        },
        {
            label: "Company: ",
            value: caseSheetList?.tender?.company?.name,
        },
        {
            label: "Department Name: ",
            value: caseSheetList?.department_name,
        },
        {
            label: "Bid Assign Date & Time: ",
            value: caseSheetList?.tender?.assigned_on
                ? moment(caseSheetList?.tender?.assigned_on).format(
                    "DD-MM-YYYY hh:mm:ss a"
                )
                : ": ",
        },
        {
            label: "Estimated Bid Price: ",
            value: caseSheetList?.estimate_bid_price,
        },
        {
            label: "Pre Bid Subject: ",
            value: caseSheetList?.pre_bid_subject,
        },
        {
            label: "Pre Bid Date: ",
            value: caseSheetList?.pre_bid_date,
        },
        {
            label: "Last Bid Date: ",
            value: moment(caseSheetList?.last_tender_date,).format("DD-MM-YYYY")
        },
        {
            label: "Bid Evaluation Matrix: ",
            value: caseSheetList?.documents_not_submitted_evaluation_matrix,
        },
        {
            label: "Is Extension Request: ",
            value: caseSheetList?.is_extension_request ? "Yes" : "No",
        },
        {
            label: "Is Site Visit: ",
            value: caseSheetList?.is_site_visit ? "Yes" : "No",
        },
        {
            label: "Is Reserve Auction: ",
            value: caseSheetList?.is_reverse_auction ? "Yes" : "No",
        },
        {
            label: "Status: ",
            value: caseSheetList?.status_name,
        },
    ];
    const [leftItems, rightItems] = splitDataIntoColumns(rows);


    const MyDoc = (
        <Document>
            <Page size="A4" style={styles.body}>
                <PDFHeader companyData={companyData} />
                <View style={styles.bid} fixed>
                    <Text style={styles.content}>
                        CaseSheet Details
                    </Text>
                    <Text style={styles.companyDetails}>
                        {/* Bid No: {caseSheetList?.tender?.tender_no} */}
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
                    <Text style={[styles.content1, { textDecoration: 'underline', fontWeight: "bold" }]}>Department Challenges in Bid-Qualification and Specification:-</Text>
                    <Text style={styles.text}>{caseSheetList?.department_challenges}</Text>
                </View>
                <View>
                    <Text style={[styles.content1, { textDecoration: 'underline', fontWeight: "bold", marginTop: "30px" }]}>OEM Challenges (Valid Quote, Authorisation, Tech Compliance, MII, etc):- </Text>
                    <Text style={styles.text}>{caseSheetList?.oem_challenges}</Text>
                </View>
                <View>
                    <Text style={[styles.content1, { textDecoration: 'underline', marginTop: "30px" }]}>Pending Documents from OEM:- </Text>
                    <Text style={styles.text}>{caseSheetList?.pendingdocumentsOEM}</Text>
                </View>
                <View>
                    <Text style={[styles.content1, { textDecoration: 'underline', marginTop: "30px" }]}>Documents Not Submitted Per Bid Evaluation Matrix:- </Text>
                    <Text style={styles.text}>{caseSheetList?.documents_not_submitted_evaluation_matrix}</Text>
                </View>
                <PDFFooter />
            </Page>
        </Document>
    );
    return MyDoc;
}