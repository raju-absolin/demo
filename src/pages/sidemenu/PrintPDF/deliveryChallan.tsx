import React from "react";
import {
	Page,
	Text,
	View,
	Document,
	StyleSheet,
	Image,
	Font,
} from "@react-pdf/renderer";
import moment from "moment";

Font.register({
	family: "Roboto",
	src: "/assets/fonts/Roboto-Bold.ttf",
	fontWeight: "bold",
});

const styles = StyleSheet.create({
	page: {
		padding: 0,
		fontSize: 10,
	},
	title: {
		display: "flex",
		flexDirection: "row",
		justifyContent: "space-between",
		fontSize: 16,
		fontWeight: "bold",
		textAlign: "center",
		textTransform: "uppercase",
	},
	header: {
		flexDirection: "row",
		justifyContent: "space-between",
		textAlign: "left",
		marginBottom: 20,
	},
	companyDetails: {
		flex: 1,
		textAlign: "left",
		fontSize: 10,
		padding: 5,
	},
	border: {
		margin: 15,
		flex: 1,
		borderWidth: 1,
		borderColor: "#000",
		padding: 10,
	},
	sectionTitle: {
		fontWeight: "bold",
		marginBottom: 5,
	},
	section: {
		borderWidth: 1,
		marginBottom: 10,
	},
	labelCell: {
		flex: 0.3,
		borderRightWidth: 1,
		borderColor: "#000",
		padding: 5,
		fontWeight: "bold",
	},
	contentCell: {
		flex: 3.8,
	},
	rowbottom: {
		padding: 5,
		borderBottomWidth: 1,
		borderColor: "#000",
	},
	colRight: {
		borderRightWidth: 0,
		marginBottom: 5,
		justifyContent: "space-between",
		flexDirection: "row",
		flex: 0.5,
	},
	row: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginBottom: 5,
		// fontSize: 14,
		fontWeight: "bold",
	},
	table: {
		width: "100%",
		borderWidth: 1,
		height: 300,
		borderColor: "#000",
		borderStyle: "solid",
	},
	tableRow: {
		flexDirection: "row",
		borderBottomWidth: 0,
		borderRightWidth: 0,
		borderColor: "#000",
	},
	tableHeader: {
		fontWeight: "bold",
		backgroundColor: "#f0f0f0",
	},
	tableCell: {
		flex: 1,
		padding: 5,
		fontWeight: "bold",
		fontFamily: "Roboto",
		borderRightWidth: 1,
		borderColor: "#000",
		textAlign: "center",
	},
	tableCol: {
		flex: 1,
		borderRightWidth: 1,
		borderColor: "#000",
		borderStyle: "solid",
		justifyContent: "center", // Vertical alignment
		padding: 5,
		height: 277,
	},
	lastCell: {
		borderBottomWidth: 0,
	},
	RightCell: {
		borderRightWidth: 0,
	},
	footer: {
		marginTop: 20,
		fontSize: 10,
		textAlign: "left",
	},
	image: {
		width: 220,
		height: 60,
		marginRight: 80,
	},
	divide: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		padding: 5,
		marginLeft: 10,
	},
	textContainer: {
		flex: 0.5,
		breakInside: "avoid",
	},
});

export function DeliveryChallanPrintContent({
	dcData,
	companyData,
}: {
	dcData: any;
	companyData: any;
}): React.JSX.Element {
	return (
		<Document>
			<Page size="A4" style={styles.page}>
				<View style={styles.border}>
					<Text style={styles.title}>Delivery Challan</Text>
					<View style={styles.divide} fixed>
						<Image style={styles.image} src={companyData?.logo} />

						<View style={styles.textContainer}>
							{/* <Text style={[styles.row, { textAlign: 'left' }]}>DC No.: {dcData?.code}</Text>
							 */}
							<Text style={[styles.row, { textAlign: "left" }]}>
								<Text
									style={{
										fontWeight: "bold",
										fontFamily: "Roboto",
									}}>
									DC No.:
								</Text>{" "}
								{dcData?.code}
							</Text>
							<Text style={[styles.row, { textAlign: "left" }]}>
								<Text
									style={{
										fontWeight: "bold",
										fontFamily: "Roboto",
									}}>
									Date:{" "}
								</Text>
								{moment(dcData?.date).format("DD-MM-YYYY")}
							</Text>
							<Text style={[styles.row, { textAlign: "left" }]}>
								<Text
									style={{
										fontWeight: "bold",
										fontFamily: "Roboto",
									}}>
									Transport:{" "}
								</Text>
								{dcData?.mode_of_transport}
							</Text>
							<Text style={[styles.row, { textAlign: "left" }]}>
								<Text
									style={{
										fontWeight: "bold",
										fontFamily: "Roboto",
									}}>
									Type:
								</Text>{" "}
								{dcData?.dc_type_name}
							</Text>
							<Text style={[styles.row, { textAlign: "left" }]}>
								<Text
									style={{
										fontWeight: "bold",
										fontFamily: "Roboto",
									}}>
									Truck No.:{" "}
								</Text>
								{dcData?.vehicle_no}
							</Text>
						</View>
					</View>
					<View style={styles.header}>
						<View style={styles.companyDetails}>
							<Text style={styles.row}>
								D.NO.6-22-3, EAST POINT COLONY, VISAKHAPATNAM -
								530 017, (INDIA)
							</Text>
							<Text style={styles.row}>
								Phone: (+91) 891 2729120 | Fax: (+91) 891
								2731481
							</Text>
							<Text style={styles.row}>
								Email: spruce_eg@yahoo.com |
								enquiry@sprucegroup.in
							</Text>
						</View>
					</View>
					<View style={[styles.section]}>
						{/* <Text style={{ borderRight: 1, width: 20, height: 20 }}>M/s:</Text> */}
						<View style={styles.row}>
							<Text
								style={[
									styles.labelCell,
									{
										fontWeight: "bold",
										fontFamily: "Roboto",
									},
								]}>
								M/s:
							</Text>
							<View style={styles.contentCell}>
								<Text style={styles.rowbottom}>
									{dcData?.customer?.name}
								</Text>
								<Text style={styles.rowbottom}>
									{dcData?.customer?.address}
								</Text>
								<Text style={styles.rowbottom}>
									{dcData?.customer?.city?.name}
								</Text>
								<Text style={styles.rowbottom}>
									{dcData?.customer?.state?.name +
										", " +
										dcData?.customer?.state?.country?.name +
										"."}
								</Text>
								<Text
									style={[styles.rowbottom, styles.lastCell]}>
									GSTIN{" "}
									<Text style={styles.RightCell}>
										{dcData?.customer?.gstno}
									</Text>
								</Text>
							</View>
						</View>
					</View>
					<View style={styles.table}>
						<View
							style={[
								styles.tableRow,
								styles.tableHeader,
								{ borderBottomWidth: 1 },
							]}>
							<Text style={[styles.tableCell, { flex: 0.5 }]}>
								S.No.
							</Text>
							<Text style={[styles.tableCell, { flex: 2 }]}>
								Item
							</Text>
							<Text style={[styles.tableCell, { flex: 1 }]}>
								Batch
							</Text>
							<Text style={[styles.tableCell, { flex: 1 }]}>
								Quantity
							</Text>
							<Text style={[styles.tableCell, { flex: 1 }]}>
								Units
							</Text>
							<Text
								style={[
									styles.tableCell,
									styles.lastCell,
									styles.RightCell,
									{ flex: 2 },
								]}>
								Description
							</Text>
						</View>
						{dcData?.dchallan_items?.map(
							(item: any, index: number) => (
								<View style={styles.tableRow}>
									<Text
										style={[
											styles.tableCol,
											{ flex: 0.5 },
										]}>
										{index + 1}
									</Text>
									<Text
										style={[styles.tableCol, { flex: 2 }]}>
										{item?.item?.label}
									</Text>
									<Text
										style={[styles.tableCol, { flex: 1 }]}>
										{item?.batch?.label}
									</Text>
									<Text
										style={[styles.tableCol, { flex: 1 }]}>
										{item?.qty}
									</Text>
									<Text
										style={[styles.tableCol, { flex: 1 }]}>
										{item?.unit?.label}
									</Text>
									<Text
										style={[
											styles.tableCol,
											styles.lastCell,
											styles.RightCell,
											{ flex: 2 },
										]}>
										{item?.description}
									</Text>
								</View>
							)
						)}
					</View>
					<View
						style={[
							{
								borderLeftWidth: 1,
								borderBottomWidth: 1,
								borderRightWidth: 1,
								padding: 5,
								borderColor: "#000",
							},
						]}>
						<Text>
							<Text
								style={{
									fontWeight: "bold",
									fontFamily: "Roboto",
								}}>
								Description:
							</Text>{" "}
							{dcData?.description}
						</Text>
					</View>
					<View style={styles.footer}>
						<Text
							style={{
								marginTop: 20,
								fontWeight: "bold",
								marginBottom: 10,
							}}>
							<Text
								style={{
									fontWeight: "bold",
									fontFamily: "Roboto",
								}}>
								Please Retain{" "}
							</Text>
						</Text>
						<Text
							style={{
								fontWeight: "bold",
								fontFamily: "Roboto",
							}}>
							GSTIN: 37AKCPM8753C1Z5
						</Text>
						<Text
							style={{
								marginTop: 10,
								fontWeight: "bold",
								textAlign: "right",
								fontFamily: "Roboto",
							}}>
							Authorised Signatory
						</Text>
						<Text
							style={{
								marginTop: 10,
								fontWeight: "bold",
								textAlign: "right",
								fontFamily: "Roboto",
							}}>
							For SPRUCE Eng. Co.
						</Text>
					</View>
					, fontFamily:"Roboto"
				</View>
			</Page>
		</Document>
	);
}
