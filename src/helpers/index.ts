export const formatDateString = (dateStr: string | undefined) => {
    if (dateStr == null) return '';
    return new Date(dateStr).toLocaleDateString();
}

export const formatDateTimeString = (dateStr: string | undefined) => {
    if (dateStr == null) return '';
    return new Date(dateStr).toLocaleString();
}

export const isEmpty = (value: any) => {
    return (value == null || value.length === 0);
}

export const isNotEmpty = (value: any) => !isEmpty(value);

export const limitString = (str: string | undefined) => {
    if (isNotEmpty(str) && (str as string).length > 100) {
        return str?.slice(0, 100) + '...';
    }
    return str;
}
