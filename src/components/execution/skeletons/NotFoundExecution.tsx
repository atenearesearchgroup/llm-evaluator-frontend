
export type NotFoundExecutionProps = {
    id: number;
}

export const NotFoundExecution = ({ id }: NotFoundExecutionProps) => {
    return (
        <main>
            <p>404 - Couldnt find instance with id #{id}</p>
        </main>
    )
}

