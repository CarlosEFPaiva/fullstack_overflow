function addLeftZeroIfNeeded(number: number) {
    if (number < 10) {
        return `0${number}`;
    }
    return `${number}`;
}

export function adjustDate(rawDate: Date): string {
    if (!rawDate) return null;
    const year = rawDate.getFullYear();
    const month = addLeftZeroIfNeeded(rawDate.getMonth() + 1);
    const date = addLeftZeroIfNeeded(rawDate.getDate());
    const hours = addLeftZeroIfNeeded(rawDate.getHours());
    const minutes = addLeftZeroIfNeeded(rawDate.getMinutes());

    return `${year}-${month}-${date} ${hours}:${minutes}`;
}
