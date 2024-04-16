import type { APIRoute } from "astro"
import { Draft, db } from "astro:db";

type DraftForm = {
    title: string;
    llm: string;
}

export const POST: APIRoute = async({request, redirect}) => {

    const form = await request.formData()

    const data : DraftForm = {
        title: form.get('title') as string,
        llm: form.get('llm') as string
    }

    if(!data) return new Response("Invalid form data", { status: 400 })

    // create draft

    const inserted = await db.insert(Draft).values({
        title: data.title,
        llm: data.llm,
        currentPhase: "zero",
        lastDate: new Date()
    }).returning()

    if(inserted) {
        return redirect(`/drafts/${inserted[0].id}`, 303)
    }

    return new Response("Failed to create draft", { status: 500 })
}