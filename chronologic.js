import { getMonthLength, getDay, getMonth, getYear } from './chronologic/date/date-element-getters';
import { detectTime, includesTime } from './chronologic/time/time-detect';
import { inferTimeFormat, isValidTime } from './chronologic/time/time';
import { getWeekNumber, getWeekDayNameByDate, getDayOfWeek } from './chronologic/date/date-element-finders'
import { getMonthInfo } from './chronologic/maps/month';
import { findPosition } from './chronologic/maps/format';
import { generateMonthFromDate } from './chronologic/date/calendar-generators';
import { checkAndExecute, isNumeric } from './chronologic/helper/helper';
import { isLeapYear } from './chronologic/date/daate-element-validators';

export function chronologic(date='', format='', options={}) {
    
    let dateOnly;
    let time;
    if(includesTime(date)) {
        var dateArrayString = date.split(',');
        dateOnly = dateArrayString[0];
        time = detectTime(dateArrayString[1])
    }
    
    var day   = getDay(date, format);
    var month = getMonth(date, format);
    var year  = getYear(date, format);

    this.timeFormat = inferTimeFormat(time);
    this.day    = day;
    this.month  = month;
    this.year   = year;
    this.date   = dateOnly;
	this.time   = time;
    this.format = format;

    var defaultFormat = 'dd/mm/yyyy';
    
    var week = getWeekNumber(date, format, year);
	this.week  = week;

    var actualDate = new Date();
    var actualTime = actualDate.toLocaleTimeString();
    var actualDateString = actualDate.toLocaleDateString();

    var dayPart = getDay(actualDateString, defaultFormat);
    var monthPart = getMonth(actualDateString, defaultFormat);
    var yearPart = getYear(actualDateString, defaultFormat);    
    var nameOfCurrentDay = getWeekDayNameByDate(actualDateString, defaultFormat);

    this.currentDay  = {
        name: nameOfCurrentDay,
        weekDay: getDayOfWeek(dayPart, monthPart, yearPart),
        day: dayPart,
        timeSet: { 
            time: actualTime, 
            format: inferTimeFormat(actualTime) 
        },
        week: getWeekNumber(actualDate, defaultFormat, yearPart),
        year: yearPart,
        month: monthPart,
        fullDate: `${dayPart}/${ (monthPart > 9 ? monthPart : '0'+monthPart) }/${yearPart}`,
        format: defaultFormat
    };

    var dateOfLastDayOfYear = `31/12/${year}`;
    var nameOfLastDayOfYear = getWeekDayNameByDate(dateOfLastDayOfYear, defaultFormat);
    var lastDayDatePart = getDay(dateOfLastDayOfYear, defaultFormat);
    var lastMonthDatePart = getMonth(dateOfLastDayOfYear, defaultFormat);

    this.lastDayOfTheYear   = { 
        name: nameOfLastDayOfYear,
        weekDay: getDayOfWeek(lastDayDatePart, lastMonthDatePart, year),
        day: allDateParts.day,
        timeSet: { 
            time: '00:00:00', 
            format: inferTimeFormat(this.time) 
        },
        week: getWeekNumber(dateOfLastDayOfYear, defaultFormat, year),
        year: year,
        month: allDateParts.month,
        fullDate: `${lastDayDatePart}/${ (lastMonthDatePart > 9 ? lastMonthDatePart : '0'+lastMonthDatePart) }/${year}`,
        format: defaultFormat
    };
    
    this.weeksLeft       = 52 - week;
    this.currentWeek     = week;
    this.currentMonth    = month;
    this.totalMonthsLeft = 12 - actualDate.getMonth();
    this.isLeapYear      = isLeapYear(year);
    this.isCurrentYear   = year == actualDate.getFullYear();
    this.options         = options;
}

chronologic.prototype = {
    detectTime: function(date='') {
        return detectTime(date);
    },
    getTimeFormat: function(time='') {
        if(isValidTime(time)) {
            return inferTimeFormat(time);
        } 
        return '';
    },
    genMonthFromDate: function(date='', format='') {
        var dateParts = getDatePart(date, format, 'all', true);
        var monthInfo = getMonthInfo(dateParts.month, 'all', dateParts.year);
        var positions = findPosition(format, 'all');
        return generateMonthFromDate(1, monthInfo.length, dateParts.month, dateParts.year, positions);
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
            var month = getMonth(date, format);
            var year = getYear(date, format);
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
        let day = getDay(date, format);
        if(isEmpty(day)) {
            return getDay(this.date, this.format);
        }
        return day;
    },
    getMonth: function(date='', format='') {
        let month = getMonth(date, format);
        
        if(isEmpty(month)) {
            return getMonth(this.date, this.format);
        }

        return month;
    },
    getYear:  function(date='', format='') {
        let year = getYear(date, format);
        
        if(isEmpty(year)) {
            return getYear(this.date, this.format);
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
        return formats.findPosition(format, 'all');
    },
    getWeekNumber: function(date= '' | {}, format = '') {
        
        if(isEmpty(date) && isEmpty(format)) {
            var year = getYear(this.date, this.format);
            return getWeekNumber(this.date, this.format, year)
        }

        var year = getYear(date, format);
        return getWeekNumber(date, format, year);
    },
    getDayOfWeek: function(day, month, year) {
        return getDayOfWeek(day, month, year);
    },
    getMonthLength: function(month=-1, year=-1) {
        if(month > 0 && year > 0) {
            return getMonthLength(month);
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
                    return isLeapYear(parseInt(year));
            case 'object':
                if(year instanceof Date) {
                    return isLeapYear(year.getFullYear());
                }

                console.warn('Invalid object type, only (Date) can be passed as parameter');
                return false;
            default: 
                console.warn('Invalid argument type');
                return false;
        }
    },
    isValidYear: function(year) {
        return isValidYear(year);
    },
    includesTime: function(date) {
        return includesTime(date);
    }
};