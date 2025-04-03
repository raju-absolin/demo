import {
	Page,
	Text,
	Image,
	Document,
	StyleSheet,
	Font,
	View,
} from "@react-pdf/renderer";
import moment from "moment";
import React, { useEffect } from "react";
import styles from "./pdf";
import { PDFFooter, PDFHeader } from ".";

export function ReverseAuctionContent({
	reverseAuctionData,
	companyData,
}: {
	reverseAuctionData: any;
	companyData?: any;
}): React.JSX.Element {
	const MyDoc = (
		<Document>
			<Page size="A4" style={styles.body}>
				<PDFHeader companyData={companyData} />
				<View>
					<Text
						style={{
							fontSize: 16,
							fontFamily: "Roboto",
							fontWeight: "bold",
							textAlign: "center",
							margin: 10,
						}}>
						Reverse Auction Details
					</Text>
				</View>
				<View style={styles.table}>
					<View style={styles.tableRow}>
						<Text style={[styles.tableCellHeader, { flex: 0.3 }]}>
							SI No
						</Text>
						<Text style={[styles.tableCellHeader, { flex: 2 }]}>
							Date
						</Text>
						<Text style={[styles.tableCellHeader, { flex: 2 }]}>
							Bid Item
						</Text>
						<Text style={[styles.tableCellHeader, { flex: 1.5 }]}>
							Landing {"\n"}Cost
						</Text>
						<Text style={[styles.tableCellHeader, { flex: 1 }]}>
							Discount
						</Text>
						<Text style={[styles.tableCellHeader, { flex: 1 }]}>
							Margin (%)
						</Text>
						<Text style={[styles.tableCellHeader, { flex: 1 }]}>
							Margin Amt
						</Text>
						<Text style={[styles.tableCellHeader, { flex: 1 }]}>
							GST (%)
						</Text>
						<Text style={[styles.tableCellHeader, { flex: 1 }]}>
							GST Amnt
						</Text>
						<Text style={[styles.tableCellHeader, { flex: 1.5 }]}>
							Landing{"\n"} Cost Total
						</Text>
						<Text style={[styles.tableCellHeader, { flex: 1 }]}>
							Total
						</Text>
					</View>

					{reverseAuctionData?.map((row: any, index: number) => (
						<View style={styles.tableRow}>
							<Text
								key={index}
								style={[styles.tableCell, { flex: 0.3 }]}>
								{index + 1}
							</Text>
							<Text
								key={index}
								style={[styles.tableCell, { flex: 2 }]}>
								{row?.created_on}
							</Text>
							<Text
								key={index}
								style={[styles.tableCell, { flex: 2 }]}>
								{row?.tender_item_master?.name}
							</Text>
							<Text
								key={index}
								style={[styles.tableCell, { flex: 1.5 }]}>
								{Number(row?.landing_cost)}
							</Text>
							<Text
								key={index}
								style={[styles.tableCell, { flex: 1 }]}>
								{Number(row?.discount_landing_cost)}
							</Text>
							<Text
								key={index}
								style={[styles.tableCell, { flex: 1 }]}>
								{Number(row?.landing_cost_margin)}
							</Text>
							<Text
								key={index}
								style={[styles.tableCell, { flex: 1 }]}>
								{Number(row?.landing_cost_margin_amount)}
							</Text>
							<Text
								key={index}
								style={[styles.tableCell, { flex: 1 }]}>
								{Number(row?.landing_cost_gst)}
							</Text>
							<Text
								key={index}
								style={[styles.tableCell, { flex: 1 }]}>
								{Number(row?.landing_cost_gst_amount)}
							</Text>
							<Text
								key={index}
								style={[styles.tableCell, { flex: 1.5 }]}>
								{Number(row?.landing_cost_total)}
							</Text>
							<Text
								key={index}
								style={[styles.tableCell, { flex: 1 }]}>
								{Number(row?.total)}
							</Text>
						</View>
					))}
				</View>
				<PDFFooter />
			</Page>
		</Document>
	);
	return MyDoc;
}
