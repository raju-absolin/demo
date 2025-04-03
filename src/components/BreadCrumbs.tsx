import { Breadcrumbs, Link, Typography, Box } from "@mui/material";
import { LuChevronRight } from "react-icons/lu"; // Adjust this import based on your actual ChevronRight icon
import PageMetaData from "./PageMetaData"; // Assuming PageMetaData is a component in your project
import { useAppDispatch, useAppSelector } from "@src/store/store";
import {
	itemsSelector,
	setBreadCrumbs,
} from "@src/store/masters/Item/item.slice";
import { systemSelector } from "@src/store/system/system.slice";
import {
	getItems,
	getItemsByIdBreadcrumb,
} from "@src/store/masters/Item/item.action";
import { useNavigate } from "react-router-dom";

// type BreadcrumbItem = {
//     name: string;
//     path?: string; // Optional path
// };

// type BreadcrumbProps = {
//     title: string; // Title of the current page
//     breadcrumbs?: BreadcrumbItem[]; // Optional array of breadcrumb items
// };

const BreadCrumbs = () => {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const {
		items: { selectedData, breadCrumbsList },
		system: { userAccessList },
	} = useAppSelector((state) => {
		return {
			items: itemsSelector(state),
			system: systemSelector(state),
		};
	});

	return (
		<>
			{/* <PageMetaData title={title} /> */}
			<Box
				// height={75}
				sx={{ marginBottom: 2, marginTop: 2 }}
				display={"flex"}
				justifyContent={"space-between"}
				alignItems={"center"}>
				{/* <Typography variant="h5" color={"text.primary"}>
                    {title}
                </Typography> */}
				<Breadcrumbs
					separator={<LuChevronRight size={12} />}
					aria-label="breadcrumb"
					sx={{
						"& ol": {
							display: "flex",
							gap: 1,
						},
					}}>
					{[
						<Link
							key="root"
							color="inherit"
							variant="body2"
							underline="none"
							style={{ cursor: "pointer" }}>
							<Typography
								variant="h5"
								color="text.primary"
								onClick={() => {
									dispatch(
										getItems({
											page: 1,
											page_size: 10,
										})
									);
									navigate(`/pages/masters/item`);
									dispatch(setBreadCrumbs([]));
								}}>
								Items
							</Typography>
						</Link>,
						...breadCrumbsList?.map((breadcrumb, index) => (
							<Link
								key={index}
								color="inherit"
								variant="body2"
								underline="none"
								style={{ cursor: "pointer" }}
								// href={`/pages/masters/items/${breadcrumb.id}`}
							>
								<Typography
									variant="h5"
									color="text.primary"
									onClick={() => {
										dispatch(
											getItems({
												parent: breadcrumb.id,
												page: 1,
												page_size: 10,
											})
										);
										dispatch(
											getItemsByIdBreadcrumb({
												id: breadcrumb?.id,
											})
										);
									}}>
									{breadcrumb.name}
								</Typography>
							</Link>
						)),
					]}
				</Breadcrumbs>
			</Box>
		</>
	);
};

export default BreadCrumbs;
