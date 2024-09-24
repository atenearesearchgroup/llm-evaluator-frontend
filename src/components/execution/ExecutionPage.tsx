import { useEvaluationData, type DataInfo, type InstanceInfo } from "@/hooks/useEvaluationData";
import { InstanceSettings } from "../instance/sections/InstanceSettings";
import { getInstance } from "@/services/instanceService";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { IntentInstance } from "@/model/model";
import { Input } from "@design/ui/input";
import { ExecutionInfo } from "./ExecutionInfo";
import { RunningInstance } from "./RunningInstance";
import { ExportListButton } from "./ExportListButton";


type ExecutionPageProps = {
    id: number;
}

export const ExecutionPage = ({ id }: ExecutionPageProps) => {
    const broadcast = useMemo(() => new BroadcastChannel(`execution-${id}`), [id])
    const [sampleInstance, setSampleInstance] = useState<IntentInstance | null>(null)

    const { getExecutionInstance, updateExecutionInstance } = useEvaluationData()
    const instance = useMemo(() => getExecutionInstance(id), [id])

    const handleUpdateInstance = useCallback((instanceData: InstanceInfo) => {
        const newInstances = instance.instances.map((inst) =>
            inst.id === instanceData.id ? instanceData : inst
        );

        const newDataInfo: DataInfo = { ...instance, instances: newInstances }

        updateExecutionInstance(id, newDataInfo)

        // send web browser notification
        broadcast.postMessage({ type: `update`, data: newDataInfo })
    }, [instance, id, updateExecutionInstance, broadcast]);


    useEffect(() => {
        const getInstanceProm = async () => {
            if (instance.instances.length === 0) {
                setSampleInstance(null)
                return
            }

            const result = await getInstance(instance.instances[0].id)

            if (result == null || `requestError` in result) {
                if (result != null)
                    console.error(result)
                setSampleInstance(null)
                return
            }

            setSampleInstance(result)
        }

        getInstanceProm()
    }, [])


    if (!instance)
        return (
            <main>
                <p>404 - Couldnt find instance with id #{id}</p>
            </main>
        )

    if (!sampleInstance)
        return (
            <main>
                <p>Loading the first instance from the execution</p>
            </main>
        )

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
                    <Input className="text-2xl py-4 font-bold tracking-tight"
                        defaultValue={instance.title}
                        disabled={true}
                        type="text" />
                </div>
                {/* <DeleteInstance instanceId={instance.id} client:visible /> */}
            </div>

            <ExecutionInfo instance={instance} broadcast={broadcast} />

            <section id="instance-list" className="mt-32">

                {
                    instance.instances.map((value, idx) => {
                        return <RunningInstance
                            updateInstance={handleUpdateInstance}
                            instanceData={value}
                            parent={instance}
                            key={`running-${idx}`}
                        />
                    })
                }
            </section>

            <ExportListButton id={id} />

        </main>
    )
}