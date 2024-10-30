import { useEvaluationData } from "@/hooks/useEvaluationData"
import { exportJson } from "@/lib/metrics"
import { Button } from "@design/ui/button"
import { useMemo } from "react"


type ExportListButtonProps = {
    id: number
}

export const ExportListButton = ({ id }: ExportListButtonProps) => {

    const {getExecutionInstance} = useEvaluationData()
    const instance = useMemo(() => getExecutionInstance(id), [id, getExecutionInstance])

    return (
        <Button
            onClick={async () => {

                if(instance.instances.find(i => i.status === 'running') !== undefined) {
                    alert('Exporting data containing running instances...')
                }

                const result = await exportJson(instance)

                const data = JSON.stringify(result, null, 2)

                const file = new File([data], `${id}-data.json`, { type: "application/json" })

                const url = URL.createObjectURL(file)

                var a = document.createElement("a");
                a.classList.add("hidden");
                a.href = url;
                a.download = file.name;
                a.click();

                window.URL.revokeObjectURL(url)
            }}
            variant={"link"}>
            Export execution data
        </Button>
    )
}