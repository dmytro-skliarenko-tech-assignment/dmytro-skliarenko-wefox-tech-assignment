import { AxiosResponse } from "axios";
import { useState } from "react";
import { UseApi, UseFetchData } from "../Types";

export function useApi<Type>(apiFunc: (...args: any[]) => Promise<AxiosResponse<any, any>>): UseApi<Type> {
    const [data, setData] = useState<UseFetchData<Type>>();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<unknown | null>(null);

    const perform = async (...args: any[]) => {
        setIsLoading(true);
        setError(null);
        try {
            const result: any = await apiFunc(...args);
            setData(result.data);
            return result;
        } catch (e) {
            setError(e);
        } finally {
            setIsLoading(false);
        }
    }

    return ({ data, isLoading, error, perform });
}
