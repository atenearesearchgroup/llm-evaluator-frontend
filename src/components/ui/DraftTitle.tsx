import { useEffect, useState } from "react"

interface DraftTitleProps {
    draftId: number
    title: string
}

const updateTitle = async (draftId: number, title: string) => {
    const response = await fetch(`/api/drafts/${draftId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title })
    })

    if (response.ok && response.status === 200) {
        return true
    }

    console.error("Failed to update title", response.status, response.statusText)

    return false;
}

export const DraftTitle = ({ draftId, title }: DraftTitleProps) => {
    const [tempTitle, setTempTitle] = useState(title)
    let channel = new BroadcastChannel('title_change')

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (!updateTitle(draftId, tempTitle))
                return

            channel.postMessage({ newTitle: tempTitle, draftId })
        }, 1000)

        return () => clearTimeout(timeout)
    }, [tempTitle])

    useEffect(() => {
        channel = new BroadcastChannel('title_change')

        return () => channel.close()
    }, [])

    const handleTitleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        setTempTitle(e.target.value)
    }

    return (
        <input
        onChange={handleTitleChange}
        value={tempTitle}
            className="flex bg-slate-700 bg-opacity-70 p-2 rounded-md text-lg font-bold"
        />
    )
}