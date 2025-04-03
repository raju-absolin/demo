import { Breadcrumbs, Link, Typography, Box } from "@mui/material";
import { LuChevronRight } from "react-icons/lu"; // Adjust this import based on your actual ChevronRight icon
import { useAppDispatch, useAppSelector } from "@src/store/store";
import {
	setBreadCrumbs,
	setParentId,
	useFileSystemSelector,
} from "@src/store/sidemenu/file_system/fs.slice";
import {
	getFiles,
	getFilesByIdBreadcrumb,
} from "@src/store/sidemenu/file_system/fs.action";
import { useNavigate } from "react-router-dom";
import Loader from "@src/components/Loader";

const BreadCrumbs = () => {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const {
		fileSystem: {
			breadCrumbsList,
			pageParams,
			isGridView,
			breadCrumbLoading,
			folderChildrenPageParams,
			parentValue,
		},
		system: { userAccessList },
	} = useFileSystemSelector();

	return (
		<>
			<Box
				// height={75}
				sx={{ marginBottom: 2, marginTop: 2 }}
				display={"flex"}
				justifyContent={"space-between"}
				alignItems={"center"}>
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
									dispatch(setParentId(""));
									dispatch(
										getFiles({
											...pageParams,
											parent: "",
											page: 1,
											page_size: isGridView ? 20 : 10,
										})
									);
									navigate(`/file_system`);
									dispatch(setBreadCrumbs([]));
								}}>
								Home
							</Typography>
						</Link>,
						...breadCrumbsList?.map((breadcrumb, index) => (
							<Link
								key={index}
								color="inherit"
								variant="body2"
								underline="none"
								style={{ cursor: "pointer" }}
								// href={`/file_system/${breadcrumb.id}`}
							>
								<Typography
									variant="h5"
									color="text.primary"
									onClick={() => {
										dispatch(setParentId(breadcrumb.id));
										dispatch(
											getFiles({
												...pageParams,
												parent: breadcrumb.id,
												page: 1,
												page_size: isGridView ? 20 : 10,
											})
										);
										dispatch(
											getFilesByIdBreadcrumb({
												id: breadcrumb?.id,
												folderChildrenPageParams,
												// parentIds: parentValue,
											})
										);
										navigate(
											`/file_system/${breadcrumb?.id}`
										);
									}}>
									{breadcrumb.name}
								</Typography>
							</Link>
						)),
					]}
				</Breadcrumbs>
				{breadCrumbLoading && <Loader />}
			</Box>
		</>
	);
};

export default BreadCrumbs;
