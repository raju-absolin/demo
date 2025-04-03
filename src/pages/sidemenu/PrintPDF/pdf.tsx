import React, { useState } from 'react';
import { Page, Text, Image, Document, StyleSheet, Font, View } from '@react-pdf/renderer';

Font.register({
    family: 'Roboto',
    src: "/assets/fonts/Roboto-Bold.ttf",
    fontWeight: 'bold'
});
const PDFStyles = StyleSheet.create({
    body: {
        paddingTop: 80,
        paddingBottom: 50,
        paddingHorizontal: 35,
    },
    header: {
        position: 'absolute',
        top: 20,
        left: 35,
        right: 35,
        height: 60,
        textAlign: 'center',
        borderBottom: '1 solid #EAD213',
        fontSize: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        bottom: 10
    },
    text: {
        fontSize: 10,
        // fontWeight: 'bold',
        // fontFamily: 'Roboto',
        marginLeft: 10,
        textAlign: 'justify',
    },
    content1: {
        fontSize: 11,
        fontFamily: 'Roboto',
        fontWeight: 'bold',
        margin: 10,
        textAlign: 'justify',
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
    footer: {
        position: 'absolute',
        bottom: 20,
        left: 35,
        right: 35,
        textAlign: 'center',
        fontSize: 9,
        paddingTop: 10,
    },
    footerLogo: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 5,
    },
    footerImage: {
        width: 30,
        height: 30,
        marginRight: 5,
    },
    footerText: {
        fontSize: 10,
        borderTop: '1 solid #EAD213',
        textAlign: 'center',
        paddingTop: 10,
        bottom: 5,
    },
    footerPageNumber: {
        fontSize: 9,
        textAlign: 'right',
    },
    pageNumber: {
        fontSize: 10,
    },
    image: {
        width: 200,
        height: 60,
        bottom: 10
    },
    companyDetails: {
        fontSize: 10,
        fontFamily: 'Roboto',
        fontWeight: 'bold',
        textAlign: 'left',
    },
    content: {
        fontSize: 14,
        fontFamily: 'Roboto',
        fontWeight: 'bold',
        margin: 10,
        textAlign: 'justify',
    },
    footercontent: {
        fontSize: 12,
        margin: 10,
        textAlign: 'justify',
    },
    // tableRow: {
    //     flexDirection: 'row',
    //     justifyContent: 'space-between',
    //     marginVertical: 5,
    // },
    column: {
        flex: 1,
        paddingHorizontal: 10,
    },
    itemRow: {
        flexDirection: 'row',
        marginBottom: 5,
    },
    labelCell: {
        flex: 1,
        fontSize: 10,
        fontFamily: 'Roboto',
        fontWeight: 'bold',
        textAlign: 'left',
        paddingRight: 8,
        width: '100%',
        marginLeft: 10
    },
    valueCell: {
        flex: 1,
        fontWeight: 400,
        fontSize: 10,
        textAlign: 'left',
    },
    tablefeilds: {
        width: '100%',
        padding: 8,
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: 'grey',
        borderRadius: 5,
        marginTop: 20,
    },
    table: {
        width: '100%',
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: 'grey',
        borderRadius: 5,
        marginTop: 10,
    },
    tableRow: {
        flexDirection: 'row',
        breakInside: 'avoid',        
    },
    tableCell: {
        padding: 8,
        borderBottom: '1 solid grey',
        borderRight: '1 solid grey',
        textAlign: 'left',
        fontSize: 10,
        flex: 1,
    },
    tableCellHeader: {
        padding: 8,
        borderBottom: '1 solid grey',
        borderRight: '1 solid grey',
        textAlign: 'center',
        fontFamily: 'Roboto',
        fontSize: 10,
        fontWeight: 'bold',
        flex: 1,
    },
    tableCellWithBorder: {
        padding: 8,
        borderBottom: '1 solid grey',
        borderRight: '1 solid grey',
        textAlign: 'left',
        flex: 1,
    },
});

export default PDFStyles;
