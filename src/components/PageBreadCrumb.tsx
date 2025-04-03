import { Box, Breadcrumbs, Link, Typography } from "@mui/material";
import PageMetaData from "./PageMetaData";
import { LuChevronRight } from "react-icons/lu";

type BreadcrumbProps = {
	title: any;
	subName?: string;
	path?: string;
};

const PageBreadcrumb = ({ title, subName, path }: BreadcrumbProps) => {
	const breadcrumbItems = [
		<Link
			key="2"
			color="inherit"
			variant="body2"
			underline="none"
			href={path ? path : "/"}>
			{subName}
		</Link>,
		<Typography key="3" variant="body2">
			{title}
		</Typography>,
	];

	return (
		<>
			<PageMetaData title={title} />
			<Box
				display={"flex"}
				justifyContent={"space-between"}
				alignItems={"center"}>
				<Typography variant="h5" color={"text.primary"}>
					{title}
				</Typography>
				<Breadcrumbs
					separator={<LuChevronRight size={12} />}
					aria-label="breadcrumb"
					sx={{
						"& ol": {
							display: "flex",
							gap: 1,
						},
					}}>
					{breadcrumbItems}
				</Breadcrumbs>
			</Box>
		</>
	);
};

export default PageBreadcrumb;
