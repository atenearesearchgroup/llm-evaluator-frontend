import { Card, CardTitle } from "@/components/ui/card";

export type NotFoundExecutionProps = {
    id: number;
}

export const NotFoundExecution = ({ id }: NotFoundExecutionProps) => {
    return (
        <Card>
            <CardTitle className="p-10 text-center">Couldn't find instances related to execution with id #{id}</CardTitle>
        </Card>
    )
}

