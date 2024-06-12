import type { IntentInstance } from "@/model/model"
import { exportJson } from "@/utils/metrics"
import { Button } from "@design/ui/button"


type ExportButtonProps = {
    instance: IntentInstance
}

export const ExportButton = ({ instance }: ExportButtonProps) => {


    return (
        <Button
        
        onClick={()=> {
            const result = exportJson(instance)
            
            const data = JSON.stringify(result, null, 2)

            const file = new File([data], `${instance.id}-data.json`, { type: "application/json" })
            
            const url = URL.createObjectURL(file)

            var a = document.createElement("a");
            a.classList.add("hidden");
            a.href = url;
            a.download = file.name;
            a.click();

            window.URL.revokeObjectURL(url)
        }}
        variant={"link"}>
            Export data
        </Button>
    )
}