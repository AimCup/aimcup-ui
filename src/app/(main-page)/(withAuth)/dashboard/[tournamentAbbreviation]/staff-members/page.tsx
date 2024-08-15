import React from "react";
import Image from "next/image";
import {
	AdminStaffMemberService,
	AdminTournamentRolesService,
} from "../../../../../../../generated";
import { StaffMemberModal } from "@/app/(main-page)/(withAuth)/dashboard/[tournamentAbbreviation]/staff-members/StaffMemberModal";
import { executeFetch } from "@/lib/executeFetch";
import type { selectOptions } from "@ui/atoms/Forms/Select/ComboBox";
import { UserLessStaffMemberModal } from "@/app/(main-page)/(withAuth)/dashboard/[tournamentAbbreviation]/staff-members/UserLessStaffMemberModal";

const StaffMembersPage = async ({
	params: { tournamentAbbreviation },
}: {
	params: {
		tournamentAbbreviation: string;
	};
}) => {
	const getRoles = await executeFetch(
		AdminTournamentRolesService.getTournamentRoles(tournamentAbbreviation),
	);
	const getPermissions = await executeFetch(
		AdminTournamentRolesService.getTournamentPermissions(tournamentAbbreviation),
	);

	const getStaffMembers = await executeFetch(
		AdminStaffMemberService.getStaffMembers1(tournamentAbbreviation),
	);

	if (!getRoles.status || !getPermissions.status) {
		return <div>Failed to fetch roles or permissions</div>;
	}

	if (!getStaffMembers.status) {
		return <div>Failed to fetch staff members</div>;
	}

	const rolesSelectOptions: selectOptions[] = getRoles.response?.map((role) => ({
		id: role.id,
		label: role.name,
	}));

	const permissionsSelectOptions: selectOptions[] =
		getPermissions.response.permissions?.map((permission) => ({
			id: permission,
			label: permission,
		})) || [];

	return (
		<div className={"flex w-full flex-col !px-3 !py-2"}>
			<h2 className={"mb-3  text-3xl font-bold leading-relaxed"}>Staff members</h2>
			<div className={"flex items-center gap-3"}>
				<StaffMemberModal
					rolesSelectOptions={rolesSelectOptions}
					permissionsSelectOptions={permissionsSelectOptions}
					tournamentAbb={tournamentAbbreviation}
					modalType={{
						type: "add",
					}}
				/>
				<UserLessStaffMemberModal
					tournamentAbb={tournamentAbbreviation}
					rolesSelectOptions={rolesSelectOptions}
					modalType={{ type: "add" }}
				/>
			</div>

			<div className="mt-10 overflow-x-auto">
				<table className="table">
					{/* head */}
					<thead>
						<tr>
							<th>Osu ID</th>
							<th>User name</th>
							<th>Discord ID</th>
							<th>Roles</th>
							<th>Permissions</th>
							<th>Actions</th>
						</tr>
					</thead>
					<tbody>
						{getStaffMembers.response.map((s) => (
							<tr key={s.id}>
								<td>{s.user ? s.user.osuId : "-"}</td>
								<td className={"flex items-center gap-4"}>
									<div className="avatar">
										<div className="mask mask-squircle h-12 w-12">
											<Image
												src={
													(s.user
														? `https://a.ppy.sh/${s.user.osuId}`
														: s?.imageUrl) || ""
												}
												alt="Avatar Tailwind CSS Component"
												width={48}
												height={48}
											/>
										</div>
									</div>
									{s.user ? s.user.username : s.username}
								</td>
								<td>{s.user ? s.discordId : "-"}</td>
								<td>
									{s.roles?.map((role) => (
										<span
											key={role.id}
											className="badge badge-ghost badge-sm block"
										>
											{role.name}
										</span>
									))}
								</td>
								<td>
									{s.user
										? s.permissions?.map((permission) => (
												<span
													key={permission}
													className="badge badge-ghost badge-sm block"
												>
													{permission}
												</span>
											))
										: "-"}
								</td>
								<td>
									{s.user && (
										<StaffMemberModal
											rolesSelectOptions={rolesSelectOptions}
											permissionsSelectOptions={permissionsSelectOptions}
											tournamentAbb={tournamentAbbreviation}
											modalType={{
												type: "edit",
												user: {
													osuId: "" + s.id,
													discordId: "" + s.discordId,
													roles:
														s.roles?.map((role) => {
															return {
																id: role.id,
																label: role.name,
															};
														}) || [],
													permissions:
														s.permissions?.map((permission) => {
															return {
																id: permission,
																label: permission,
															};
														}) || [],
												},
											}}
										/>
									)}
									<form
										action={async (_e) => {
											"use server";
											await executeFetch(
												AdminStaffMemberService.deleteStaffMembers(
													tournamentAbbreviation,
													s.id,
												),
												[
													"/",
													`/dashboard/${tournamentAbbreviation}/staff-members`,
												],
											);
										}}
									>
										<button className="btn btn-ghost btn-xs" type={"submit"}>
											delete
										</button>
									</form>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default StaffMembersPage;
