import { TimeDetector } from './chronologic/time/time-detector';
import { WeekElementGenerator } from './chronologic/date/week-element-generator'
import { getMonthInfo } from './chronologic/maps/month';
import { findPosition } from './chronologic/maps/format';
import { Generator } from './chronologic/date/calendar-generator';
import { checkAndExecute, isNumeric, isEmpty } from './chronologic/helper/helper';
import { Validator } from './chronologic/date/validator';
import { Formatter } from './chronologic/date/formatter';
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
export function chronologic(date='', format='', options={}) {
    
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

    this.timeFormat = Formatter.inferTimeFormat(time);
    this.day    = day;
    this.month  = month;
    this.year   = year;
    this.time   = time;

    const dateWatcher = new BehaviorSubject(dateOnly);
    this.dateWatcher$ = dateWatcher.asObservable();
    this.date         = dateWatcher.asObservable();
    
    const formatWatcher = new BehaviorSubject(format);
    this.formatWatcher$ = formatWatcher; 
    this.format = formatWatcher.asObservable();

    var defaultFormat = 'dd/mm/yyyy';
    
    var week = WeekElementGenerator.findWeekNumber(date, format, year);
	this.week  = week;

    var actualDate = new Date();
    var actualTime = actualDate.toLocaleTimeString();
    var actualDateString = actualDate.toLocaleDateString();

    var dayPart = ElementExtractor.getDay(actualDateString, defaultFormat);
    var monthPart = ElementExtractor.getMonth(actualDateString, defaultFormat);
    var yearPart = ElementExtractor.getYear(actualDateString, defaultFormat);    
    var nameOfCurrentDay = WeekElementGenerator.findWeekDayNameByDate(actualDateString, defaultFormat);

    this.currentDay  = {
        name: nameOfCurrentDay,
        weekDay: WeekElementGenerator.findDayOfWeek(dayPart, monthPart, yearPart),
        day: dayPart,
        timeSet: { 
            time: actualTime, 
            format: Formatter.inferTimeFormat(actualTime) 
        },
        week: WeekElementGenerator.findWeekNumber(actualDate, defaultFormat, yearPart),
        year: yearPart,
        month: monthPart,
        fullDate: `${dayPart}/${ (monthPart > 9 ? monthPart : '0'+monthPart) }/${yearPart}`,
        format: defaultFormat
    };

    var dateOfLastDayOfYear = `31/12/${year}`;
    var nameOfLastDayOfYear = WeekElementGenerator.findWeekDayNameByDate(dateOfLastDayOfYear, defaultFormat);
    var lastDayDatePart = ElementExtractor.getDay(dateOfLastDayOfYear, defaultFormat);
    var lastMonthDatePart = ElementExtractor.getMonth(dateOfLastDayOfYear, defaultFormat);

    this.lastDayOfTheYear   = { 
        name: nameOfLastDayOfYear,
        weekDay: WeekElementGenerator.findDayOfWeek(lastDayDatePart, lastMonthDatePart, year),
        day: allDateParts.day,
        timeSet: { 
            time: '00:00:00', 
            format: Formatter.inferTimeFormat(this.time) 
        },
        week: WeekElementGenerator.findWeekNumber(dateOfLastDayOfYear, defaultFormat, year),
        year: year,
        month: allDateParts.month,
        fullDate: `${lastDayDatePart}/${ (lastMonthDatePart > 9 ? lastMonthDatePart : '0'+lastMonthDatePart) }/${year}`,
        format: defaultFormat
    };
    
    const watcher$ = new BehaviorSubject(options);

    this.weeksLeft       = 52 - week;
    this.currentWeek     = week;
    this.currentMonth    = month;
    this.totalMonthsLeft = 12 - actualDate.getMonth();
    this.isLeapYear      = Validator.isLeapYear(year);
    this.isCurrentYear   = year == actualDate.getFullYear();

    this.optionsWatcher$ = watcher$;
    this.options         = watcher$.asObservable();
}

chronologic.prototype = {
    
    /**
     * this function allows you to find any time strings within a date string
     * 
     * @param {string} date
     */
    detectTime: function(date='') {
        return TimeDetector.detectTime(date);
    },
    
    /**
     * returns the time format of the time given
     * 
     * @param {string} time
     */
    getTimeFormat: function(time='') {
        if(Validator.isValidTime(time)) {
            return Formatter.inferTimeFormat(time);
        } 
        return '';
    },

    /**
     * generates a full month from a given date
     * 
     * @param {string} date
     * @param {string} format
     */
    genMonthFromDate: function(date='', format='') {
        var dateParts = ElementExtractor.getDatePart(date, format, 'all', true);
        var monthInfo = getMonthInfo(dateParts.month, 'all', dateParts.year);
        var positions = findPosition(format, 'all');
        return Generator.generateMonthFromDate(1, monthInfo.length, dateParts.month, dateParts.year, positions);
    },

    // setters
    /**
     * 
     * 
     */
    getDateAsObservable: function() { return this.date; },
    /**
     * 
     * 
     */
    getFormatAsObservable: function() {  return this.format; },
    /**
     *
     * 
     */
    getOptionsAsObservable: function() { return this.options; },

    // setters
    /**
     * 
     * @param {string} date
     */
    setDate: function(date) { this.date = date; },

    /**
     * 
     * @param {string} format
     */
    setFormat: function(format) { this.formatWatcher$.next(format); },
    
    /**
     * 
     * @param {string} options
     */
    setOptions: function(options)  { this.optionsWatcher$.next(options); },

    /**
     * 
     * @param {string} date
     * @param {string} format
     */
    getMonthCalendarName: function(date='', format='') {
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
    },

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
    getDay: function(date='', format='') {
        let day = ElementExtractor.getDay(date, format);
        if(isEmpty(day)) {
            return ElementExtractor.getDay(this.date, this.format);
        }
        return day;
    },

    /**
     * gets the month for a given date, if no date - format is provided, 
     * it defaults to the current date or given date-format when chronologic is declared
     * 
     * @param {string} date
     * @param {string} format
     */
    getMonth: function(date='', format='') {
        let month = ElementExtractor.getMonth(date, format);
        
        if(isEmpty(month)) {
            return ElementExtractor.getMonth(this.date, this.format);
        }

        return month;
    },

    /**
     * extracts the year from the given date, if no date - format is provided, 
     * it defaults to the current date or given date-format when chronologic is declared
     * 
     * @param {string} date
     * @param {string} format
     */
    getYear:  function(date='', format='') {
        let year = ElementExtractor.getYear(date, format);
        
        if(isEmpty(year)) {
            return ElementExtractor.getYear(this.date, this.format);
        }

        return year;
    },

    /**
     * generates a full month from a given date
     * 
     */
    toString:  function() {

        if(isEmpty(this.date)) {
            return '';
        }
        
        return this.date;
    },

    /**
     * returns the current day, with useful info
     */
    getCurrentDay: function() {
        return this.currentDay;
    },

    /**
     * returns the locations of the day, month and year elements within a string with xx/xx/xxxx format
     * 
     * @param {string} format
     */
    getLocationsInDateString: function(format) {
        return findPosition(format, 'all');
    },

    /**
     * returns a number representing the week number the given day falls onto within the year
     * 
     * @param {string} date
     * @param {string} format
     */
    getWeekNumber: function(date= '', format = '') {
        
        if(isEmpty(date) && isEmpty(format)) {
            var year = ElementExtractor.getYear(this.date, this.format);
            return WeekElementGenerator.findWeekNumber(this.date, this.format, year)
        }

        var year = ElementExtractor.getYear(date, format);
        return WeekElementGenerator.findWeekNumber(date, format, year);
    },

    /**
     * returns a number indicating the numeric representation of a day within a 7 day week, e.g.: day 31 could fall on the second day of the week, there 2 would be returned
     * the number will fall between 1-7
     * 
     * @param {number} day
     * @param {number} month
     * @param {number} year
     */
    getDayOfWeek: function(day, month, year) {
        return WeekElementGenerator.findDayOfWeek(day, month, year);
    },

    /**
     * returns the length of a given month
     * 
     * @param {number, string} date
     */
    getMonthLength: function(month=-1, year=-1) {
        if(month > 0 && year > 0) {
            return ElementExtractor.getMonthLength(month);
        } else {
            return 0;
        }
    },

    /**
     * returns a boolean indicating whether the given year is a leap year
     * 
     * @param {number, string} year
     */
    isLeapYear: function(year) {
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
    },

    /**
     * returns a boolean indicating whether the given year is valid
     * 
     * @param {number, string} year
     */
    isValidYear: function(year) {
        return Validator.isValidYear(year);
    },

    /**
     * returns a boolean indicating whether the given date contains a time substring
     * 
     * @param {string} date
     */
    includesTime: function(date) {
        return Validator.includesTime(date);
    }
};