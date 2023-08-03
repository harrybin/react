/**
 * Formats a valid @param dateString to be presented on the UI. When dateString
 * cannot be parsed, returns '-'.
 * @param dateString A string value representing a date and time stamp.
 * @returns A well-formatted date ('dd.MM.yyyy HH:mm:ss) or '-'
 */
export const dateTimeFormatter = (dateString: string): string => {
    const date = Date.parse(dateString);
    if (!date) {
        return '-';
    }

    return dateTimeFormat.format(date);
};

/** global formatter const for performance reasons */
const dateTimeFormat = Intl.DateTimeFormat('de-DE', {
    timeStyle: 'medium',
    dateStyle: 'short',
});
