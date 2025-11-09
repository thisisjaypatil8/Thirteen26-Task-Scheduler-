/**
 * Parses a "HH:MM" string into a Date object for today.
 */
export const parseTime = (timeString) => {
    const [hours, minutes] = timeString.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0); // set hours, minutes, seconds, ms
    return date;
};

/**
 * Formats milliseconds into a "Xh Ym" or "Ym Zs" string.
 */
export const formatTimeRemaining = (ms) => {
    if (ms < 0) ms = 0;

    let seconds = Math.floor(ms / 1000);
    let minutes = Math.floor(seconds / 60);
    let hours = Math.floor(minutes / 60);

    seconds = seconds % 60;
    minutes = minutes % 60;

    if (hours > 0) {
        return `${hours}h ${minutes}m left`;
    }
    if (minutes > 0) {
        return `${minutes}m ${seconds}s left`;
    }
    return `${seconds}s left`;
};