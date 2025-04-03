import { Page, Text, Image, Document, StyleSheet, Font, View } from '@react-pdf/renderer';
import moment from 'moment';
import React, { useEffect, useState } from "react";
import styles from "./pdf";
import { PDFFooter, PDFHeader } from '.';

const splitDataIntoColumns = (data: any) => {
    const midpoint = Math.ceil(data.length / 2);
    return [data.slice(0, midpoint), data.slice(midpoint)];
};


export function PurchaseOrderPrintContent({ purchaseOrderData, companyData }: { purchaseOrderData: any, companyData: any }): React.JSX.Element {

    const rows = [
        {
            label: "Vendor Name:",
            value: purchaseOrderData?.vendor?.name,
        },
        {
            label: "Vendor Location:",
            value: purchaseOrderData?.vendor?.city?.name,
        },
        {
            label: "Vendor phone:",
            value: purchaseOrderData?.vendor?.mobile,
        },
        {
            label: "Delivery:",
            value: purchaseOrderData?.delivery,
        },
        {
            label: "Transport:",
            value: purchaseOrderData?.transport,
        },
        {
            label: "Payment:",
            value: purchaseOrderData?.payment,
        },
        {
            label: "PO Date:",
            value: purchaseOrderData?.date,
        },
        {
            label: "PO Location:",
            value: purchaseOrderData?.location?.name,
        },
        {
            label: "Quotation Code:",
            value: purchaseOrderData?.quotation?.code,
        },
        {
            label: "Quotation Date:",
            value: moment(purchaseOrderData?.quotation?.date).format("DD-MM-YYYY"),
        },
        {
            label: "Gst Type:",
            value: purchaseOrderData?.gstdetails,
        },
        {
            label: "P & F:",
            value: purchaseOrderData?.pnf,
        },
    ];
    const [leftItems, rightItems] = splitDataIntoColumns(rows);
    let itemTotal = 0;

    const MyDoc = (
        <Document>
            <Page size="A4" style={styles.body}>
                <PDFHeader companyData={companyData} />
                <View style={styles.bid} fixed>
                    <Text style={styles.content}>
                        Purchase Order Details
                    </Text>
                    <Text style={styles.companyDetails}>
                        PO No: {purchaseOrderData?.code}
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
                        <Text style={[styles.tableCellHeader, { flex: 1 }]}>Qty</Text>
                        <Text style={[styles.tableCellHeader, { flex: 1 }]}>Units</Text>
                        <Text style={[styles.tableCellHeader, { flex: 1 }]}>Make</Text>
                        <Text style={[styles.tableCellHeader, { flex: 1.2 }]}>Price</Text>
                        <Text style={[styles.tableCellHeader, { flex: 1 }]}>Discount</Text>
                        <Text style={[styles.tableCellHeader, { flex: 2 }]}>After Discount</Text>
                        <Text style={[styles.tableCellHeader, { flex: 2 }]}>Tax Type</Text>
                        {/* <Text style={[styles.tableCellHeader, { flex: 1 }]}>Tax %</Text> */}
                        <Text style={[styles.tableCellHeader, { flex: 2 }]}>Tax Amt</Text>
                        <Text style={[styles.tableCellHeader, { flex: 2 }]}>Gross Value</Text>
                    </View>

                    {purchaseOrderData?.poitems?.map((item: any, index: number) => {
                        const qty = item?.qty ? +item?.qty : 0;
                        const tem_price = item?.price ? parseFloat(item?.price) : 0;

                        const discount_percentage = item?.discount ? +item?.discount : 0;
                        const discount_amount = (discount_percentage / 100) * tem_price;

                        const price_after_discount = discount_percentage
                            ? parseFloat(`${tem_price - discount_amount}`).toFixed(2)
                            : tem_price;

                        let gross = parseFloat(
                            `${qty * parseFloat(`${price_after_discount}`)}`
                        ).toFixed(2);

                        const taxType = item?.taxtype?.value;

                        const tax_amount =
                            taxType == 2
                                ? item?.tax?.id
                                    ? (item?.tax?.tax / 100) * parseFloat(gross)
                                    : 0
                                : (() => {
                                    const basicValue =
                                        parseFloat(gross) /
                                        ((100 + item?.tax?.tax) / 100);
                                    const taxamt =
                                        (basicValue / 100) * item?.tax?.tax;

                                    gross = parseFloat(
                                        `${taxamt + basicValue}`
                                    ).toFixed(2);
                                    return (basicValue / 100) * item?.tax?.tax;
                                })();

                        const smtotl = parseFloat(gross) + tax_amount;
                        const grosstotal = parseFloat(`${smtotl}`).toFixed(2);
                        itemTotal = itemTotal + Number(grosstotal);
                        return (
                            <><View style={styles.tableRow}>
                                <Text key={index} style={[styles.tableCell, { flex: 0.5 }]}>{index + 1}</Text>
                                <Text key={index} style={[styles.tableCell, { flex: 2 }]}>{item.item?.name}</Text>
                                <Text key={index} style={[styles.tableCell, { flex: 1 }]}>{qty}</Text>
                                <Text key={index} style={[styles.tableCell, { flex: 1 }]}>{item.unit?.name}</Text>
                                <Text key={index} style={[styles.tableCell, { flex: 1 }]}>{item.make?.name}</Text>
                                <Text key={index} style={[styles.tableCell, { flex: 1.2 }]}>{tem_price}</Text>
                                <Text key={index} style={[styles.tableCell, { flex: 1 }]}>{discount_percentage + "% "}</Text>
                                <Text key={index} style={[styles.tableCell, { flex: 2 }]}>{price_after_discount}</Text>
                                <Text key={index} style={[styles.tableCell, { flex: 2 }]}>{item?.taxtype_name}{item?.tax?.tax ? item?.tax?.tax : "N/A"}</Text>
                                {/* <Text key={index} style={[styles.tableCell, { flex: 1 }]}> {item?.tax?.tax ? item?.tax?.tax : "N/A"}</Text> */}
                                <Text key={index} style={[styles.tableCell, { flex: 2 }]}>{tax_amount.toFixed(2)}</Text>
                                <Text key={index} style={[styles.tableCell, { flex: 2 }]}>{grosstotal}</Text>
                            </View>
                            </>
                        )
                    })}
                    <View style={[styles.tableRow, { borderBottomWidth: 0 }]}>
                        <Text style={[styles.tableCell, { flex: 8, borderBottomWidth: 0, textAlign: "left", fontWeight: "bold", fontFamily: "Roboto" }]}>Total:</Text>
                        <Text style={[styles.tableCell, { flex: 0.77, borderBottomWidth: 0, textAlign: "left" }]}>{itemTotal}</Text>
                    </View>
                </View>
                <View style={[styles.tableRow, { borderWidth: 0, borderBottomWidth: 1 }]}>
                    <Text style={[styles.tableCell, { flex: 0.5, borderBottomWidth: 0, borderRightWidth: 0, textAlign: "left", fontSize: 10, fontWeight: "bold", fontFamily: "Roboto" }]}>Description:</Text>
                    <Text style={[styles.tableCell, { flex: 2, borderBottomWidth: 0, borderRightWidth: 0, textAlign: "left" }]}>{purchaseOrderData?.description}</Text>
                </View>
                <View style={[styles.tableRow, { borderBottomWidth: 1 }]}>
                    <Text style={[styles.tableCell, { flex: 0.5, borderBottomWidth: 0, borderRightWidth: 0, textAlign: "left", fontSize: 10, fontWeight: "bold", fontFamily: "Roboto" }]}>Terms & Conditions:</Text>
                    <Text style={[styles.tableCell, { flex: 2, borderBottomWidth: 0, borderRightWidth: 0, textAlign: "left" }]}>{purchaseOrderData?.description}</Text>
                </View>
                <View style={[styles.tableRow, { borderBottomWidth: 1 }]}>
                    <Text style={[styles.tableCell, { flex: 0.5, borderBottomWidth: 0, borderRightWidth: 0, textAlign: "left", fontSize: 10, fontWeight: "bold", fontFamily: "Roboto" }]}>Remarks:</Text>
                    <Text style={[styles.tableCell, { flex: 2, borderBottomWidth: 0, borderRightWidth: 0, textAlign: "left" }]}>{purchaseOrderData?.remarks}</Text>
                </View>
                <PDFFooter />
            </Page>
        </Document>
    );
    return MyDoc;
}