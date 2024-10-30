import { MESSAGE_INVALID_SYNTAX_SCORE, MESSAGE_SCORE_MISSING } from "@/utils/constants";
import { Star, StarOff } from "lucide-react";

export type ScoreRepresentationProps = {
    score?: number;
}

export const ScoreRepresentation = ({score} : ScoreRepresentationProps) => {
    if (score == null || score == MESSAGE_SCORE_MISSING) return < ><StarOff className={"size-[0.75rem]"} /> <p>N/A</p></>
    if (score === MESSAGE_INVALID_SYNTAX_SCORE) return <><StarOff className={"size-[0.75rem]"} /> <p>Invalid Syntax</p></>
    
    return <><Star className={"size-[0.75rem]"} /> {score}</>
}