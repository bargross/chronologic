import { getMonthLength, getDay, getMonth, getYear } from './chronologic/date/element-extractor';
import { TimeDetector } from './chronologic/time/time-detector';
import { WeekElementGenerator } from './chronologic/date/week-element-generator'
import { getMonthInfo } from './chronologic/maps/month';
import { findPosition } from './chronologic/maps/format';
import { Generator } from './chronologic/date/calendar-generator';
import { checkAndExecute, isNumeric, isEmpty } from './chronologic/helper/helper';
import { Validator } from './chronologic/date/validator';
import { Formatter } from './chronologic/date/formatter';
import { ElementExtractor } from './chronologic/date/element-extractor';

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
    this.date   = dateOnly;
	this.time   = time;
    this.format = format;

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
    
    this.weeksLeft       = 52 - week;
    this.currentWeek     = week;
    this.currentMonth    = month;
    this.totalMonthsLeft = 12 - actualDate.getMonth();
    this.isLeapYear      = Validator.isLeapYear(year);
    this.isCurrentYear   = year == actualDate.getFullYear();
    this.options         = options;
}

chronologic.prototype = {
    detectTime: function(date='') {
        return TimeDetector.detectTime(date);
    },
    getTimeFormat: function(time='') {
        if(Validator.isValidTime(time)) {
            return Formatter.inferTimeFormat(time);
        } 
        return '';
    },
    genMonthFromDate: function(date='', format='') {
        var dateParts = ElementExtractor.getDatePart(date, format, 'all', true);
        var monthInfo = getMonthInfo(dateParts.month, 'all', dateParts.year);
        var positions = findPosition(format, 'all');
        return Generator.generateMonthFromDate(1, monthInfo.length, dateParts.month, dateParts.year, positions);
    },

    // setters
    getOriginalDate: function() { return this.date; },
    getOriginalFormat: function() {  return this.format; },
    getOriginalOptions: function() { return this.options; },

    // setters
    setDate: function(date) { this.date = date; },
    setFormat: function(format) { this.format = format; },
    setOptions: function(options)  { this.options = options; },

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
    // setCalendar: function(_calendar) {

    // },
    getCurrentYear: function() {
        return this.currentYear;
    },
    getCalendarYear: function() {
        return this.year;
    },
    getDay: function(date='', format='') {
        let day = ElementExtractor.getDay(date, format);
        if(isEmpty(day)) {
            return ElementExtractor.getDay(this.date, this.format);
        }
        return day;
    },
    getMonth: function(date='', format='') {
        let month = ElementExtractor.getMonth(date, format);
        
        if(isEmpty(month)) {
            return ElementExtractor.getMonth(this.date, this.format);
        }

        return month;
    },
    getYear:  function(date='', format='') {
        let year = ElementExtractor.getYear(date, format);
        
        if(isEmpty(year)) {
            return ElementExtractor.getYear(this.date, this.format);
        }

        return year;
    },
    toString:  function() {
        return this.date;
    },
    getCurrentDay: function() {
        return this.currentDay;
    },
    getLocationsInDateString: function(format) {
        return findPosition(format, 'all');
    },
    getWeekNumber: function(date= '' | {}, format = '') {
        
        if(isEmpty(date) && isEmpty(format)) {
            var year = ElementExtractor.getYear(this.date, this.format);
            return WeekElementGenerator.findWeekNumber(this.date, this.format, year)
        }

        var year = ElementExtractor.getYear(date, format);
        return WeekElementGenerator.findWeekNumber(date, format, year);
    },
    getDayOfWeek: function(day, month, year) {
        return WeekElementGenerator.findDayOfWeek(day, month, year);
    },
    getMonthLength: function(month=-1, year=-1) {
        if(month > 0 && year > 0) {
            return ElementExtractor.getMonthLength(month);
        } else {
            return 0;
        }
    },
    // validation functions
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
    isValidYear: function(year) {
        return Validator.isValidYear(year);
    },
    includesTime: function(date) {
        return Validator.includesTime(date);
    }
};