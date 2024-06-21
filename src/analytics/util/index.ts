export const calculatePercentageChange = (current: number, previous: number): string => {
    if (previous === 0) {
        return current > 0 ? '+100%' : '+0%';
    }
    const change = ((current - previous) / previous) * 100;
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change.toFixed(2)}%`;
}

export const millisecondsToReadableTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30); // Rough approximation
    const years = Math.floor(months / 12);

    return {
        years,
        months: months % 12,
        days: days % 30,
        hours: hours % 24,
        minutes: minutes % 60,
        seconds: seconds % 60
    };
}