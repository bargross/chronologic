import { findPosition } from "../maps/format";
import { isEmpty } from "../utils/utils";
import { getMonthInfo } from "../maps/month";

export class ElementExtractor {

    /**
     * Extracts a specific date element from a date string
     * 
     * @static
     * @memberof Generator
     * @function getDatePart
     * @param {string} date
     * @param {string} format
     * @param {string} option
     * @param {boolean} parse
     */
    static getDatePart(date='', format='', option='', parse) {
        return checkAndExecute(date, format, -1, (curatedDate, curatedFormat) => {
            return this.get(curatedDate, curatedFormat, option, parse)
        });
    }

    /**
     * Gets the coordinates of a specific element of the date string
     * and returns the actual value as a string
     * 
     * @static
     * @memberof Generator
     * @function get
     * @param {string} date
     * @param {string} format
     * @param {string} option
     * @param {boolean} parse
     */
    static get(date, format, option, parse) {

        if(isEmpty(date)) {
            throw new Error('Cannot extract date element, Invalid [date] parameter provided');
        }

        if(isEmpty(format)) {
            throw new Error('Cannot extract date element, Invalid [date] parameter provided');
        }

        if(isEmpty(option)) {
            throw new Error('Cannot extract date element, Invalid [date] parameter provided');
        }

        if(isEmpty(parse)) {
            throw new Error('Cannot extract parse element, Invalid [parse] parameter provided');
        }

        let position = null;
        switch(option) {
            case 'day':
                position = findPosition(format, 'day');
                break;
            case 'month':
                position = findPosition(format, 'month');
                break;
            case 'year':
                position = findPosition(format, 'year');
                break;
            case 'all':
                position = findPosition(format, 'all');
                break;
            default:
                throw new Error('Invalid option provided');
        }

        if(position === -1) {
            console.error(option + ' not found!');
            
            return position;
        }
        
        var part = this.getDatePartByPosition(date, position);
        if(parse) {   
            if(option === 'all') {
                Object.keys(part).forEach(key => {
                    part[key] = parseInt(part[key]);
                });
                return part;
            } else {
                return parseInt(part);
            }
        }

        return part
    }

    /**
     * Extracts a date element if provided with an object containing the positioning of the elements in a date string
     * i.e.: 11/xx/xxxx, where positioning is { start: 0, end: 2 }
     * 
     * @static
     * @memberof Generator
     * @function getDatePartByPosition
     * @param {string} date
     * @param {object} position
     */
    static getDatePartByPosition(date, position) {

        if(isEmpty(date)) {
            throw new Error('Cannot extract date element by position, invalid [date] parameter provided');
        }

        if(isEmpty(position)) {
            throw new Error('Cannot extract date element by position, invalid [position] parameter provided');
        }

        // var count = 0;
        var keys = Object.keys(position);
        var values = {
            day: undefined,
            month: undefined,
            year: undefined
        };

        switch(keys.length) {
            case 2:
                return date.substring(position.start, position.end);
            case 3:
                keys.forEach( key => {
                    values[key] = date.substring(position[key].start, position[key].end);
                });

                return values;
            default:
                console.warn('Invalid positions in object');
                return;
        }
    }


    /**
     * Extracts the day from a date
     * 
     * @static
     * @memberof Generator
     * @function getDay
     * @param {string} date
     * @param {string} format
     */
    static getDay(date='', format='') {
        
        if(isEmpty(date)) {
            throw new Error('Cannot extract date element by position, invalid [date] parameter provided');
        }

        if(isEmpty(format)) {
            throw new Error('Cannot extract date element by position, invalid [format] parameter provided');
        }

        return this.getDatePart(date, format, 'day', true);
    }

    /**
     * Extracts the month from a date
     * 
     * @static
     * @memberof Generator
     * @function getMonth
     * @param {string} date
     * @param {string} format
     */
    static getMonth(date='', format='') {

        if(isEmpty(date)) {
            throw new Error('Cannot extract month, invalid [date] parameter provided');
        }

        if(isEmpty(format)) {
            throw new Error('Cannot extract month, invalid [format] parameter provided');
        }

        return this.getDatePart(date, format, 'month', true);
    }

    /**
     * Extracts the year from a date
     * @static
     * @memberof Generator
     * @function getYear
     * @param {string} date
     * @param {string} format
     */
    static getYear(date='', format='') { 

        if(isEmpty(date)) {
            throw new Error('Cannot extract year, invalid [date] parameter provided');
        }

        if(isEmpty(format)) {
            throw new Error('Cannot extract year, invalid [format] parameter provided');
        }

        return this.getDatePart(date, format, 'year', true); 
    }

    /**
     * Gets the specific length for a month, i.e.: 1 (Jan) = 31 days
     * 
     * @static
     * @memberof Generator
     * @function getMonthLength
     * @param {number} month
     */
    static getMonthLength(month) {

        if(isEmpty(month)) {
            throw new Error('Cannot extract month, invalid [month] parameter provided');
        }

        return getMonthInfo(month, 'length');
    }
}