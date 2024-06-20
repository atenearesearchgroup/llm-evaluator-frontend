import { useState } from "react"

// NOT USED

type DeleteDraftProps = {
    draftId: Number
}

export const DeleteChat = ({ draftId }: DeleteDraftProps) => {
    const [modal, setModal] = useState(false)

    const deleteDraft = async () => {
        const response = await fetch(`/api/chats/${draftId}`, {
            method: 'DELETE'
        })

        if (response.ok) {
            setModal(false)
            window.location.href = '/'
        }
    }

    return (
        <div>
            <button className="bg-red-500 backdrop-blur-md m-3 px-2 py-1 rounded-md ml-auto flex " onClick={() => setModal(true)}>
                Delete Instance
            </button>

            <div className={`${modal ? '' : "hidden"} bg-slate-900 backdrop-blur-md bg-opacity-50 flex justify-center items-center absolute top-0 right-0 bottom-0 left-0`}>
                <div className="bg-slate-700 bg-opacity-70 backdrop-blur-sm px-16 py-14 rounded-md text-center">
                    <h1 className="text-xl mb-4 font-bold ">Confirm Deletion</h1>
                    <button className="bg-indigo-500 px-4 py-2 rounded-md text-md text-white"
                        onClick={() => setModal(false)}>Cancel</button>
                    <button className="bg-red-500 px-7 py-2 ml-2 rounded-md text-md text-white font-semibold"
                        onClick={deleteDraft}>Delete</button>
                </div>
            </div>
        </div>
    )
}