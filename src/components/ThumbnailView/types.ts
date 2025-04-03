export interface Order {
	id: string;
	department: string;
	company: string;
	product: string;
	tenderType: string;
	orderNo: string;
	status: string;
	statusColor: "error" | "success" | "warning" | "primary";
	category: string;
	type: string;

	project: string;
	productType: string;
	tenderDate: string;
	tenderNumber: string;
	tenderNature: string;
}

export interface OrderCardProps {
	order: Order;
	onSelect: () => void;
}
