import { formats, findPosition,  } from "../maps/format";
import { getDatePart, getMonthLength, ElementExtractor } from "./element-extractor";
import { getMonthInfo } from "../maps/month";
import { findDelimiter, checkAndExecute, isEmpty } from "../utils/utils";
import { Week } from "./week";
import { getDayInfo } from '../maps/day';


export class Generator {

    /**
     * Generates days of a full month from a specific date
     * the days are objects with information about the time, weekday, annual week, etc...
     * the object properties should be self-explanatory
     * function has time complexity => O(N+N)
     * 
     * 
     * @static
     * @memberof Generator
     * @function getMonthObject
     * @param {string} date
     * @param {string} format
     */
    static getMonthObject(date='', format='') {
        return checkAndExecute(date, format, '', (date, format) => {
            var month = getDatePart(date, format, 'month', true);
            var dayOne = 1,
                endDay = getMonthLength(month); 
            var year = getDatePart(date, format, 'year', true);
            var positions = findPosition(format, 'all');

            return genMonthFromDate(dayOne, endDay, month, year, findDelimiter(format), positions); 
        });
    };

    // TODO: rewrite this function, so it formats the date based on the position of the day, month and year placeholders in the format string  
    // Unfinished function - hide for now
    // chronologic.prototype.reformat = function(date, oldFormat, newFormat) {
    // deprecated
    /*
        @param
        @return
        @description
    */
    // reformat(format='', dateParts={}) {
    //     return checkAndExecute(this.date, format, '', (date, format) => {
    //         var formatParts = getDatePart(date, format, 'all', false);
    //         let dateContent;

    //         if(dateParts && Object.keys(dateParts).length > 0) {
    //             dateContent = dateParts;
    //         } else {
    //             dateContent = getDatePart(this.date, this.format, 'all');
    //         }

    //         var positions = formats.findPositionPositions(format, 'all');
    //         return replaceMultipleValues(formatParts, positions, dateParts);
    //         // return format.replace(formatParts.day, dateContent.day)
    //         //             .replace(formatParts.month, dateContent.month)
    //         //             .replace(formatParts.year, dateContent.year);
    //     });
    // };

    // Other methods
    // ============================================================

    // time complexity => 
    /*
        @param
        @return
        @description 
    */
    // timeLocaleToString = (date='') => {
    //     var time = detectTime(date);
    //     var inferenceResult = inferTimeFormat(time);
    //     var timeParts = getTimeValue(time, 'all', inferenceResult.hasSeconds, false);
    //     var newTimeString = `${timeParts.hour}:${timeParts.minutes}:${inferenceResults.hasSeconds ? timeParts.seconds : ''}`;

    //     if(!isValidTime(newTimeString, inferenceResult.format)) {
    //         return '00:00:00';
    //     }
    //     return createdTimeString;
    // };

    /**
     * Generates a full year with all information about months and days
     * time complexity => best: O(n), worst: O(n)
     * 
     * @static
     * @memberof Generator
     * @function generateFullYear
     * @param {string} date
     * @param {string} format
     */
   static generateFullYear(date='', format='') {
        let year = checkAndExecute(date, format, -1, (date, format) => {
            return ElementExtractor.getDatePart(date, format, 'year', true);
        });

        if(year === '') {
            year = ElementExtractor.getDatePart(this.date, this.format, 'year', true);
        }

        var months = [];
        var positions = findPosition(format, 'all');
        for(let iMonth = 1; iMonth <= 12; ++iMonth) {
            var monthLength = ElementExtractor.getMonthLength(iMonth, year); 
            var fullMonth = Generator.generateMonthFromDate(1, monthLength, iMonth, year, positions);
            months.push(fullMonth);
        }

        return months;
    };

    /**
     *  Generates a full month by by providing the date and the format
     *  the information is precise and has all information regarding the current month
     *  time complexity => best: O(1), worst: O(n)
     * 
     * @static
     * @memberof Generator
     * @function generateFullMonth
     * @param {string} date
     * @param {string} format
     */
    static generateFullMonth(date, format) {
        if(isEmpty(date)) {
            throw new Error('Cannot generate full month, invalid [date] parameter provided');
        }

        if(isEmpty(format)) {
            throw new Error('Cannot generate full month, invalid [format] parameter provided');
        }

        let month;
        if(date && format) {
            let isValidFormat = false;
            formats.date.forEach( (acceptedFormat) => {
                if(format === acceptedFormat.type) {
                    isValidFormat = true;
                }
            });
            if(isValidFormat) {
                month = ElementExtractor.getMonth(date, format);
            } else {
                console.warn('Invalid format provided, the format provided is not supported');
                return;
            }
        } else {
            month = ElementExtractor.getMonth(this.date, this.format);
        }

        var year = ElementExtractor.getYear(date, format);
        var monthName = getMonthInfo(month, 'name', year);
        var time = { 
            time: '00:00:00',
            format: 'hh:mm:ss' 
        };
        
        var currentMonth = new Date.getMonth();
        return {
            totalDays: ElementExtractor.getMonthLength(month, year),
            name: monthName,
            calendarNumber: month,
            isCurrentMonth: month === currentMonth,
            // days: this.genMonthDays(day, format),
            time: time,
            year: year
        };
    };

    /**
     * returns a full month from a specific date
     * 
     * @static
     * @memberof Generator
     * @function generateMonthFromDate
     * @param {string} from date
     * @param {string} to date
     * @param {number} month
     * @param {number} year
     * @param {string} delimiter
     */
    static generateMonthFromDate = (from, to, month, year, delimiter) => {
        var fullMonth = [];
        var fromDate = new Date(from);
        var toDate = new Date(to);
        
        let firstCall = true;
        let format = 'dd/mm/yyyy';
        while(fromDate !== toDate) {
            let date = [];
            // TODO: test this section, using an array might not be a viable solution to concatenate the date value into one
            // var replaceValue = (positions, date, value) => date.replace(date.substring(positions.start, positions.end), value);

            date[positions.day] = fromDate;
            date[positions.month] = month;
            date[positions.year] = year;

        var dayOfWeek = Week.findDayOfWeek(fromDate, month, year);
        var fromDateString = fromDate.toLocaleDateString();
        var dayInfo = {
                calendarDate: firstCall ? from : date.join(delimiter), 
                dayName: getDayInfo(dayOfWeek, 'name'),
                dayOfWeek: dayOfWeek,
                monthDay: fromDateString,
                timeSet: { time: '00:00:00', format: '' },
                week: Week.findWeekNumber(fromDateString, format, fromDate.getFullYear())
            };

            fullMonth.push(dayInfo);

            if(fromDate == toDate) {
            break;
            }

            fromDate++;        
        }
        
        var fromDateString = fromDate.toLocaleDateString();

        fullMonth.push({
            calendarDate: to, 
            dayName: getDayInfo(dayOfWeek, 'name'),
            dayOfWeek: dayOfWeek,
            monthDay: fromDateString,
            timeSet: { time: '00:00:00', format: '' },
            week: Week.findWeekNumber(fromDateString, format, fromDate.getFullYear())
        });
        
        return fullMonth;
    }
}