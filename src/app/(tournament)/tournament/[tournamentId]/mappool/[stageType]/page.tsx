import React from "react";
import Link from "next/link";
import {
	type BeatmapModificationResponseDto,
	MappoolService,
	type StageResponseDto,
} from "../../../../../../../generated";
import { stageTypeEnumToString } from "@/lib/helpers";
import { MappoolCard } from "@ui/molecules/Cards/MappoolCard";

const SingleTournamentMappool = async ({
	params,
	searchParams,
}: {
	params: {
		tournamentId: string;
		stageType: StageResponseDto["stageType"];
	};
	searchParams: {
		modification: BeatmapModificationResponseDto["modification"];
	};
}) => {
	const getMappoolByStageData = await MappoolService.getMappoolByStage(
		params.tournamentId,
		params.stageType,
	);

	const mappolStages = getMappoolByStageData.beatmapsModifications.filter(
		(stage) => !!stage.beatmaps,
	);
	const selectedMappoolByModification = searchParams.modification
		? getMappoolByStageData.beatmapsModifications.filter(
				(m) => m.modification === searchParams.modification,
			)
		: getMappoolByStageData.beatmapsModifications;

	const modifications = mappolStages
		?.filter((m) => !m.isHidden)
		?.filter((m) => m.beatmaps?.length && m.beatmaps?.length > 0)
		.map((m) => m.modification);

	const countModificationBeatmaps: {
		[key: string]: number;
	} = getMappoolByStageData.beatmapsModifications.reduce(
		(acc, mod) => {
			acc[mod.modification] = mod.beatmaps?.length || 0;
			return acc;
		},
		{} as { [key: string]: number },
	);

	const allModificationsCount =
		getMappoolByStageData.beatmapsModifications?.flatMap((m) => m.beatmaps).length || 0;

	const mappoollCard: React.ReactNode[] = [];

	if (searchParams.modification) {
		selectedMappoolByModification[0]?.beatmaps?.forEach((map) => {
			mappoollCard.push(
				<MappoolCard
					key={map.id}
					title={map.title}
					modification={searchParams.modification}
					author={map.creator}
					isCustom={true} // todo
					mapInformation={{
						stars: map.beatmapStatistics.starRating,
						time: map.beatmapStatistics.length,
						bpm: map.beatmapStatistics.bpm,
						ar: map.beatmapStatistics.ar,
						hp: map.beatmapStatistics.hp,
						od: map.beatmapStatistics.od,
						cs: map.beatmapStatistics.cs,
					}}
					img={map.cardCover}
				/>,
			);
		});
	} else {
		selectedMappoolByModification
			?.flatMap((m) => m.beatmaps)
			?.forEach((map) => {
				mappoollCard.push(
					<MappoolCard
						key={map?.id}
						title={map?.title}
						modification={map?.modification}
						author={map?.creator}
						isCustom={true}
						mapInformation={{
							stars: map?.beatmapStatistics.starRating || 0,
							time: map?.beatmapStatistics.length || 0,
							bpm: map?.beatmapStatistics.bpm || 0,
							ar: map?.beatmapStatistics.ar || 0,
							hp: map?.beatmapStatistics.hp || 0,
							od: map?.beatmapStatistics.od || 0,
							cs: map?.beatmapStatistics.cs || 0,
						}}
						img={map?.cardCover}
					/>,
				);
			});
	}

	const stageContent = (
		<>
			<div className={"mb-4 mt-10 flex"}>
				<div className={"flex flex-col gap-4"}>
					<h2 className={"text-2xl font-bold "}>
						{stageTypeEnumToString(params.stageType)}
					</h2>
					<ul className="menu rounded-box bg-base-200 lg:menu-horizontal">
						<li
							className={`${
								!searchParams.modification ? "active rounded bg-deepRed" : ""
							}`}
						>
							<Link
								href={`/tournament/${params.tournamentId}/mappool/${params.stageType}`}
							>
								ALL
								<span className="badge badge-sm">{allModificationsCount}</span>
							</Link>
						</li>
						{modifications?.map((mod, index) => {
							const isActive = searchParams.modification === mod;
							const isMappoolEmpty = countModificationBeatmaps[mod] === 0;

							if (isMappoolEmpty) {
								return null;
							}

							return (
								<li
									className={`${isActive ? "active rounded bg-deepRed" : ""}`}
									key={index}
								>
									<Link
										href={`/tournament/${params.tournamentId}/mappool/${params.stageType}?modification=${mod}`}
									>
										{mod}
										<span className="badge badge-sm">
											{countModificationBeatmaps[mod]}
										</span>
									</Link>
								</li>
							);
						})}
					</ul>
				</div>
			</div>
			<div className={"flex flex-col gap-10 md:w-full"}>{mappoollCard}</div>
		</>
	);

	return (
		<main className={"text-white container mx-auto"}>
			<section
				id="mappool"
				className={
					"divide-gray-700 md:px-18 my-12 flex w-full flex-col gap-4 px-8 lg:px-20"
				}
			>
				<div className={"mb-10 flex"}>
					<div className={"flex flex-col gap-4 md:flex-row md:items-center"}>
						<h2 className={"text-4xl font-bold "}>Mappool</h2>
					</div>
				</div>
				{stageContent}
			</section>
		</main>
	);
};

export default SingleTournamentMappool;
