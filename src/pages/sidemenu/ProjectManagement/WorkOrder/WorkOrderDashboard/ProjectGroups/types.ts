// types.ts
export interface Member {
	id: string;
	name: string;
	role: string;
}

export interface Team {
	id: string;
	name: string;
	members: Member[];
}
