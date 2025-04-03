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

const splitDataIntoColumns = (data: any) => {
	const midpoint = Math.ceil(data.length / 2);
	return [data.slice(0, midpoint), data.slice(midpoint)];
};

export function PurchaseQuotationPrintContent({
	purchaseQuotationData,
	companyData,
}: {
	purchaseQuotationData: any;
	companyData: any;
}): React.JSX.Element {
	const rows = [
		{
			label: "Created On:",
			value: purchaseQuotationData?.created_on,
		},
		{
			label: "Delivery Date:",
			value: moment(purchaseQuotationData?.deliverydate).format(
				"DD-MM-YYYY"
			),
		},
		{
			label: "PE Code:",
			value: purchaseQuotationData?.purchase_enquiry?.name,
		},
		{
			label: "Vendor:",
			value: purchaseQuotationData?.vendor?.name,
		},
		{
			label: "Project:",
			value: purchaseQuotationData?.project?.name,
		},
	];
	const [leftItems, rightItems] = splitDataIntoColumns(rows);

	const MyDoc = (
		<Document>
			<Page size="A4" style={styles.body}>
				<PDFHeader companyData={companyData} />

				<View style={styles.bid} fixed>
					<Text style={styles.content}>Purchase Quotation</Text>
					<Text style={styles.companyDetails}>
						PQ Code : {purchaseQuotationData?.code}
					</Text>
				</View>
				<View style={styles.tablefeilds}>
					<View style={styles.tableRow}>
						<View style={styles.column}>
							{leftItems.map((item: any, index: number) => (
								<View
									style={styles.itemRow}
									key={`left-${index}`}>
									<Text style={styles.labelCell}>
										{item.label}
									</Text>
									<Text style={styles.valueCell}>
										{item.value}
									</Text>
								</View>
							))}
						</View>
						<View style={styles.column}>
							{rightItems.map((item: any, index: number) => (
								<View
									style={styles.itemRow}
									key={`right-${index}`}>
									<Text style={styles.labelCell}>
										{item.label}
									</Text>
									<Text style={styles.valueCell}>
										{item.value}
									</Text>
								</View>
							))}
						</View>
					</View>
				</View>
				<View style={styles.table}>
					<View style={styles.tableRow}>
						<Text style={[styles.tableCellHeader, { flex: 0.4 }]}>
							SI No
						</Text>
						<Text style={[styles.tableCellHeader, { flex: 2 }]}>
							Item
						</Text>
						<Text style={[styles.tableCellHeader, { flex: 1 }]}>
							Qty
						</Text>
						<Text style={[styles.tableCellHeader, { flex: 1 }]}>
							Units
						</Text>
						<Text style={[styles.tableCellHeader, { flex: 1 }]}>
							Make
						</Text>
						<Text style={[styles.tableCellHeader, { flex: 1.2 }]}>
							Price
						</Text>
						<Text style={[styles.tableCellHeader, { flex: 1 }]}>
							Discount
						</Text>
						<Text style={[styles.tableCellHeader, { flex: 2 }]}>
							After Discount
						</Text>
						<Text style={[styles.tableCellHeader, { flex: 1.9 }]}>
							Tax Type
						</Text>
						<Text style={[styles.tableCellHeader, { flex: 2 }]}>
							Tax Amt
						</Text>
						<Text style={[styles.tableCellHeader, { flex: 2 }]}>
							Total
						</Text>
					</View>

					{purchaseQuotationData?.quotationitems?.map(
						(item: any, index: number) => {
							const qty = item?.qty ? +item?.qty : 0;
							const tem_price = item?.price
								? parseFloat(item?.price)
								: 0;

							const discount_percentage = item?.discount
								? +item?.discount
								: 0;
							const discount_amount =
								(discount_percentage / 100) * tem_price;

							const price_after_discount = discount_percentage
								? parseFloat(
										`${tem_price - discount_amount}`
									).toFixed(2)
								: tem_price;

							let gross = parseFloat(
								`${qty * parseFloat(`${price_after_discount}`)}`
							).toFixed(2);

							const taxType = item?.taxtype?.value;

							const tax_amount =
								taxType == 2
									? item?.tax?.id
										? (item?.tax?.tax / 100) *
											parseFloat(gross)
										: 0
									: (() => {
											const basicValue =
												parseFloat(gross) /
												((100 + item?.tax?.tax) / 100);
											const taxamt =
												(basicValue / 100) *
												item?.tax?.tax;

											gross = parseFloat(
												`${taxamt + basicValue}`
											).toFixed(2);
											return (
												(basicValue / 100) *
												item?.tax?.tax
											);
										})();

							const smtotl = parseFloat(gross) + tax_amount;
							const total = parseFloat(`${smtotl}`).toFixed(2);
							return (
								<View style={styles.tableRow}>
									<Text
										key={index}
										style={[
											styles.tableCell,
											{ flex: 0.4 },
										]}>
										{index + 1}
									</Text>
									<Text
										key={index}
										style={[styles.tableCell, { flex: 2 }]}>
										{item.item?.name}
									</Text>
									<Text
										key={index}
										style={[styles.tableCell, { flex: 1 }]}>
										{qty}
									</Text>
									<Text
										key={index}
										style={[styles.tableCell, { flex: 1 }]}>
										{item.unit?.name}
									</Text>
									<Text
										key={index}
										style={[styles.tableCell, { flex: 1 }]}>
										{item.make?.label}
									</Text>
									<Text
										key={index}
										style={[
											styles.tableCell,
											{ flex: 1.2 },
										]}>
										{tem_price}
									</Text>
									<Text
										key={index}
										style={[styles.tableCell, { flex: 1 }]}>
										{discount_percentage + "% "}
									</Text>
									<Text
										key={index}
										style={[styles.tableCell, { flex: 2 }]}>
										{price_after_discount}
									</Text>
									<Text
										key={index}
										style={[
											styles.tableCell,
											{ flex: 1.9 },
										]}>
										{item?.taxtype_name + " ("}
										{(item?.tax?.tax
											? item?.tax?.tax
											: "N/A") + "%)"}{" "}
									</Text>
									<Text
										key={index}
										style={[styles.tableCell, { flex: 2 }]}>
										{tax_amount.toFixed(2)}
									</Text>
									<Text
										key={index}
										style={[styles.tableCell, { flex: 2 }]}>
										{total}
									</Text>
								</View>
							);
						}
					)}
				</View>
				<PDFFooter />
			</Page>
		</Document>
	);
	return MyDoc;
}
