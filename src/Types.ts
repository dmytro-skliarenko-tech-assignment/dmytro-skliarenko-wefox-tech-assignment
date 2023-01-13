export type Post = {
    id?: number,
    title: string,
    content: string,
    lat: string,
    long: string,
    image_url: string,
    created_at?: string,
    updated_at?: string,
}

export type UseFetchData<Type> = Type | null | undefined;

export type UseApi<Type> = {
    isLoading: boolean,
    error?: unknown | null,
    data?: UseFetchData<Type>,
    perform: Function,
}