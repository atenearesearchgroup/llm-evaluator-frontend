import { Skeleton } from "@/components/ui/skeleton";

export const LoadingExecution = ({}) => {
	return (
		<main className="flex-1 space-y-4 p-8 pt-6">
			<div className="flex flex-row items-center justify-between space-y-2 h-12">
				<Skeleton className="w-1/4 h-7" />
				<div className="gap-2 flex items-center">
					<Skeleton className="w-36 h-10 mb-3" />
				</div>
			</div>
			<div className="flex flex-row items-center justify-between space-y-2">
				<Skeleton className="w-2/3 h-10" />
			</div>

			<Skeleton className="w-full h-[76px] rounded-lg" />

			<section id="instance-list" className="mt-32">
				<Skeleton className="w-full h-56 rounded-lg" />
			</section>

			<section className="flex justify-between">
				<Skeleton className="w-44 h-10" />

				<Skeleton className="w-16 h-10" />
			</section>
		</main>
	);
};
