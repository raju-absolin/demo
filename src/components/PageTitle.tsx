import { Box, Typography } from "@mui/material";
import PageMetaData from "./PageMetaData";
import PageBreadcrumb from "./PageBreadCrumb";

type BreadcrumbProps = {
	title: string;
	subName?: string;
	showBreadcrumb?: boolean;
};

const PageTitle = ({ title, subName, showBreadcrumb }: BreadcrumbProps) => {
	return (
		<>
			<PageMetaData title={title} />
			<Box
				height={75}
				display={"flex"}
				justifyContent={"space-between"}
				alignItems={"center"}>
				<Typography variant="h5" color={"text.primary"}>
					{title}
				</Typography>
				{showBreadcrumb && (
					<PageBreadcrumb title={title} subName={subName} />
				)}
			</Box>
		</>
	);
};

export default PageTitle;
