import { useState } from "react";
import { useEvaluationData, type DataInfo } from "@/hooks/useEvaluationData";
import { ExecutionInstanceButton } from "./ExecutionInstanceButton";

export const ExecutionList = () => {
	const { getExecutionData } = useEvaluationData();
	const instances = getExecutionData().list ?? [];

	return (
		<>
			{instances.map((instance: DataInfo, idx) => {
				return (
					<ExecutionInstanceButton
						key={`execution-${idx}`}
						instance={instance}
						id={idx}
					/>
				);
			})}
		</>
	);
};
