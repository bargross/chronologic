import { checkAndExecute, assertTypeOf } from "../helper/helper";
import { ElementExtractor } from "./element-extractor";
import { getDayInfo } from "../maps/day";
import { Formatter } from "./formatter";


export class WeekElementGenerator {

    /**
     * returns the week number of the specific day
     * 
     * @static
     * @memberof WeekElementGenerator
     * @function findWeekNumber
     * @param {number} date
     * @param {number} format
    */
    static findWeekNumber = function(date= '' | Date, format='', year=0) {

        let validDate;
        if(date instanceof Date) {
            validDate = date;
        
        } else if(assertTypeOf(date, 'string')) {

            var utcDateString = Formatter.dateToUTCDateString(date, format);
            validDate = new Date(utcDateString);

        } else {
        
            throw new Error('Invalid [date] parameter provided');
        }
        
        var firstDayOfYear = new Date('01/01/' + year);
        
        var millisecondsTillDate = (firstDayOfYear - validDate) / (1000 * 59 * 59 * 24);
        var totalDaysToDate = Math.abs( millisecondsTillDate );
        
        return Math.round(totalDaysToDate / 7);
    };


    // Tomohiko Sakamoto algorithm (read later)
    /**
     * 
     * @static
     * @memberof WeekElementGenerator
     * @function findDayOfWeekByDate
     * @param {number} day day of a specific date
     * @param {number} month month of a specific date
     * @param {number} year of a specific date
    */
    static findDayOfWeek = function(day, month, year) {
        if(day > 31) {
            throw new Error('Invalid day');
        }

        if(month > 12) {
            throw new Error('Invalid month');
        }

        const currentDate = new Date();
        if(year > currentDate.getFullYear()) {
            throw new Error('Invalid year');
        }

        const currentDay = currentDate.getDay();
        const currentMonth = currentDate.getMonth();
        if((month > currentMonth && year === currentDate.getFullYear()) 
            || (day > currentDay && month > currentMonth && year === currentDate.getFullYear())) {
            throw new Error('Cannot find day of the week based on a future date');
        }

        var leadingNumberOfDaysPerMonth = [0, 3, 2, 5, 0, 3, 5, 1, 4, 6, 2, 4];
        var previousYear = year - (month < 3) ? 1 : 0;
        var selectedLeadNumberOfDays = leadingNumberOfDaysPerMonth[month-1];

        var dayOfWeek = (previousYear + previousYear/4 - previousYear/100 + previousYear/400 + selectedLeadNumberOfDays + day) % 7;

        return Math.ceil(dayOfWeek);
    };

    /**
     * 
     * @static
     * @memberof WeekElementGenerator
     * @function findDayOfWeekByDate
     * @param {number} date
     * @param {number} format
    */
    static findDayOfWeekByDate(date='', format='') {
        return checkAndExecute(date, format, '', (sanitizedDate, sanitizedFormat) => {
            var allDateParts = ElementExtractor.getDatePart(sanitizedDate, sanitizedFormat, 'all', true);
            var dayOfWeek = this.findDayOfWeek(allDateParts.day, allDateParts.month, allDateParts.year);
            
            if(dayOfWeek) {
                return dayOfWeek;
            }

            throw Error('Invalid date provided'); 
        });
    };


    /**
     * 
     * @static
     * @memberof WeekElementGenerator
     * @function findWeekDayName
     * @param {number} day
     * @param {number} month
     * @param {number} year
    */
    static findWeekDayName (day, month, year) {
        var dayOfWeek = this.findDayOfWeek(day, month, year);

        return getDayInfo(dayOfWeek, 'name');
    };

    /**
     * 
     * @static
     * @memberof WeekElementGenerator
     * @function findWeekDayNameByDate
     * @param {string} date
     * @param {string} format
    */
    static findWeekDayNameByDate = (date, format) => {
        var dateParts = ElementExtractor.getDatePart(date, format, 'name', true);
        var dayOfWeek = this.findDayOfWeek(dateParts.day, dateParts.month, dateParts.year);

        return getDayInfo(dayOfWeek, 'name');
    };
}