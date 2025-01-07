import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipProvider } from "@/components/ui/tooltip";
import type { DataInfo } from "@/hooks/useEvaluationData";
import { isRequestError } from "@/utils/request";
import { getInstance } from "@/services/instanceService";
import {
	TooltipArrow,
	TooltipContent,
	TooltipTrigger,
} from "@radix-ui/react-tooltip";
import { useEffect, useState } from "react";

type IntentInstanceProps = {
	instance: DataInfo;
	id: number;
};

// /bg-slate-600
export const ExecutionInstanceButton = ({
	instance,
	id,
}: IntentInstanceProps) => {
	const [isValid, setValid] = useState<boolean>(true);

	useEffect(() => {
		let task = setTimeout(async () => {
			if (instance.instances.length === 0) {
				setValid(false);
				return;
			}

			const loadedInstance = await getInstance(instance.instances[0].id);
			if (loadedInstance === null || isRequestError(loadedInstance)) {
				setValid(false);
				return;
			}
		});

		return () => {
			clearTimeout(task);
		};
	}, []);

	const isRunning = instance.instances.every(
		(info) => info.status === `running`,
	)
		? `in progress`
		: `completed`;

	return (
		<li
			id={`list-${id}`}
			data-id={`${id}`}
			className={
				`draft-cell mx-2 sm:my-2 flex sm:flex-col
              bg-primary-foreground text-primary
              bg-opacity-30 pl-5 p-3 sm:pl-3 sm:text-sm rounded-lg sm:justify-between gap-4 sm:gap-2 ` +
				(isValid ? "" : "bg-red-500 opacity-60")
			}
		>
			<a
				href={`/execution/${id}`}
				className="font-bold draft-cell text-wrap max-w-40"
			>
				{instance.title ?? "Untitled"}
			</a>
			<TooltipProvider>
				<Tooltip delayDuration={400}>
					<TooltipTrigger className="place-self-end">
						<Badge
							variant="default"
							data-id={id}
							className="text-primary-foreground w-fit sm:text-xs place-self-end font-normal"
						>
							{isValid ? isRunning : "Invalid instance"}
						</Badge>
					</TooltipTrigger>
					<TooltipContent side={"right"} className="">
						<p className="bg-popover p-2 rounded-md">Status</p>
						<TooltipArrow className="bg-popover" />
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>
			{/* <p className="text-end">{instance.platform}</p> */}
		</li>
	);
};
