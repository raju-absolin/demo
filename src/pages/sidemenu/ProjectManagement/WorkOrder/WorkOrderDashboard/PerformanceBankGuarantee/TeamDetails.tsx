// TeamDetails.tsx
import React from "react";
import { Team, Member } from "./types";
import {
	List,
	ListItem,
	ListItemText,
	Button,
	Typography,
} from "@mui/material";

interface TeamDetailsProps {
	team: Team;
	onEditMember: (member: Member) => void;
	onAddMember: () => void;
}

const TeamDetails: React.FC<TeamDetailsProps> = ({
	team,
	onEditMember,
	onAddMember,
}) => {
	return (
		<div>
			<Typography variant="h6">{team.name} Members</Typography>
			<List>
				{team.members.map((member) => (
					<ListItem key={member.id}>
						<ListItemText
							primary={member.name}
							secondary={member.role}
						/>
						<Button onClick={() => onEditMember(member)}>
							Edit
						</Button>
					</ListItem>
				))}
			</List>
			<Button variant="contained" color="primary" onClick={onAddMember}>
				Add Member
			</Button>
		</div>
	);
};

export default TeamDetails;
