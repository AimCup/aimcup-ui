import React from "react";
import { FaPlay, FaUserAlt } from "react-icons/fa";
import { IoTime } from "react-icons/io5";
import { RiBarChartFill } from "react-icons/ri";
import { LiaLongArrowAltRightSolid } from "react-icons/lia";
import Link from "next/link";
import { format } from "date-fns";
import {
	StaffMemberService,
	StageService,
	type TeamResponseDto,
	TeamService,
	TournamentService,
} from "../../../../../generated";
import { TeamCard } from "@ui/molecules/Cards/TeamCard";
import { Avatar } from "@ui/atoms/Avatar/Avatar";
import { Socials } from "@ui/organisms/Socials/Socials";
import RegisterToTournamentButton from "@ui/molecules/RegisterToTournamentButton/RegisterToTournamentButton";
import { ScheduleList } from "@ui/organisms/ScheduleList/ScheduleList";
import { MappoolStages } from "@ui/organisms/MappoolStages/MappoolStages";
import { tournamentTeamShowEnumAvailable } from "@/lib/helpers";

const SingleTournament = async ({
	params,
}: {
	params: {
		tournamentId: string;
	};
}) => {
	const [getTournamentByAbbreviation, getStages, getStaffMembers] = await Promise.allSettled([
		TournamentService.getTournamentByAbbreviation(params.tournamentId),
		StageService.getStages(params.tournamentId),
		StaffMemberService.getStaffMembers(params.tournamentId),
	]);

	if (getTournamentByAbbreviation.status === "rejected") {
		throw new Error("Tournament not found"); //todo: change to proper error
	}
	if (getStages.status === "rejected") {
		throw new Error("Schedule not found"); //todo: change to proper error
	}
	if (getStaffMembers.status === "rejected") {
		throw new Error("Staff not found"); //todo: change to proper error
	}

	let teams: TeamResponseDto[] = [];
	let teamSize = "1vs1"; // 1vs1 for participants
	if (
		tournamentTeamShowEnumAvailable.includes(getTournamentByAbbreviation.value?.tournamentType)
	) {
		teamSize = `${getTournamentByAbbreviation.value?.minimumTeamSize}vs${getTournamentByAbbreviation.value?.minimumTeamSize}`;
		try {
			const getTeamsByTournament = await TeamService.getTeamsByTournament(
				params.tournamentId,
			);
			teams = getTeamsByTournament;
		} catch (error) {
			throw new Error("Teams not found"); //todo: change to proper error
		}
	}

	const isStaff = getStaffMembers.value.some(
		(staff) => staff.staffMembers && staff.staffMembers.length > 0,
	);

	const isMappool = getStages.value?.some((stage) => !!stage.mappool);

	return (
		<main className={"text-white container mx-auto"}>
			<section
				id="title"
				className={
					"divide-gray-700 md:px-18 my-12 flex w-full flex-col gap-4 px-8 lg:px-20"
				}
			>
				<div className={"flex"}>
					<div className={"flex flex-col gap-4 md:flex-row md:items-center"}>
						<h2 className={"text-4xl font-bold leading-relaxed "}>
							{getTournamentByAbbreviation?.value?.name}
						</h2>
						{getTournamentByAbbreviation?.value?.isOngoing && (
							<div className={"flex items-center gap-4 md:justify-start"}>
								<span className={"h-2 w-2 rounded-full bg-deepRed"} />
								<span className={"text-xl text-flatRed md:text-2xl"}>Ongoing</span>
							</div>
						)}
					</div>
				</div>
				<div className={"flex"}>
					<div className={"flex items-center gap-4"}>
						<RegisterToTournamentButton tournamentId={params.tournamentId} />
						<span className={"text-md text-flatRed"}>Apply for staff</span>
					</div>
				</div>
			</section>
			<section
				id="general-info"
				className={
					"divide-gray-700 md:px-18  mb-12 flex flex-col gap-3  px-8 md:w-2/3 lg:px-20"
				}
			>
				<div className={"flex"}>
					<div className={"flex items-center gap-4"}>
						<h2 className={"text-4xl font-bold leading-relaxed"}>General Info</h2>
					</div>
				</div>
				<div className={"grid  grid-cols-2 grid-rows-2 gap-5"}>
					<span className={"flex items-center gap-2"}>
						<FaUserAlt /> {teamSize}
					</span>
					<span className={"flex items-center gap-2"}>
						<FaPlay /> Relax
					</span>
					<span className={"flex items-center gap-2"}>
						<IoTime />{" "}
						{format(
							new Date(getTournamentByAbbreviation?.value?.startDate || 0),
							"MM/dd/yyyy",
						)}{" "}
						-{" "}
						{format(
							new Date(getTournamentByAbbreviation?.value?.endDate || 0),
							"MM/dd/yyyy",
						)}
					</span>
					<span className={"flex items-center gap-2"}>
						<RiBarChartFill />{" "}
						{getTournamentByAbbreviation.value?.minimumRankLimit || 0} -{" "}
						{getTournamentByAbbreviation.value?.maximumRankLimit || 0}
					</span>
				</div>
			</section>
			<section
				id="rules"
				className={
					"divide-gray-700   md:px-18 mb-12 flex w-full flex-col gap-3 px-8 lg:px-20"
				}
			>
				<div className={"flex"}>
					<Link
						href={`${params.tournamentId}/rules`}
						className={"group flex cursor-pointer items-center gap-4 "}
					>
						<h2
							className={
								"text-4xl font-bold leading-relaxed transition-all group-hover:underline"
							}
						>
							Rules
						</h2>{" "}
						<LiaLongArrowAltRightSolid
							size={45}
							className={
								"transition-all group-hover:-rotate-45 group-hover:transform"
							}
						/>
					</Link>
				</div>
				<div className={"grid grid-cols-1 gap-10 md:grid-cols-2"}>
					<span>
						Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec pellentesque
						consectetur justo ut venenatis. Ut in ultricies lorem, vel blandit ante. Sed
						lacinia lectus mauris, sed venenatis ex sollicitudin at. Cras sagittis sem
						sit amet massa suscipit, non lobortis nisi dignissim. Aenean lacinia pretium
						diam, sit amet sagittis orci maximus id. Nam facilisis eu odio nec accumsan.
						Nam in lobortis metus. Integer rhoncus tempor odio, ut faucibus magna
						pellentesque ullamcorper. Nam dictum purus non sapien lacinia dictum.
						Suspendisse potenti. Ut nec lacinia elit. Donec auctor nibh nibh, eget
						dapibus nunc aliquet quis. Maecenas massa ex, hendrerit non porttitor et,
						gravida at ligula. In ac dictum turpis, vel consectetur lacus. Suspendisse
						sagittis faucibus quam sed faucibus. Donec hendrerit, magna nec mattis
						porttitor, lectus purus pharetra quam, eu imperdiet augue lorem nec leo.
						Curabitur id ipsum auctor tellus posuere aliquam vel aliquet libero. Mauris
						lacinia pellentesque lacus, vel finibus lacus sagittis quis. Sed fermentum
						elit magna, eget luctus est mattis quis. Nulla feugiat blandit ante. Nulla
						laoreet ipsum quis justo volutpat, eget porta augue cursus. Cras dapibus ac
						turpis quis mollis.
					</span>
					<span className={"hidden md:block"}>
						Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec pellentesque
						consectetur justo ut venenatis. Ut in ultricies lorem, vel blandit ante. Sed
						lacinia lectus mauris, sed venenatis ex sollicitudin at. Cras sagittis sem
						sit amet massa suscipit, non lobortis nisi dignissim. Aenean lacinia pretium
						diam, sit amet sagittis orci maximus id. Nam facilisis eu odio nec accumsan.
						Nam in lobortis metus. Integer rhoncus tempor odio, ut faucibus magna
						pellentesque ullamcorper. Nam dictum purus non sapien lacinia dictum.
						Suspendisse potenti. Ut nec lacinia elit. Donec auctor nibh nibh, eget
						dapibus nunc aliquet quis. Maecenas massa ex, hendrerit non porttitor et,
						gravida at ligula. In ac dictum turpis, vel consectetur lacus. Suspendisse
						sagittis faucibus quam sed faucibus. Donec hendrerit, magna nec mattis
						porttitor, lectus purus pharetra quam, eu imperdiet augue lorem nec leo.
						Curabitur id ipsum auctor tellus posuere aliquam vel aliquet libero. Mauris
						lacinia pellentesque lacus, vel finibus lacus sagittis quis. Sed fermentum
						elit magna, eget luctus est mattis quis. Nulla feugiat blandit ante. Nulla
						laoreet ipsum quis justo volutpat, eget porta augue cursus. Cras dapibus ac
						turpis quis mollis.
					</span>
				</div>
				<div className={"flex"}>
					<Link
						href={`${params.tournamentId}/rules`}
						className={"text-flatRed hover:underline"}
					>
						Read full rules
					</Link>
				</div>
			</section>
			<section
				id="schedule"
				className={
					"divide-gray-700 md:px-18  mb-12  flex w-full flex-col gap-3 px-8 lg:px-20"
				}
			>
				<div className={"flex"}>
					<Link
						href={`${params.tournamentId}/schedule`}
						className={"group flex cursor-pointer items-center gap-4 "}
					>
						<h2
							className={
								"text-4xl font-bold leading-relaxed transition-all group-hover:underline"
							}
						>
							Shedule
						</h2>{" "}
						<LiaLongArrowAltRightSolid
							size={45}
							className={
								"transition-all group-hover:-rotate-45 group-hover:transform"
							}
						/>
					</Link>
				</div>
				<div className={"grid grid-cols-1 gap-4 md:grid-cols-2"}>
					<ScheduleList scheduleList={getStages.value} />
				</div>
				<div className={"flex"}>
					<Link
						href={`${params.tournamentId}/schedule`}
						className={"text-flatRed hover:underline"}
					>
						See match schedule
					</Link>
				</div>
			</section>
			{isMappool && (
				<section
					id="mappool"
					className={
						"divide-gray-700   md:px-18 mb-12 flex w-full flex-col gap-3 px-8 lg:px-20"
					}
				>
					<div className={"container mx-auto flex"}>
						<div className={"flex flex-col md:w-full"}>
							<h2
								className={
									"mb-4 text-4xl font-bold leading-relaxed transition-all group-hover:underline"
								}
							>
								Mappool
							</h2>
							<MappoolStages
								stage={getStages.value?.map((stage) => {
									return {
										id: stage.id,
										date: {
											start: stage.startDate,
											end: stage.endDate,
										},
										stageEnum: stage.stageType,
										shouldDisplay: !!stage.mappool,
									};
								})}
								tournamentAbbreviation={params.tournamentId}
							/>
						</div>
					</div>
				</section>
			)}
			{getTournamentByAbbreviation.value?.tournamentType === "TEAM_VS" &&
				teams.length > 0 && (
					<section
						id="teams"
						className={
							"divide-gray-700   md:px-18 mb-12 flex w-full flex-col gap-3 px-8 lg:px-20"
						}
					>
						<div className={"flex"}>
							<Link
								href={`${params.tournamentId}/teams`}
								className={"group flex cursor-pointer items-center gap-4 "}
							>
								<h2
									className={
										"text-4xl font-bold leading-relaxed transition-all group-hover:underline"
									}
								>
									Teams
								</h2>{" "}
								<LiaLongArrowAltRightSolid
									size={45}
									className={
										"transition-all group-hover:-rotate-45 group-hover:transform"
									}
								/>
							</Link>
						</div>
						<div className={"grid grid-cols-1 gap-10 md:grid-cols-2"}>
							{teams.map((team, index) => {
								if (index > 1) {
									return null;
								}
								return (
									<React.Fragment key={team.id}>
										<div>
											<TeamCard team={team} />
										</div>
									</React.Fragment>
								);
							})}
						</div>
					</section>
				)}

			<section
				id="prizes"
				className={
					"divide-gray-700   md:px-18 mb-12 flex w-full flex-col gap-3 px-8 lg:px-20"
				}
			>
				<div className={"flex"}>
					<h2 className={"text-4xl font-bold leading-relaxed"}>Prizes</h2>
				</div>
				<div
					className={"flex items-center justify-between gap-4 md:w-1/2 lg:w-1/3 xl:w-1/4"}
				>
					<span className={"font-bold"}>1st place</span>
					<span
						className={" h-4 flex-1 border-b-2 border-dotted border-deepRed opacity-30"}
					/>
					<span>$150</span>
				</div>
				<div
					className={"flex items-center justify-between gap-4 md:w-1/2 lg:w-1/3 xl:w-1/4"}
				>
					<span className={"font-bold"}>2nd place</span>
					<span
						className={" h-4 flex-1 border-b-2 border-dotted border-deepRed opacity-30"}
					/>
					<span>$150</span>
				</div>
				<div
					className={"flex items-center justify-between gap-4 md:w-1/2 lg:w-1/3 xl:w-1/4"}
				>
					<span className={"font-bold"}>3rd place</span>
					<span
						className={" h-4 flex-1 border-b-2 border-dotted border-deepRed opacity-30"}
					/>
					<span>$150</span>
				</div>
			</section>
			{isStaff && (
				<section
					id="staff"
					className={
						"divide-gray-700   md:px-18 mb-12 flex w-full flex-col gap-3 px-8 lg:px-20"
					}
				>
					<div className={"flex"}>
						<Link
							href={`${params.tournamentId}/staff`}
							className={"group mb-4 flex cursor-pointer items-center gap-4 "}
						>
							<h2
								className={
									"text-4xl font-bold leading-relaxed transition-all group-hover:underline"
								}
							>
								Staff
							</h2>{" "}
							<LiaLongArrowAltRightSolid
								size={45}
								className={
									"transition-all group-hover:-rotate-45 group-hover:transform"
								}
							/>
						</Link>
					</div>
					<div className={"grid grid-cols-2 gap-4 md:w-3/5"}>
						{getStaffMembers.value.map((staff) => {
							const role = staff.roleName;

							return (
								staff?.staffMembers?.map((member) => (
									<div key={member.id} className={"flex items-center gap-4"}>
										<div className={"relative"}>
											<Avatar src={`https://a.ppy.sh/${member.user.osuId}`} />
										</div>

										<span
											className={
												"flex items-center gap-4 overflow-hidden truncate"
											}
										>
											{member.user.username}{" "}
											<span className={"text-xs opacity-60"}>{role}</span>
										</span>
									</div>
								)) || null
							);
						})}
					</div>
				</section>
			)}
			<section
				id="socials"
				className={
					"divide-gray-700   md:px-18 mb-12 flex w-full flex-col gap-3 px-8 lg:px-20"
				}
			>
				<div className={"flex"}>
					<h2
						className={
							"text-4xl font-bold leading-relaxed transition-all group-hover:underline"
						}
					>
						Links
					</h2>
				</div>
				<Socials />
			</section>
		</main>
	);
};

export default SingleTournament;
