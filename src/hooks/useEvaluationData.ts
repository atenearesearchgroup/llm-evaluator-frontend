import type { EvaluationResultResponse } from "@/model/evaluation";
import { useEffect, useState } from "react";

export interface EvaluationData {
    list: DataInfo[];
}

export interface DataInfo {
    title: string;
    syntax_prompt?: string;
    instances: InstanceInfo[];
}

export interface InstanceInfo {
    id: number;
    status: 'completed' | 'running' | 'failed';
    description: string;
    evaluation?: EvaluationResultResponse;
}

const defaultData: EvaluationData = {
    list: []
};

const LOCAL_STORAGE_KEY = 'evaluationInfo';

// save into local storage
export const useEvaluationData = () => {
    // const [data, setData] = useState<EvaluationData>({ list: [] });

    // useEffect(() => {
    //     const localData = localStorage.getItem(LOCAL_STORAGE_KEY);
    //     if (localData) {
    //         setData(JSON.parse(localData));
    //     }
    // }, []);

    const saveExecutionData = (list: string[]) => {
        // setData({ list });
        // localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({ list }));
    };

    const addEvaluation = (data: DataInfo) => {
        const localData = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (localData) {
            const parsedData : EvaluationData = JSON.parse(localData);
            const newData = [...parsedData.list, data];
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({ list: newData }));
            return newData.length - 1;
        }

        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({ list: [data] }));
        return 0;
    }

    const listEvaluations = () => {
        const localData = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (localData) {
            return JSON.parse(localData).list?.map((item: DataInfo) => item.title);
        }
        return [];
    }

    const getExecutionData = () => {
        const localData = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (localData) {
            return JSON.parse(localData) as EvaluationData;
        }
        return defaultData;
    }

    const getExecutionInstance = (id: number) => {
        return getExecutionData().list[id] ?? null
    }

    const updateExecutionInstance = (id: number, instance: DataInfo) => {
        const data = getExecutionData();
        data.list[id] = instance;
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
    }


    return {getExecutionData, getExecutionInstance, saveExecutionData, addEvaluation, listEvaluations, updateExecutionInstance};
}

const useEvalReducer = (state: EvaluationData, action: any) => {
    switch (action.type) {
        case 'add':
            return { list: [...state.list, action.payload] };
        case 'remove':
            return { list: state.list.filter((item) => item !== action.payload) };
        default:
            return state;
    }
}