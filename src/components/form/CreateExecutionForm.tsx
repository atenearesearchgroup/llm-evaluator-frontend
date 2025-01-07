import { getPlatforms } from "@/services/platformService";
import type { CreateInstanceRequest } from "@/model/request";
import { useEffect, useState } from "react";
import type {
	EvaluationSettings,
	IntentInstance,
	IntentModel,
	ModelSettings,
} from "@/model/model";
import { z } from "zod";
import { useForm, type Control } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/components/ui/use-toast";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	createInstance,
	createModel,
	getModels,
} from "@/services/intentService";
import { EvaluationSettingsForm } from "./EvaluationSettingsForm";
import { ModelSettingsForm } from "./ModelSettingsForm";
import { loadZipModels } from "../../lib/execution";
import { useEvaluationData } from "@/hooks/useEvaluationData";
import { deleteInstance, getInstances } from "@/services/instanceService";
import { uploadFile } from "@/services/fileService";
import { Textarea } from "@/components/ui/textarea";
import { getDefaultSyntaxPrompt } from "@/lib/phase";
import { unzip } from "unzipit";

const getAvailablePlatforms = async (): Promise<[string[], IntentModel[]]> => {
	const platforms = await getPlatforms();
	const intentModels = await getModels();

	if ("requestError" in platforms) {
		console.error(platforms);
		return [[], []];
	}

	if ("requestError" in intentModels) {
		console.error(intentModels);
		return [[], []];
	}

	return [platforms, intentModels];
};

const ZIP_MIME = "application/zip";

const ZipSchema = z.any();
// .instanceof(File)
// .refine((file) => file.type === ZIP_MIME, `File must be a zip file`)

const CloneFormSchema = z.object({
	maxErrors: z.coerce.number().int().min(0, {
		message: "Max errors must be at least 0.",
	}),
	maxChats: z.coerce.number().int().min(1, {
		message: "Max chats must be at least 1.",
	}),
	maxRepeatingPrompt: z.coerce.number().int().min(1, {
		message: "Max repeating prompt must be at least 1.",
	}),

	modelSettings: z.object({
		modelName: z.string(),
		modelOwner: z.string().optional(),
		version: z.string().optional(),
		systemPrompt: z.string().optional(),
		maxTokens: z.coerce.number().int().optional(),
		temperature: z.coerce.number().optional(),
		topP: z.coerce.number().optional(),
		frequencyPenalty: z.coerce.number().optional(),
		presencePenalty: z.coerce.number().optional(),
	}),
});

export const FormSchema = CloneFormSchema.extend({
	title: z.string().min(2, {
		message: "Title must be at least 2 characters.",
	}),
	zip: ZipSchema,
	llm: z.string(),
	syntaxPrompt: z.string().optional(),
});

const addNonUndefined = (obj: ModelSettings) => {
	const result: Record<string, unknown> = {};

	for (const [key, value] of Object.entries(obj)) {
		if (value !== undefined && value !== null && value !== -1) {
			result[key] = value;
		}
	}

	return result;
};

export const CreateExecutionForm = ({}) => {
	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			title: "New Execution",
			syntaxPrompt: getDefaultSyntaxPrompt(),
			maxErrors: 0,
			maxChats: 1,
			maxRepeatingPrompt: 1,
		},
	});
	const [data, setData] = useState<{
		llms: string[];
		intentModels: IntentModel[];
	}>({ llms: [], intentModels: [] });
	const { addEvaluation } = useEvaluationData();

	const { toast } = useToast();

	useEffect(() => {
		const platforms = async () => {
			const [llms, intentModels] = await getAvailablePlatforms();
			setData({
				llms,
				intentModels,
			});
		};

		platforms();
	}, []);

	async function onSubmit(formData: z.infer<typeof FormSchema>) {
		const modelSettings: ModelSettings = addNonUndefined(
			formData.modelSettings,
		) as ModelSettings;
		const intentModels = await getModels();

		const oldInstance = await getInstances(formData.title);

		if ("requestError" in intentModels) {
			toast({
				title: "Error creating instance",
				description: intentModels.message,
				className: "bg-red-600",
			});
			return;
		}

		if ("requestError" in oldInstance) {
			toast({
				title: "Error creating instance",
				description: oldInstance.message,
				className: "bg-red-600",
			});
			return;
		}

		if (oldInstance.length > 0) {
			toast({
				title: "Error creating instance",
				description: "An instance with the same title already exists",
				className: "bg-red-600",
			});
			return;
		}

		const models = await loadZipModels(formData.zip);

		const request: CreateInstanceRequest = {
			platform: formData.llm,
			displayName: formData.title,
			evaluationSettings: {
				maxChats: formData.maxChats,
				maxErrors: formData.maxErrors,
				maxRepeatingPrompt: formData.maxRepeatingPrompt,
			} as EvaluationSettings,
			modelSettings,
		};

		const createdInstances: (IntentInstance & {})[] = [];

		for (const model of models) {
			if (!intentModels.find((intent) => intent.modelName === model.id)) {
				await createModel({ displayName: model.id, model: model.id });
			}

			const response = await createInstance(model.id, request);

			if ("requestError" in response) {
				toast({
					title: "Error creating instance for model " + model.id,
					description: response.message,
					className: "bg-red-600",
				});

				createdInstances.forEach(async (instance) => {
					await deleteInstance(instance.id);
				});

				return;
			}

			createdInstances.push(response);
		}

		if (createdInstances.length === 0) {
			toast({
				title: "No instances created",
				description: "No instances were created, check your zip",
				className: "bg-red-600",
			});

			console.debug("models", models);
			console.debug("zip content", await unzip(formData.zip));
			return;
		}

		for (const model of models) {
			uploadFile(model.graderModel, model.id);
		}

		// console.log("models", models)
		// console.log("createdInstances", createdInstances)

		const index = addEvaluation({
			title: formData.title,
			syntax_prompt: formData.syntaxPrompt,
			instances: createdInstances.map((instance) => {
				// console.log(models.find(model => {
				//     console.log(model.id, instance.intentModel?.displayName ?? "null")

				//     return model.id === instance.intentModel?.displayName
				// })?.modelDescription ?? "", "DESCRIPTION")
				return {
					id: instance.id,
					status: "running",
					description:
						models.find(
							(model) =>
								model.id === instance.intentModel?.displayName,
						)?.modelDescription ?? "",
				};
			}),
		});

		toast({
			title: "Instances submitted",
			description: "The execution will start within seconds",
			// className: "bg-lime-600"
		});

		setTimeout(() => {
			// open new tab
			window.open(`/execution/${index}`, "_self");
		});
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="w-2/3 space-y-6 mx-auto py-5"
			>
				<FormField
					control={form.control}
					name="title"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Title</FormLabel>
							<FormControl>
								<Input placeholder="" {...field} />
							</FormControl>
							<FormDescription>
								This is the title for the instance
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="zip"
					render={({ field: { value, onChange, ...field } }) => (
						<FormItem>
							<FormLabel>Test suite</FormLabel>
							<FormControl>
								<Input
									type="file"
									accept={ZIP_MIME}
									// value={value?.name}
									onChange={(event) => {
										const file = event.target.files
											? event.target.files[0]
											: null;
										// console.log(file)
										onChange(file);
									}}
									{...field}
								/>
							</FormControl>
							<FormDescription>
								This is the test suite to be used (zip file)
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="llm"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Platform</FormLabel>
							<Select
								onValueChange={field.onChange}
								defaultValue={field.value}
							>
								<FormControl>
									<SelectTrigger>
										<SelectValue placeholder="Select a platform" />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									{data.llms.map((llm) => (
										<SelectItem key={llm} value={llm}>
											{llm}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<FormDescription>
								This is the platform to be used
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="syntaxPrompt"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Syntax prompt</FormLabel>
							<FormControl>
								<Textarea {...field} className="min-h-24" />
							</FormControl>
							<FormDescription>
								This is the prompt to be used in case there are
								syntax errors
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				<EvaluationSettingsForm control={form.control} />
				<ModelSettingsForm control={form.control} />
				<Button type="submit">Create</Button>
			</form>
		</Form>
	);
};
