import { Moment } from 'moment';

export const enumerateDateRange = (start: Moment, end: Moment): Moment[] => {
    const dates = [];
    while (start <= end) {
        dates.push(start);
        // Clone the date so we aren't mutating the original date
        start = start.clone().add(1, 'days')
    }
    return dates
};