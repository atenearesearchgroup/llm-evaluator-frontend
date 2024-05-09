import { getPlatforms } from "@/services/platformService"
import type { CreateInstanceRequest, RequestError } from "@/model/request"
import { useEffect, useState, type FormEvent } from "react"
import type { EvaluationSettings, ModelSettings } from "@/model/model"

const getAvailablePlatforms = async () => {
    const platforms = await getPlatforms()

    if ('status' in platforms) {
        console.error(platforms)
        return []
    }

    return platforms as string[]
}

type DraftForm = EvaluationSettings & ModelSettings & {
    title: string,
    llm: string
}

const addNonUndefined = (obj: Record<string, unknown>) => {
    const result: Record<string, unknown> = {}

    for (const [key, value] of Object.entries(obj)) {
        if (value !== undefined && value !== null && value !== -1) {
            result[key] = value
        }
    }

    return result
}

const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    const form = event.target as HTMLFormElement;
    const data = new FormData(form);

    const { llm, title,
        maxDrafts, maxK, maxRepeatingPrompt,
        modelName, modelOwner, version, systemPrompt,
        maxTokens, temperature, topP, frequencyPenalty, presencePenalty }
        = Object.fromEntries(data.entries()) as unknown as DraftForm


    const modelSettings: ModelSettings = addNonUndefined({ modelName, modelOwner, version, systemPrompt, maxTokens, temperature, topP, frequencyPenalty, presencePenalty })

    // console.log(maxDrafts, maxK, maxRepeatingPrompt)

    const request: CreateInstanceRequest = {
        platform: llm,
        displayName: title,
        evaluationSettings: {
            maxDrafts: maxDrafts,
            maxK: maxK,
            maxRepeatingPrompt: maxRepeatingPrompt,
        } as EvaluationSettings,
        modelSettings
    }

    console.log("request", request)
}

export const CreateDraftForm = ({ }) => {
    const [llms, setLlms] = useState<string[]>([])

    useEffect(() => {
        const platforms = async () => {
            const result = await getAvailablePlatforms()
            setLlms(result)
            console.log(result)
        }

        platforms()

    }, [])

    return (
        <form
            onSubmit={handleSubmit}

            method="post"
            className="p-5 m-10 mx-auto flex flex-col gap-3"
        >
            <input
                className="mx-auto p-1"
                type="text"
                name="title"
                id="title"
                placeholder="Nombre"
                required
                minLength={4}
            />

            <div className="mx-auto">
                <label htmlFor="llm" className="text-left mr-5">LLM</label>
                <select name="llm" className="p-1">
                    {llms.map((llm) => <option value={llm}>{llm}</option>)}
                </select>
            </div>

            <h2 className="text-center">Configuración del modelo</h2>



            <h2 className="text-center">Configuración de la evaluación</h2>

            <input
                className="mx-auto p-1"
                type="number"
                name="maxDrafts"
                placeholder="Número máximo de borradores"
                defaultValue={1}
                required
                min={1}
            />

            <input
                className="mx-auto p-1"
                type="number"
                name="maxK"
                placeholder="Número máximo de K"
                defaultValue={1}
                required
                min={1}
            />

            <input
                className="mx-auto p-1"
                type="number"
                name="maxRepeatingPrompt"
                placeholder="Número máximo de repeticiones de la pregunta"
                defaultValue={1}
                required
                min={1}
            />

            <input
                className="bg-lime-600 hover:bg-lime-700 bg-opacity-60 mx-auto p-2 rounded-xl"
                type="submit"
                value="Crear"
            />
        </form>
    )
}