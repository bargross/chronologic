import { dayExists } from "../maps/day";
import { monthExists } from "../maps/month";
import { isEmpty, assertTypeOf, isNumeric } from "../helper/helper";

export  class Validator {
   
    /**
     *
     * it checks the months validity by matching the properties
     * the it returns true if the object contains all properties,
     * if the object contains extra properties added thereafter then it
     * is still valid e.g.: month.comparator = function(newMonth) { return this.month == newMonth }
     * this adds a new property to the object which is for the user, and if we do isValidMonth(month)
     * then it will return true as we're only checking for the properties we require not properties added
     * by the user(developer)
     * 
     * @static
     * @memberof Validator
     * @function isValidMonthObject
     * @param {object} month
     */
    static isValidMonthObject = (month={}) => {
        if(!isEmpty(month))
            return (
                month.hasOwnProperty('name') &&
                month.hasOwnProperty('days') &&
                month.hasOwnProperty('calendarNumber') &&
                month.hasOwnProperty('isCurrentMonth') &&
                month.hasOwnProperty('day') &&
                month.hasOwnProperty('time') &&
                month.hasOwnProperty('year')
            );

        return false;
    };


    /**
     *
     *
     * 
     * @static
     * @memberof Validator
     * @function isValidMonth
     * @param {number | string} month
     */
    static isValidMonth = (month) => {
        let validMonth;
        if(assertTypeOf(month, 'number')) {
            validMonth = month;
        } else if(assertTypeOf(month, 'string') && isNumeric(month)) {
            validMonth = parseInt(month);
        }

        if(!validMonth) {
            return false;
        }

        if(month === 0) {
            validMonth = 1;
        }

        return validMonth >= 1 && validMonth <= 12;
    };

    //
    // check whether the year is less or equal to the current year, and if it is it returns true
    // otherwise it checks for the length (amount of digits that compose the number)
    /**
     * 
     * 
     * 
     * @static
     * @memberof Validator
     * @function isValidYear
     * @param {number | string} year
    */
    static isValidYear = (year) => {
        let validYear;
        if(assertTypeOf(year, 'string') && isNumeric(year)) {
            validYear = parseInt(year);
        } else if(assertTypeOf(year, 'number')) {
            validYear = year;
        } else {
            return false;
        }
        
        var getDigitCount = (value) => Math.round(Math.log(value) * Math.LOG10E + 1);
        
        var currentYear = new Date().getFullYear();
        var length = getDigitCount(validYear); 
        var currentLength = getDigitCount(currentYear); // ??
        return length <= currentLength && validYear <= currentYear;
    };

    /**
     *
     *
     * @static
     * @memberof Validator
     * @function isValidDay
     * @param {string} part
     */
    static isValidDay = (part) => {
        if(isEmpty(part)) {
            throw new Error('No day parameter supplied');
        }

        if(assertTypeOf(part, 'string') && isNaN(part)) {
            var numericValue = Number(part);
            return numericValue >= 0 && numericValue <= 12;
        } 
        
        if(part.length > 2) {
            return dayExists(part);
        } 
    };

    /**
     * Evaluates whether a date element is a day
     * 
     * @static
     * @memberof Validator
     * @function isDay
     * @param {number} part
    */
    static isDay = (part) => {
        
        if(isEmpty(part)) {
            throw new Error('No day parameter supplied');
        }

        var isAbbr = this.isAbbreviatedOrFullName(part);
        return (isNumeric(part) && this.isValidDay(part)) || (isAbbr.isFullDayName || isAbbr.isAbbrDay);
    };

    /**
     * Evaluates whether a date element is a month
     * 
     * @static
     * @memberof Validator
     * @function isMonth
     * @param {number} part
    */
    static isMonth = (part) => {

        if(isEmpty(part)) {
            throw new Error('No [day] parameter supplied');
        }

        var isAbbr = this.isAbbreviatedOrFullName(part);
        return (isNumeric(part) && this.isValidMonth(part)) || (isAbbr.isFullMonthName || isAbbr.isAbbrMonth);
    };

    /**
     * Evaluates whether a date element is a year
     * 
     * @static
     * @memberof Validator
     * @function isYear
     * @param {number} part
    */
    static isYear = (part) => {

        if(isEmpty(part)) {
            throw new Error('No [day] parameter supplied');
        }

        return isNumeric(part) && isValidYear(part);
    }

    /**
     * Evaluates whether a date element is such as a month or a day, is an abbreviated representation or full name
     * i.e.: days: Mon or Monday, Tue or Tuesday, etc..., months: Jan or January, Feb or February, etc...
     * 
     * @static
     * @memberof Validator
     * @function isAbbreviatedOrFullName
     * @param {number} part
    */
    static isAbbreviatedOrFullName = (part) => {

        // TODO: Split this function into two, one to evaluate abbreviations and the other to evaluate full names
        if(isEmpty(part)) {
            throw new Error('No date [part] parameter supplied');
        }

        var result = {
            isAbbrDay: false,
            isAbbrMonth: false,
            isFullDayName: false,
            isFullMonthName: false
        };

        if(assertTypeOf(part, 'string')) {
            if(part.length > 1) {
                if(part.length > 3) {
                    result.isFullMonthName = monthExists(part);
                    result.isFullDayName = dayExists(part);
                } else {
                    result.isAbbrDay = monthExists(part);
                    result.isAbbrMonth = dayExists(part);
                }
            }
        }
        return result;
    };

    /**
     * Evaluates a year from a Date data type, to determine whether the year provided within the date is a leap year
     * Time complexity => best: O(1), worse: O(1)
     * 
     * @static
     * @memberof Validator
     * @function isLeapYear
     * @param {number} year
    */
    static isLeapYear = (year) => {

        if(isEmpty(year)) {
            throw new Error('No year parameter supplied');
        }

        var isLeap = (yearVal) => (yearVal / 4) % 1 == 0 ? (yearVal / 100) % 1 != 0 ? true : (yearVal / 400) % 1 == 0 ? true : false : false;
        
        if (assertTypeOf(year, 'number')) {
            return isLeap(year);
        }

        if(assertTypeOf(year, 'string') &&  isNumeric(year)) {
            year = parseInt(year);
            return isLeap(year);
        }

        return false;
    };
}