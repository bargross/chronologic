import { TimeDetector } from './chronologic/time/time-detector';
import { Week } from './chronologic/date/week'
import { getMonthInfo } from './chronologic/maps/month';
import { findPosition } from './chronologic/maps/format';
import { Generator } from './chronologic/date/calendar-generator';
import { checkAndExecute, isNumeric, isEmpty } from './chronologic/utils/utils';
import { Validator } from './chronologic/date/validator';
import { Format } from './chronologic/date/format';
import { ElementExtractor } from './chronologic/date/element-extractor';
import { BehaviorSubject } from './node_modules/rxjs/index';

/**
 * chronologic: A date/time parser
 * this library can be used to parse, reformat and generate full dates, weeks, months or an entire year
 * with all essential information 
 * 
 * @param {string} date
 * @param {string} format
 * @param {object} options
 */
export class Chronologic {
    
    // variables
    day = null;
    month = null;
    year = null;
    week = null;
    time = null;
    currentDate = null;
    lastDayOfTheYear = null;
    timeFormat = null;
    weeksLeft       = null;
    currentWeek     = null;
    currentMonth    = null;
    totalMonthsLeft = null;
    isLeapYear      = null;
    isCurrentYear   = null;

    // observers
    dateChange$ = new BehaviorSubject(null);
    formatChange$ = new BehaviorSubject(null);
    optionsChange$ = new BehaviorSubject(null);

    // observables
    date = dateChange$.asObservable();
    format = formatChange$.asObservable();
    options = optionsChange$.asObservable();

    constructor(date='', format='', options={}) {
    
        if(isEmpty(date)) {
            throw new Error('Invalid date parameter provided');
        }

        if(isEmpty(format)) {
            throw new Error('Invalid date parameter provided');
        }

        let dateOnly;
        let time;
        if(TimeDetector.includesTime(date)) {
            var dateArrayString = date.split(',');
            dateOnly = dateArrayString[0];
            time = TimeDetector.detectTime(dateArrayString[1])
        }
        
        var day   = ElementExtractor.getDay(date, format);
        var month = ElementExtractor.getMonth(date, format);
        var year  = ElementExtractor.getYear(date, format);

        this.timeFormat = Format.inferTimeFormat(time);
        this.day    = day;
        this.month  = month;
        this.year   = year;
        this.time   = time;

        this.dateChange$.next(dateOnly);
        this.formatChange$.next(format);
        this.optionsChange$.next(options);

        var defaultFormat = 'dd/mm/yyyy';
        
        var week = Week.findWeekNumber(date, format, year);
        this.week  = week;

        var actualDate = new Date();
        var actualTime = actualDate.toLocaleTimeString();
        var actualDateString = actualDate.toLocaleDateString();

        var dayPart = ElementExtractor.getDay(actualDateString, defaultFormat);
        var monthPart = ElementExtractor.getMonth(actualDateString, defaultFormat);
        var yearPart = ElementExtractor.getYear(actualDateString, defaultFormat);    
        var nameOfCurrentDay = Week.findWeekDayNameByDate(actualDateString, defaultFormat);

        this.currentDay  = {
            name: nameOfCurrentDay,
            weekDay: Week.findDayOfWeek(dayPart, monthPart, yearPart),
            day: dayPart,
            timeSet: { 
                time: actualTime, 
                format: Format.inferTimeFormat(actualTime) 
            },
            week: Week.findWeekNumber(actualDate, defaultFormat, yearPart),
            year: yearPart,
            month: monthPart,
            fullDate: `${dayPart}/${ (monthPart > 9 ? monthPart : '0'+monthPart) }/${yearPart}`,
            format: defaultFormat
        };

        var dateOfLastDayOfYear = `31/12/${year}`;
        var nameOfLastDayOfYear = Week.findWeekDayNameByDate(dateOfLastDayOfYear, defaultFormat);
        var lastDayDatePart = ElementExtractor.getDay(dateOfLastDayOfYear, defaultFormat);
        var lastMonthDatePart = ElementExtractor.getMonth(dateOfLastDayOfYear, defaultFormat);

        this.lastDayOfTheYear   = { 
            name: nameOfLastDayOfYear,
            weekDay: Week.findDayOfWeek(lastDayDatePart, lastMonthDatePart, year),
            day: allDateParts.day,
            timeSet: { 
                time: '00:00:00', 
                format: Format.inferTimeFormat(this.time) 
            },
            week: Week.findWeekNumber(dateOfLastDayOfYear, defaultFormat, year),
            year: year,
            month: allDateParts.month,
            fullDate: `${lastDayDatePart}/${ (lastMonthDatePart > 9 ? lastMonthDatePart : '0'+lastMonthDatePart) }/${year}`,
            format: defaultFormat
        };

        this.weeksLeft       = 52 - week;
        this.currentWeek     = week;
        this.currentMonth    = month;
        this.totalMonthsLeft = 12 - actualDate.getMonth();
        this.isLeapYear      = Validator.isLeapYear(year);
        this.isCurrentYear   = year == actualDate.getFullYear();
    }
    
    /**
     * this function allows you to find any time strings within a date string
     * 
     * @param {string} date
     */
    detectTime(date) {
        return TimeDetector.detectTime(date);
    }
    
    /**
     * returns the time format of the time given
     * 
     * @param {string} time
     */
    getTimeFormat(time) {
        if(Validator.isValidTime(time)) {
            return Format.inferTimeFormat(time);
        } 
        return '';
    }

    /**
     * generates a full month from a given date
     * 
     * @param {string} date
     * @param {string} format
     */
    genMonthFromDate(date, format) {
        var dateParts = ElementExtractor.getDatePart(date, format, 'all', true);
        var monthInfo = getMonthInfo(dateParts.month, 'all', dateParts.year);
        var positions = findPosition(format, 'all');
        return Generator.generateMonthFromDate(1, monthInfo.length, dateParts.month, dateParts.year, positions);
    }

    // setters
    /**
     * 
     * 
     */
    getDateAsObservable() { return this.date; }
    /**
     * 
     * 
     */
    getFormatAsObservable() {  return this.format; }
    /**
     *
     * 
     */
    getOptionsAsObservable() { return this.options; }

    // setters
    /**
     * 
     * @param {string} date
     */
    setDate(date) { this.dateChange$.next(date); }

    /**
     * 
     * @param {string} format
     */
    setFormat(format) { this.formatChange$.next(format); }
    
    /**
     * 
     * @param {string} options
     */
    setOptions(options)  { this.optionsChange$.next(options); }

    /**
     * 
     * @param {string} date
     * @param {string} format
     */
    getMonthCalendarName(date, format) {
        var result = checkAndExecute(date, format, '', (date, format) => {
            var month = ElementExtractor.getMonth(date, format);
            var year = ElementExtractor.getYear(date, format);
            return getMonthInfo(month, 'name', year);
        });

        if(result === '') {
            return checkAndExecute(this.date, this.format);
        } else {
          return  result;
        }
    }

    // /**
    //  * generates a full month from a given date
    //  * 
    //  * @param {string} date
    //  * @param {string} format
    //  */
    // getCurrentYear: function() {
    //     return this.currentYear;
    // },

    // /**
    //  * generates a full month from a given date
    //  * 
    //  * @param {string} date
    //  * @param {string} format
    //  */
    // getCalendarYear: function() {
    //     return this.year;
    // },

    /**
     * gets the day for a given date, if no date - format is provided, 
     * it defaults to the current date or given date-format when chronologic is declared
     * 
     * @param {string} date
     * @param {string} format
     */
    getDay(date, format) {
        let day = ElementExtractor.getDay(date, format);
        if(isEmpty(day)) {
            return ElementExtractor.getDay(this.date, this.format);
        }
        return day;
    }

    /**
     * gets the month for a given date, if no date - format is provided, 
     * it defaults to the current date or given date-format when chronologic is declared
     * 
     * @param {string} date
     * @param {string} format
     */
    getMonth(date, format) {
        let month = ElementExtractor.getMonth(date, format);
        
        if(isEmpty(month)) {
            return ElementExtractor.getMonth(this.date, this.format);
        }

        return month;
    }

    /**
     * extracts the year from the given date, if no date - format is provided, 
     * it defaults to the current date or given date-format when chronologic is declared
     * 
     * @param {string} date
     * @param {string} format
     */
    getYear(date, format) {
        let year = ElementExtractor.getYear(date, format);
        
        if(isEmpty(year)) {
            return ElementExtractor.getYear(this.date, this.format);
        }

        return year;
    }

    /**
     * generates a full month from a given date
     * 
     */
    toString() {

        if(isEmpty(this.date)) {
            return '';
        }
        
        return this.date;
    }

    /**
     * returns the current day, with useful info
     */
    getCurrentDay() {
        return this.currentDay;
    }

    /**
     * returns the locations of the day, month and year elements within a string with xx/xx/xxxx format
     * 
     * @param {string} format
     */
    getLocationsInDateString(format) {
        return findPosition(format, 'all');
    }

    /**
     * returns a number representing the week number the given day falls onto within the year
     * 
     * @param {string} date
     * @param {string} format
     */
    getWeekNumber(date, format) {
        
        if(isEmpty(date) && isEmpty(format)) {
            var year = ElementExtractor.getYear(this.date, this.format);
            return Week.findWeekNumber(this.date, this.format, year)
        }

        var year = ElementExtractor.getYear(date, format);
        return Week.findWeekNumber(date, format, year);
    }

    /**
     * returns a number indicating the numeric representation of a day within a 7 day week, e.g.: day 31 could fall on the second day of the week, there 2 would be returned
     * the number will fall between 1-7
     * 
     * @param {number} day
     * @param {number} month
     * @param {number} year
     */
    getDayOfWeek(day, month, year) {
        return Week.findDayOfWeek(day, month, year);
    }

    /**
     * returns the length of a given month
     * 
     * @param {number, string} date
     */
    getMonthLength(month, year) {
        if(month > 0 && year > 0) {
            return ElementExtractor.getMonthLength(month);
        } else {
            return 0;
        }
    }

    /**
     * returns a boolean indicating whether the given year is a leap year
     * 
     * @param {number, string} year
     */
    isLeapYear(year) {
        switch(typeof year) {
            case 'number': return isLeapYear(year);
            case 'string':
                if(!isNumeric(year) || (year.length !== 2 || year.length != 4) ) {
                    return false;
                } 
                    return Validator.isLeapYear(parseInt(year));
            case 'object':
                if(year instanceof Date) {
                    return Validator.isLeapYear(year.getFullYear());
                }

                console.warn('Invalid object type, only (Date) can be passed as parameter');
                return false;
            default: 
                console.warn('Invalid argument type');
                return false;
        }
    }

    /**
     * returns a boolean indicating whether the given year is valid
     * 
     * @param {number, string} year
     */
    isValidYear(year) {
        return Validator.isValidYear(year);
    }

    /**
     * returns a boolean indicating whether the given date contains a time substring
     * 
     * @param {string} date
     */
    includesTime(date) {
        return Validator.includesTime(date);
    }

    /**
     * returns a boolean indicating whether the given date contains a time substring
     * 
     * @param {string} date
     */
    resetOptions() { this.optionsChange$.next(null); }
}