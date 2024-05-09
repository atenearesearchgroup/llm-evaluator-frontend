import type { IntentInstance } from "./model";

export type DraftGroup = {
    id: number;
    title: string;
    llm: string;
    currentPhase: string;
    currentDecision: string | null;
    lastDate: Date;
}

export type DraftMessage = {
    response: string;
    id: number;
    date: Date;
    phaseId: string;
    draftId: number;
    prompt: string;
    score: number | null;
}


/*

    @Id
    @GeneratedValue
    private long id;

    @ManyToOne
    @JsonIgnoreProperties("drafts")
    @JoinColumn(name = "instance_id")
    private IntentInstanceEntity intentInstance;

    @JsonIgnoreProperties("draft")
    @OneToMany(mappedBy = "draft", cascade = CascadeType.ALL)
    private List<PromptIterationEntity> promptIterations;

    private int draftNumber;
    private boolean finalized;
*/

export type Draft = {
    id: number;
    intentInstance?: IntentInstance;
    draftNumber: number;
    actualNode: string;
    finalized: boolean;
    promptIterations: PromptIteration[];
}

/*
 @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String type;
    //    @Id
    private int iteration;

    @JsonIgnoreProperties("promptIterations")
    @ManyToOne
    private DraftEntity draft;

    @JsonIgnoreProperties("promptIteration")
    @OneToMany(mappedBy = "promptIteration", cascade = CascadeType.ALL)
    private List<MessageEntity> messages;
    */

export type PromptIteration = {
    id: number;
    type: string;
    iteration: number;
    draft?: Draft;
    messages: Message[];
}

type Message = {
    id: number;
    timestamp: Date;
    content: string;
    promptIteration?: PromptIteration;
}

export type UserMessage = {

} | Message

export type AIMessage = {
    score: number
} | Message
