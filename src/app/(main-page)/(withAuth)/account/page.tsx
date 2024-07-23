import React, { Suspense } from "react";
import Link from "next/link";
import { IoMdAdd } from "react-icons/io";
import { UserInformation } from "@ui/organisms/UserInformation/UserInformation";
import { TournamentList } from "@ui/organisms/TournamentList/TournamentList";
import { Loading } from "@ui/atoms/Loading/Loading";
import { TeamCard } from "@ui/molecules/Cards/TeamCard";
import { generateTeam } from "@/mocks/mockups";

const AccountPage = () => {
	return (
		<main className={"text-white 0 container mx-auto"}>
			<UserInformation />
			<Suspense fallback={<Loading size={"md"} />}>
				<section
					id="my-tournaments"
					className={
						"divide-gray-700 md:px-18 md:py-18 w-full px-8 py-10 lg:px-20 lg:py-20"
					}
				>
					<div className={"container mx-auto flex"}>
						<div className={"flex flex-col md:w-full"}>
							<h2 className={"mb-3  text-3xl font-bold leading-relaxed"}>
								My tournaments
							</h2>
							<TournamentList userTournaments={true} />
						</div>
					</div>
				</section>
			</Suspense>
			<Suspense fallback={<Loading size={"md"} />}>
				<section
					id="upcomming-matches"
					className={
						"divide-gray-700 md:px-18 md:py-18 w-full px-8 py-10 lg:px-20 lg:py-20"
					}
				>
					<div className={"container mx-auto flex"}>
						<div className={"flex flex-col md:w-full"}>
							<h2 className={"mb-3  text-3xl font-bold leading-relaxed"}>
								Upcomming matches
							</h2>
							<TournamentList useMobileCarousel={false} />
						</div>
					</div>
				</section>
			</Suspense>
			<section
				id="my-teams"
				className={"divide-gray-700 md:px-18 md:py-18 w-full px-8 py-10 lg:px-20 lg:py-20"}
			>
				<div className={"container mx-auto flex"}>
					<div className={"flex flex-col md:w-full"}>
						<div className={"flex"}>
							<Link
								href={`/account/create-team`}
								className={"group mb-4 flex cursor-pointer items-center gap-4 "}
							>
								<h2
									className={
										"text-3xl font-bold leading-relaxed transition-all group-hover:underline"
									}
								>
									My teams
								</h2>{" "}
								<IoMdAdd
									size={45}
									className={
										"transition-all group-hover:-rotate-90 group-hover:transform"
									}
								/>
							</Link>
						</div>
						<div className={"grid grid-cols-1 gap-10 md:grid-cols-2"}>
							<div>
								<TeamCard team={generateTeam()} />
							</div>
							<div className={"hidden md:flex"}>
								<TeamCard team={generateTeam()} />
							</div>
						</div>
					</div>
				</div>
			</section>
		</main>
	);
};

export default AccountPage;