import type { DataInfo } from "@/hooks/useEvaluationData";
import { Card, CardContent } from "@/components/ui/card";
import { useMemo, useState } from "react";

type ExecutionInfoProps = {
	instance: DataInfo;
	id: number;
};

export const ExecutionInfo = ({ instance, id }: ExecutionInfoProps) => {
	const [dataInfo, setDataInfo] = useState(instance);
	const broadcast = useMemo(
		() => new BroadcastChannel(`execution-${id}`),
		[id],
	);
	const runningInstances = dataInfo.instances.filter(
		(info) => info.status === `running`,
	);
	const failedInstances = dataInfo.instances.filter(
		(info) => info.status === `failed`,
	);
	const completedInstances = dataInfo.instances.filter(
		(info) => info.status === `completed`,
	);
	// const prompts

	// broadcast.postMessage({ type: `update`, data: instanceData })
	broadcast.onmessage = (ev) => {
		//console.log("Received message", ev.data)
		if (ev.data.type === `update`) {
			setDataInfo(ev.data.data);
		}
	};

	return (
		<Card>
			<CardContent className="py-3 px-6">
				<ol className="flex flex-row justify-around">
					<li className="flex flex-col gap-1 justify-center place-items-center">
						<p className="font-semibold">Running</p>
						<p className="">{runningInstances.length}</p>
					</li>
					<li className="flex flex-col gap-1 justify-center place-items-center">
						<p className="font-semibold">Failed</p>
						<p className="">{failedInstances.length}</p>
					</li>
					<li className="flex flex-col gap-1 justify-center place-items-center">
						<p className="font-semibold">Completed</p>
						<p className="">{completedInstances.length}</p>
					</li>
				</ol>
			</CardContent>
		</Card>
	);
};
