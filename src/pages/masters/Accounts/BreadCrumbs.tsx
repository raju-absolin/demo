import { Breadcrumbs, Link, Typography, Box } from "@mui/material";
import { LuChevronRight } from "react-icons/lu"; // Adjust this import based on your actual ChevronRight icon
import { useAppDispatch, useAppSelector } from "@src/store/store";
import {
	accountsSelector,
	setBreadCrumbs,
} from "@src/store/masters/Account/accounts.slice";
import { systemSelector } from "@src/store/system/system.slice";
import {
	getAccounts,
	getAccountsByIdBreadcrumb,
} from "@src/store/masters/Account/accounts.action";
import { useNavigate } from "react-router-dom";

// type BreadcrumbAccount = {
//     name: string;
//     path?: string; // Optional path
// };

// type BreadcrumbProps = {
//     title: string; // Title of the current page
//     breadcrumbs?: BreadcrumbAccount[]; // Optional array of breadcrumb accounts
// };

const BreadCrumbs = () => {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const {
		accounts: { selectedData, breadCrumbsList },
		system: { userAccessList },
	} = useAppSelector((state) => {
		return {
			accounts: accountsSelector(state),
			system: systemSelector(state),
		};
	});

	return (
		<>
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
										getAccounts({
											page: 1,
											page_size: 10,
										})
									);
									navigate(`/pages/masters/accounts`);
									dispatch(setBreadCrumbs([]));
								}}>
								Accounts
							</Typography>
						</Link>,
						...breadCrumbsList?.map((breadcrumb, index) => (
							<Link
								key={index}
								color="inherit"
								variant="body2"
								underline="none"
								style={{ cursor: "pointer" }}
								// href={`/pages/masters/accounts/${breadcrumb.id}`}
							>
								<Typography
									variant="h5"
									color="text.primary"
									onClick={() => {
										dispatch(
											getAccounts({
												parent: `${breadcrumb.id}`,
												page: 1,
												page_size: 10,
											})
										);
										dispatch(
											getAccountsByIdBreadcrumb({
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
