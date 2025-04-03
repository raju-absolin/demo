import {
	Avatar,
	AvatarGroup,
	Box,
	Button,
	IconButton,
	Stack,
} from "@mui/material";
import { User } from "@src/store/settings/manageUsers/manage_users.types";
import { LuChevronRight, LuPlus } from "react-icons/lu";

type GroupedAvatarsProps = {
	data: User[];
	open: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export const GroupedAvatars = ({
	data,
	open,
	setOpen,
}: GroupedAvatarsProps) => {
	console.log(data);
	return (
		<Box>
			<Stack direction={"row"} alignItems={"center"}>
				<AvatarGroup
					max={7}
					onClick={() => {
						setOpen(!open);
					}}>
					{data && (data || [])?.length != 0 ? (
						<>
							{data?.map((user) => {
								return (
									<Avatar
										variant="circular"
										src={user?.fullname?.charAt(0)}
										sx={{ height: "32px", width: "32px" }}
									/>
								);
							})}
						</>
					) : (
						<Box>
							<Button
								startIcon={<LuPlus />}
								variant={"outlined"}
								onClick={() => {
									setOpen(!open);
								}}>
								Add Assignees
							</Button>
						</Box>
					)}
					<IconButton
						sx={{
							color: "primary",
						}}
						onClick={() => {
							setOpen(!open);
						}}>
						<LuChevronRight
							style={{
								color: "inherit",
							}}
						/>
					</IconButton>
				</AvatarGroup>
			</Stack>
		</Box>
	);
};
