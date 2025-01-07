import {
	useEvaluationData,
	type DataInfo,
	type InstanceInfo,
} from "@/hooks/useEvaluationData";
import { InstanceSettings } from "../instance/sections/InstanceSettings";
import { getInstance } from "@/services/instanceService";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { IntentInstance } from "@/model/model";
import { Input } from "@/components/ui/input";
import { ExecutionInfo } from "./ExecutionInfo";
import { RunningInstance } from "../instance/RunningInstance";
import { ExportListButton } from "./buttons/ExportListButton";
import { DeleteExecution } from "./buttons/DeleteExecution";
import { NotFoundExecution } from "./skeletons/NotFoundExecution";
import { LoadingExecution } from "./skeletons/LoadingExecution";
import { isRequestError } from "@/utils/request";

type ExecutionPageProps = {
	id: number;
};

export const ExecutionPage = ({ id }: ExecutionPageProps) => {
	const broadcast = useMemo(
		() => new BroadcastChannel(`execution-${id}`),
		[id],
	);
	const [sampleInstance, setSampleInstance] = useState<
		IntentInstance | undefined | null
	>(undefined);

	const { getExecutionInstance, updateExecutionInstance } =
		useEvaluationData();
	const instance = useMemo(
		() => getExecutionInstance(id),
		[id, getExecutionInstance],
	);

	const handleUpdateInstance = useCallback(
		(instanceData: InstanceInfo) => {
			const newInstances = instance.instances.map((inst) =>
				inst.id === instanceData.id ? instanceData : inst,
			);

			const newDataInfo: DataInfo = {
				...instance,
				instances: newInstances,
			};

			updateExecutionInstance(id, newDataInfo);

			// send web browser notification
			broadcast.postMessage({ type: `update`, data: newDataInfo });
		},
		[instance, id, updateExecutionInstance, broadcast],
	);

	useEffect(() => {
		const getInstanceProm = async () => {
			if (instance.instances.length === 0) {
				setSampleInstance(null);
				return;
			}

			const result = await getInstance(instance.instances[0].id);

			if (result == null || isRequestError(result)) {
				if (result != null) console.error(result);
				setSampleInstance(null);
				return;
			}

			await new Promise((resolve) => setTimeout(resolve, 250));

			setSampleInstance(result);
		};

		getInstanceProm();
	}, []);

	if (!instance || sampleInstance === null)
		return <NotFoundExecution id={id} />;

	if (sampleInstance === undefined) return <LoadingExecution />;

	return (
		<main className="flex-1 space-y-4 p-8 pt-6">
			<div className="flex flex-row items-center justify-between space-y-2">
				<h2 className="text-xl font-bold">Execution #{id}</h2>
				<div className="gap-2 flex items-center">
					<InstanceSettings instance={sampleInstance} />
				</div>
			</div>
			<div className="flex flex-row items-center justify-between space-y-2">
				<div className="w-fit">
					<Input
						className="text-2xl py-4 font-bold tracking-tight"
						defaultValue={instance.title}
						disabled={true}
						type="text"
					/>
				</div>
				{/* <DeleteInstance instanceId={instance.id} client:visible /> */}
			</div>

			<ExecutionInfo instance={instance} id={id} />

			<section id="instance-list" className="mt-32">
				{instance.instances.map((value, idx) => {
					return (
						<RunningInstance
							updateInstance={handleUpdateInstance}
							instanceData={value}
							parent={instance}
							key={`running-${idx}`}
						/>
					);
				})}
			</section>

			<section className="flex justify-between">
				<ExportListButton id={id} />

				<DeleteExecution id={id} />
			</section>
		</main>
	);
};
