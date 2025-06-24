export function timeAgo(date: Date | string | number | null): string {
    if (!date) {
        return '';
    }

    const now = new Date();
    const past = new Date(date);
    const seconds = Math.floor((now.getTime() - past.getTime()) / 1000);

    const intervals: [number, string][] = [
        [60, 's'],             // seconds
        [60 * 60, 'm'],        // minutes
        [60 * 60 * 24, 'h'],   // hours
        [60 * 60 * 24 * 7, 'd'], // days
        [60 * 60 * 24 * 30, 'mo'], // months (approx)
        [60 * 60 * 24 * 365, 'y'], // years
    ];

    if (seconds < 5) return 'just now';

    for (let i = intervals.length - 1; i >= 0; i--) {
        const [intervalInSeconds, label] = intervals[i];
        if (seconds >= intervalInSeconds) {
            const count = Math.floor(seconds / intervalInSeconds);
            return `${count}${label} ago`;
        }
    }

    return `${seconds}s ago`; // fallback
}

export function isBase64Image(str: string): boolean {
    return /^data:image\/(png|jpeg|jpg|gif|webp);base64,/.test(str);
}