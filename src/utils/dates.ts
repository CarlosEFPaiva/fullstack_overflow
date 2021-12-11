export function adjustDate(rawDate: Date): string {
    if (!rawDate) return null;
    const year = rawDate.getFullYear();
    const month = rawDate.getMonth();
    const date = rawDate.getDate();
    const hours = rawDate.getHours();
    const minutes = rawDate.getMinutes();

    return `${year}-${month}-${date} ${hours}:${minutes}`;
}
