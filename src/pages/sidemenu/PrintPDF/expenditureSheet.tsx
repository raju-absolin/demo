import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer';
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
        fontWeight: "bold",
        fontFamily: "Roboto",
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
    sectionTitle: {
        fontWeight: 'bold',
        marginBottom: 5,
    },
    section: {
        borderWidth: 1,
        marginBottom: 10,
    },
    labelCell: {
        flex: 1.5,
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
        top: 10,
        borderColor: '#000',
        borderStyle: 'solid',
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderRightWidth: 0,
        borderColor: '#000',
    },
    tableHeader: {
        fontWeight: 'bold',
    },
    tableCell: {
        flex: 1,
        padding: 5,
        borderRightWidth: 1,
        borderColor: '#000',
        textAlign: 'center',
    },
    tableCol: {
        flex: 1,
        borderRightWidth: 1,
        borderColor: '#000',
        borderStyle: 'solid',
        justifyContent: 'center',
        padding: 5,
    },
    lastCell: {
        borderBottomWidth: 0,
    },
    RightCell: {
        borderRightWidth: 0,
    },
    footer: {
        position: 'absolute',
        bottom: 20,
        left: 5,
        right: 5,
        textAlign: 'center',
        fontSize: 9,
        paddingTop: 10,
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
    mergedCell: {
        borderBottomWidth: 0,
        fontWeight: 'bold',
    },
});

export function ExpenditureSheetPrintContent({ expenditureSheetData }: { expenditureSheetData: any }): React.JSX.Element {
    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.border}>
                    <Text style={styles.title}>EXPENSES CLAIM FORM</Text>
                    <View style={styles.table}>
                        <View style={[styles.tableRow, styles.tableHeader, { borderBottomWidth: 1, fontFamily: "Roboto", fontWeight: "bold" }]}>
                            <Text style={[styles.tableCell, styles.mergedCell, { flex: 2 }]}></Text>
                            <Text style={[styles.tableCell, { flex: 1 }]}>Date</Text>
                            <Text style={[styles.tableCell, { flex: 1 }]}>Amount</Text>
                            <Text style={[styles.tableCell, styles.lastCell, styles.RightCell, { flex: 3 }]}>Mode of Payment: Online/Cash/Other</Text>
                        </View>
                        <View style={[styles.tableRow, styles.tableHeader, { borderBottomWidth: 1 }]}>
                            <Text style={[styles.tableCell, styles.mergedCell, { flex: 2, borderBottomWidth: 0 }]}>
                                <Text style={{ fontWeight: 'bold', fontFamily: "Roboto" }}>Received Amount:</Text></Text>
                            <Text style={[styles.tableCell, { flex: 1 }]}>{expenditureSheetData?.date}</Text>
                            <Text style={[styles.tableCell, { flex: 1 }]}>{expenditureSheetData?.received_amount}</Text>
                            <Text style={[styles.tableCell, styles.lastCell, styles.RightCell, { flex: 3 }]}>{expenditureSheetData?.mode_of_payment_name}</Text>
                        </View>
                        <View style={[styles.tableRow, styles.tableHeader, { borderBottomWidth: 1 }]}>
                            <Text style={[styles.tableCell, { flex: 2, borderBottomWidth: 0, }]}> </Text>
                            <Text style={[styles.tableCell, { flex: 1, }]}></Text>
                            <Text style={[styles.tableCell, { flex: 1, }]}></Text>
                            <Text style={[styles.tableCell, styles.lastCell, styles.RightCell, { flex: 3 }]}></Text>
                        </View>
                        <View style={[styles.tableRow, styles.tableHeader, { borderBottomWidth: 1 }]}>
                            <Text style={[styles.tableCell, { flex: 3.28, borderBottomWidth: 0, }]}>
                                <Text style={{ fontWeight: 'bold', fontFamily: "Roboto" }}>Name of the Employee:</Text></Text>
                            <Text style={[styles.tableCell, { flex: 2 }]}>{expenditureSheetData?.employee_name}</Text>
                            <Text style={[styles.tableCell, { flex: 1 }]}>
                                <Text style={{ fontWeight: 'bold', fontFamily: "Roboto" }}>Emp. UIC No.:</Text></Text>
                            <Text style={[styles.tableCell, styles.lastCell, styles.RightCell, { flex: 1 }]}></Text>
                        </View>
                        <View style={[styles.tableRow, styles.tableHeader, { borderBottomWidth: 1 }]}>
                            <Text style={[styles.tableCell, { flex: 3.25, borderBottomWidth: 0, }]}>
                                <Text style={{ fontWeight: 'bold', fontFamily: "Roboto" }}>Place of Visit & Purpose:</Text></Text>
                            <Text style={[styles.tableCell, { flex: 2, borderRightWidth: 0 }]}></Text>
                            <Text style={[styles.tableCell, { flex: 1, borderRightWidth: 0 }]}></Text>
                            <Text style={[styles.tableCell, styles.lastCell, styles.RightCell, { flex: 1 }]}></Text>
                        </View>
                        <View style={[styles.tableRow, styles.tableHeader, { borderBottomWidth: 1 }]}>
                            <Text style={[styles.tableCell, { flex: 0.5, borderBottomWidth: 0, }]}>
                                <Text style={{ fontWeight: 'bold', fontFamily: "Roboto" }}>S. No.</Text></Text>
                            <Text style={[styles.tableCell, { flex: 1.45, }]}>
                                <Text style={{ fontWeight: 'bold', fontFamily: "Roboto" }}>Date</Text></Text>
                            <Text style={[styles.tableCell, { flex: 1, }]}>
                                <Text style={{ fontWeight: 'bold', fontFamily: "Roboto" }}>Type of{"\n"} Expenditure</Text>
                            </Text>
                            <Text style={[styles.tableCell, { flex: 2, }]}>
                                <Text style={{ fontWeight: 'bold', fontFamily: "Roboto" }}> Particulars in detail </Text></Text>
                            <Text style={[styles.tableCell, { flex: 1, }]}>
                                <Text style={{ fontWeight: 'bold', fontFamily: "Roboto" }}>Amount</Text></Text>
                            <Text style={[styles.tableCell, styles.lastCell, styles.RightCell, { flex: 1 }]}>
                                <Text style={{ fontWeight: 'bold', fontFamily: "Roboto" }}>Remarks</Text></Text>
                        </View>
                        {expenditureSheetData?.expendituresheetitems?.map((item: any, index: number) => (
                            <View style={[styles.tableRow, styles.tableHeader]}>
                                <Text style={[styles.tableCell, { flex: 0.5, borderBottomWidth: 0, }]}>{index + 1} </Text>
                                <Text style={[styles.tableCell, { flex: 1.45, }]}>{moment(item?.approved_on).format("DD-MM-YYYY")}</Text>
                                <Text style={[styles.tableCell, { flex: 1, }]}>{item.expendituretype?.name}</Text>
                                <Text style={[styles.tableCell, { flex: 2, }]}>{item?.description}</Text>
                                <Text style={[styles.tableCell, { flex: 1, }]}>{item?.amount}</Text>
                                <Text style={[styles.tableCell, styles.RightCell, { flex: 1, borderBottomWidth: 0, }]}>{item?.remarks}</Text>
                            </View>
                        ))}
                        <View style={[styles.tableRow, styles.tableHeader, { borderBottomWidth: 1 }]}>
                            <Text style={[styles.tableCell, { flex: 3.03, borderBottomWidth: 0, }]}>
                                <Text style={{ fontWeight: 'bold', fontFamily: "Roboto" }}>Signature of Employee</Text></Text>
                            <Text style={[styles.tableCell, { flex: 1.85 }]}>
                                <Text style={{ fontWeight: 'bold', fontFamily: "Roboto" }}>Checked by</Text></Text>
                            <Text style={[styles.tableCell, styles.lastCell, styles.RightCell, { flex: 2 }]}>
                                <Text style={{ fontWeight: 'bold', fontFamily: "Roboto" }}> Authorised by</Text></Text>
                        </View>
                        <View style={[styles.tableRow, styles.tableHeader, { borderBottomWidth: 0 }]}>
                            <Text style={[styles.tableCell, { flex: 3.03, borderBottomWidth: 0, textAlign: "left" }]}>
                                <Text style={{ fontWeight: 'bold', fontFamily: "Roboto" }}>Date:</Text></Text>
                            <Text style={[styles.tableCell, { flex: 1.85, textAlign: "left" }]}>
                                <Text style={{ fontWeight: 'bold', fontFamily: "Roboto" }}>Date:</Text>
                            </Text>
                            <Text style={[styles.tableCell, styles.lastCell, styles.RightCell, { flex: 2, textAlign: "left" }]}>
                                <Text style={{ fontWeight: 'bold', fontFamily: "Roboto" }}>Date:</Text></Text>
                        </View>
                    </View>
                    {/* <View style={styles.footer} fixed>
                        <View style={[styles.table]}>
                        </View>
                    </View> */}
                </View>
            </Page>
        </Document >
    )
};
