export type IntentModel = {
    modelName: string;
    displayName: string;
}

/**
 @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "intent_model_id")
    private IntentModelEntity intentModel;

    @JsonIgnoreProperties("intentInstance")
    @OneToMany(mappedBy = "intentInstance", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DraftEntity> drafts;

    private String platform;

    @OneToOne(mappedBy = "instance", cascade = CascadeType.ALL, orphanRemoval = true)
    private ModelSettingsEntity modelSettings;
 */

export interface IntentInstance extends EvaluationSettings {
    id: Number;
    platform: string;
    displayName: string;
    intentModel?: IntentModel;
    drafts: Draft[];
    modelSettings: ModelSettings;
} 

test: IntentInstance = {
    id: 1,
    platform: 'test',
    displayName: 'test',
    drafts: [],
    modelSettings: {
        modelName: 'test',
        modelOwner: 'test',
        version: 'test',
        systemPrompt: 'test',
        maxTokens: 1,
        temperature: 1,
        topP: 1,
        frequencyPenalty: 1,
        presencePenalty: 1
    }

}


export type ModelSettings = {
    modelName?: string;
    modelOwner?: string;
    version?: string;
    systemPrompt?: string;
    maxTokens?: number;
    temperature?: number;
    topP?: number;
    frequencyPenalty?: number;
    presencePenalty?: number;
}

export type EvaluationSettings = {
    maxK: number;
    maxDrafts: number;
    maxRepeatingPrompt: number;
}