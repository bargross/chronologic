import { dayExists } from "../maps/day";
import { monthExists } from "../maps/month";
import { isEmpty, assertTypeOf, isNumeric } from "../helper/helper";


/*
    @param month(object)
    @return boolean
    @description it checks the months validity by matching the properties
    the it returns true if the object contains all properties,
    if the object contains extra properties added thereafter then it
    is still valid e.g.: month.comparator = function(newMonth) { return this.month == newMonth }
    this adds a new property to the object which is for the user, and if we do isValidMonth(month)
    then it will return true as we're only checking for the properties we require not properties added
    by the user(developer)
*/
export const isValidMonthObject = (month={}) => {
    if(isValidMonth(month))
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

export const isValidMonth = (month) => {
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
/*
    @param
    @return
    @description
*/
export const isValidYear = (year) => {
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


export const isValidDay = (part) => {
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

export const isDay = (part) => {
    
    if(isEmpty(part)) {
        throw new Error('No day parameter supplied');
    }

    var isAbbr = isAbbreviatedOrFullName(part);
    return (isNumeric(part) && isValidDay(part)) || (isAbbr.isFullDayName || isAbbr.isAbbrDay);
};

export const isMonth = (part) => {

    if(isEmpty(part)) {
        throw new Error('No day parameter supplied');
    }

    var isAbbr = isAbbreviatedOrFullName(part);
    return (isNumeric(part) && isValidMonth(part)) || (isAbbr.isFullMonthName || isAbbr.isAbbrMonth);
};

export const isYear = (part) => {

    if(isEmpty(part)) {
        throw new Error('No day parameter supplied');
    }

    return isNumeric(part) && isValidYear(part);
}

export const isAbbreviatedOrFullName = (part) => {

    if(isEmpty(part)) {
        throw new Error('No date part parameter supplied');
    }

    var result = {
        isAbbrDay: false,
        isAbbrMonth: false,
        isFullDayName: false,
        isFullMonthName: false
    };

    if(assertTypeOf(part, 'string')) {
        if(part.length > 1 && isValidName(part)) {
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

//
// evaluates a year from a Date data type, to determine whether the year provided
// within the date is a leap year
// time complexity => best: O(1), worse: O(1)
/*
    @param
    @return
    @description
*/
export const isLeapYear = (year) => {

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