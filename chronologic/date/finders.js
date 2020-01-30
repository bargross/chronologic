import { checkAndExecute } from "../helper/helper";
import { getDatePart } from "./splitters";
import { getDayInfo } from "../maps/day";
import { dateToUTCDateString } from "./formatters";



// returns the week number of the specific day
/*
    @param
    @return
    @description
*/
export const getWeekNumber = function(date= '' | Date, format='', year=0) {

    let curatedDate;
    if(date instanceof Date) {
        curatedDate = date;
    } else if(assertTypeOf(date, 'string')) {
		date = dateToUTCDateString(date, format);
        curatedDate = new Date(date);
    } else {
        console.warn('Invalid date type as argument');
        return -1;
    }
	
	var firstDayOfYear = new Date('01/01/' + year);
    
	var millisecondsTillDate = (firstDayOfYear - curatedDate) / (1000 * 59 * 59 * 24);
    var totalDaysToDate = Math.abs( millisecondsTillDate );
	
    return Math.round(totalDaysToDate / 7);
};

// Tomohiko Sakamoto algorithm (read later)
/*
    @param
    @return
    @description
*/
export const getDayOfWeek = function(day, month, year) {
    var tDays = [0, 3, 2, 5, 0, 3, 5, 1, 4, 6, 2, 4];
    var nYear = year - (month < 3) ? 1 : 0;
    var dayOfWeek = (nYear + nYear/4 - nYear/100 + nYear/400 + tDays[month-1] + day) % 7;
    return Math.ceil(dayOfWeek);
};

export const getDayOfWeekByDate = function(date='', format='') {
    return checkAndExecute(date, format, '', (sanitizedDate, sanitizedFormat) => {
        var allDateParts = getDatePart(sanitizedDate, sanitizedFormat, 'all', true);
        var dayOfWeek = getDayOfWeek(allDateParts.day, allDateParts.month, allDateParts.year);
		
		if(dayOfWeek) return dayOfWeek;
		else throw Error('Invalid date provided'); 
    });
};

/*
    @param
    @return
    @description
*/
export const getWeekDayName = (day, month, year) => {
    var dayOfWeek = getDayOfWeek(day, month, year);
    return getDayInfo(dayOfWeek, 'name');
};

/*
    @param
    @return
    @description
*/
export const getWeekDayNameByDate = (date, format) => {
    var dateParts = getDatePart(date, format, 'name', true);
    var dayOfWeek = getDayOfWeek(dateParts.day, dateParts.month, dateParts.year);
    return getDayInfo(dayOfWeek, 'name');
};