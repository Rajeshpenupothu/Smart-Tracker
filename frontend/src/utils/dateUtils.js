/**
 * Date utility functions for the Smart Tracker application.
 */

/**
 * Formats an ISO date string (YYYY-MM-DD) to DD:MM:YYYY
 * @param {string} dateStr 
 * @returns {string}
 */
export const formatDisplayDate = (dateStr) => {
    if (!dateStr) return '';
    try {
        const [year, month, day] = dateStr.split('-');
        return `${day}:${month}:${year}`;
    } catch (e) {
        return dateStr;
    }
};

/**
 * Converts a DD:MM:YYYY string back to YYYY-MM-DD
 * @param {string} displayStr 
 * @returns {string}
 */
export const parseDisplayDate = (displayStr) => {
    if (!displayStr) return '';
    try {
        const [day, month, year] = displayStr.split(':');
        return `${year}-${month}-${day}`;
    } catch (e) {
        return displayStr;
    }
};
捉
