import React, { ReactNode, useRef, useState } from "react";
import "react-quill/dist/quill.snow.css";
import { Page, Text, Image, Document, View } from '@react-pdf/renderer';
import styles from "./pdf";

export const PDFHeader = ({ companyData }: { companyData: any }) => {

    return (
        <View style={styles.header} fixed>
            <Image style={styles.image} src={companyData?.logo} />
            <Text style={styles.companyDetails}>
                GST No: {companyData?.gstno}
            </Text>
        </View>
    );
};

export const PDFFooter = () => {

    return (
        <View style={styles.footer} fixed>
            <View style={styles.footerLogo}>
            </View>
            <Text style={styles.footerText}>
                # 6-22-3, East Point Colony, Visakhapatnam – 530 017, Andhra Pradesh (INDIA)
                {"\n"}Phone:(+91) 891 2729120 ; Fax :(+91) 891 2731481
                {"\n"}Email: enquiry@sprucegroup.in ; spruce_e@yahoo.com ; Website: www.sprucegroup.in
            </Text>
            <Text style={styles.footerPageNumber} render={({ pageNumber, totalPages }) => (
                `Page ${pageNumber} of ${totalPages}`
            )} />
        </View>

    );
};
