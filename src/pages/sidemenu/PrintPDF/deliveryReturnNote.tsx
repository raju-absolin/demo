import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image, Font } from '@react-pdf/renderer';
import moment from 'moment';

Font.register({
    family: 'Roboto',
    src: "/assets/fonts/Roboto-Bold.ttf",
    fontWeight: 'bold'
});

const styles = StyleSheet.create({
    page: {
        padding: 0,
        fontSize: 10,
    },
    title: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        fontSize: 14,
        textAlign: 'center',
        textTransform: 'uppercase',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        textAlign: 'left',
        marginBottom: 20,
    },
    companyDetails: {
        flex: 1,
        textAlign: 'left',
        fontSize: 10,
        padding: 5,
    },
    border: {
        margin: 15,
        flex: 1,
        borderWidth: 1,
        borderColor: '#000',
        padding: 10,
    },
    bid: {
        top: 5,
        left: 0,
        right: 0,
        height: 20,
        textAlign: 'center',
        fontSize: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    content: {
        fontSize: 10,
        fontWeight: 'bold',
        margin: 10,
        bottom: 10,
        textAlign: 'justify',
    },
    labelCell: {
        flex: 0.3,
        borderRightWidth: 1,
        borderColor: '#000',
        padding: 5,
        fontWeight: 'bold',
    },
    contentCell: {
        flex: 3.8,
    },
    rowbottom: {
        padding: 5,
        borderBottomWidth: 1,
        borderColor: '#000',
    },
    colRight: {
        borderRightWidth: 0,
        marginBottom: 5,
        justifyContent: 'space-between',
        flexDirection: 'row',
        flex: 0.5
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
        // fontSize: 14,
        fontWeight: 'bold',
    },
    table: {
        width: '100%',
        borderWidth: 1,
        height: 300,
        borderColor: '#000',
        borderStyle: 'solid',
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 0,
        borderRightWidth: 0,

        borderColor: '#000',
    },
    tableHeader: {
        fontWeight: 'bold',
        backgroundColor: '#f0f0f0',
    },
    tableCell: {
        flex: 1,
        padding: 5,
        fontWeight: 'bold',
        fontFamily: "Roboto",
        borderRightWidth: 1,
        borderColor: '#000',
        textAlign: 'center',
    },
    tableCol: {
        flex: 1,
        borderRightWidth: 1,
        borderColor: '#000',
        borderStyle: 'solid',
        justifyContent: 'center', // Vertical alignment
        padding: 5,
        height: 277
    },
    lastCell: {
        borderBottomWidth: 0,
    },
    RightCell: {
        borderRightWidth: 0,
    },
    footer: {
        marginTop: 30,
        fontSize: 10,
        textAlign: 'left',
    },
    image: {
        width: 220,
        height: 60,
        marginRight: 80
    },
    divide: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 5,
        marginLeft: 10
    },
    textContainer: {
        flex: 0.5,
        breakInside: 'avoid',
    },
});

export function DRNPrintContent({ drnData, companyData }: { drnData: any, companyData: any }): React.JSX.Element {

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.border}>
                    <Text style={styles.title}>
                        <Text style={{ fontWeight: 'bold', fontFamily: "Roboto" }}>Delivery Note Return</Text></Text>
                    <View style={styles.divide} fixed>
                        <Image style={styles.image} src={companyData?.logo} />

                        <View style={styles.textContainer}>
                            <Text style={[styles.row, { textAlign: 'left' }]}>
                                <Text style={{ fontWeight: 'bold', fontFamily: "Roboto" }}>DRN No.:</Text> {drnData?.code}</Text>
                            <Text style={[styles.row, { textAlign: 'left' }]}>
                                <Text style={{ fontWeight: 'bold', fontFamily: "Roboto" }}>Date: </Text>{moment(drnData?.date).format("DD-MM-YYYY")}</Text>
                        </View>
                    </View>
                    <View style={styles.header}>
                        <View style={styles.companyDetails}>
                            <Text style={styles.row}>D.NO.6-22-3, EAST POINT COLONY, VISAKHAPATNAM - 530 017, (INDIA)</Text>
                            <Text style={styles.row}>Phone: (+91) 891 2729120 | Fax: (+91) 891 2731481</Text>
                            <Text style={styles.row}>Email: spruce_eg@yahoo.com | enquiry@sprucegroup.in</Text>
                        </View>
                    </View>
                    <View style={styles.bid} fixed>
                        <Text style={styles.content}>
                            <Text style={{ fontWeight: 'bold', fontFamily: "Roboto" }}> Location:</Text> {drnData?.location?.name}
                        </Text>
                        <Text style={styles.content}>
                            <Text style={{ fontWeight: 'bold', fontFamily: "Roboto" }}> Warehouse :</Text> {drnData?.warehouse?.name}
                        </Text>
                    </View>
                    <View style={styles.table}>
                        <View style={[styles.tableRow, styles.tableHeader, { borderBottomWidth: 1 }]}>
                            <Text style={[styles.tableCell, { flex: 0.5 }]}>S.No.</Text>
                            <Text style={[styles.tableCell, { flex: 2 }]}>Item</Text>
                            <Text style={[styles.tableCell, { flex: 1 }]}>Quantity</Text>
                            <Text style={[styles.tableCell, { flex: 1 }]}>Units</Text>
                            <Text style={[styles.tableCell, styles.lastCell, styles.RightCell, { flex: 2 }]}>Description</Text>
                        </View>
                        {drnData?.deliveryreturnnotesitems?.map((item: any, index: number) => (
                            <View style={styles.tableRow}>
                                <Text style={[styles.tableCol, { flex: 0.5 }]}>{index + 1}</Text>
                                <Text style={[styles.tableCol, { flex: 2 }]}>{item?.item?.label}</Text>
                                <Text style={[styles.tableCol, { flex: 1 }]}>{item?.qty}
                                </Text>
                                <Text style={[styles.tableCol, { flex: 1 }]}>{item?.unit?.label}</Text>
                                <Text style={[styles.tableCol, styles.lastCell, styles.RightCell, { flex: 2 }]}>{item?.description}</Text>
                            </View>
                        ))}
                    </View>

                    <View style={[{ borderLeftWidth: 1, borderBottomWidth: 1, borderRightWidth: 1, padding: 5, borderColor: '#000', }]}>
                        <Text> <Text style={{ fontWeight: 'bold', fontFamily: "Roboto" }}>Description:</Text> {drnData?.description}</Text>
                    </View>

                    <View style={styles.footer}>
                        <Text style={{ marginTop: 30, fontWeight: 'bold', marginBottom: 10 }}>
                            <Text style={{ fontWeight: 'bold', fontFamily: "Roboto" }}>Please Retain</Text></Text>
                        <Text style={{ fontWeight: 'bold', fontFamily: "Roboto" }}>GSTIN: {companyData?.gstno}</Text>
                        <Text style={{ marginTop: 40, fontWeight: 'bold', textAlign: "right" }}>
                            <Text style={{ fontWeight: 'bold', fontFamily: "Roboto" }}>Authorised Signatory</Text></Text>
                        <Text style={{ marginTop: 10, fontWeight: 'bold', textAlign: "right" }}>
                            <Text style={{ fontWeight: 'bold', fontFamily: "Roboto" }}>For SPRUCE Eng. Co.</Text></Text>
                    </View>
                </View>
            </Page>
        </Document>
    )
};
