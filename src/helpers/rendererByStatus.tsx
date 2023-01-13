import React from "react";
import Loader from "../components/Loader";
import { UseApi, UseFetchData } from "../Types";
import ErrorComponent from "../components/ErrorComponent";

export function renderByStatus<Type>({ isLoading, error, data }: UseApi<Type>) {
    return function(renderData: (data: UseFetchData<Type>) => React.ReactNode) {
        if (error) return <ErrorComponent />
        if (isLoading) return <Loader />
        if (data !== undefined) {
            return renderData(data);
        }
        return null;
    }
}
