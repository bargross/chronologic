import { isNumeric, isEmpty, assertTypeOf } from "../utils/utils";
import { isValidMonth, isValidYear } from "../date/validator";

export const months = [
    { fullName: 'January',    abbreviatedName: 'Jan', length: 31, index: 1 },
    { fullName: 'February',   abbreviatedName: 'Feb', length: 28, index: 2 },
    { fullName: 'March',      abbreviatedName: 'Mar', length: 31, index: 3 },
    { fullName: 'April',      abbreviatedName: 'Apr', length: 30, index: 4 },
    { fullName: 'May',        abbreviatedName: 'May', length: 31, index: 5 },
    { fullName: 'June',       abbreviatedName: 'Jun', length: 30, index: 6 },
    { fullName: 'July',       abbreviatedName: 'Jul', length: 31, index: 7 },
    { fullName: 'August',     abbreviatedName: 'Aug', length: 31, index: 8 },
    { fullName: 'September',  abbreviatedName: 'Sep', length: 30, index: 9 },
    { fullName: 'October',    abbreviatedName: 'Oct', length: 31, index: 10 },
    { fullName: 'November',   abbreviatedName: 'Nov', length: 30, index: 11 },
    { fullName: 'December',   abbreviatedName: 'Dec', length: 31, index: 12 }
];


export const getMonthInfo = (month=-1|'', option=''|'name'|'abbr'|'length', year=0) => {
    if(isNumeric(month) && (month < 0 || month > 12 ) ) {
        return {};
    }

    const searchResult = months.filter( (monthInfo) => monthInfo.index === month);
    let monthInfo = null;
    
    if(searchResult.length > 0) {
        monthInfo = searchResult[0];
    }

    // needs to be a specific month/s?
    if(isValidMonth(month) && isValidYear(year) && isLeapYear(year)) { 
        monthInfo.length = monthInfo.length + 1; 
    }

    if(option && !isEmpty(option)) {
        switch(option) {
            case 'name':
                return monthInfo.fullName;
            case 'abbr':
                return monthInfo.abbreviatedName;
            case 'length':
                return monthInfo[option];
            case 'all':
                return monthInfo;
            default: 
                return {};
        }
    }

    return null;
}

export const monthExists = (month=-1|'') => {
    if(isNumeric(month)) {
        return month >= 1 && month <= 12;
    }
    
    if(isEmpty(month)) {
        return false;
    }

    if(!isNumeric(month) && assertTypeOf(month, 'string')) {
        month = month.toLowerCase();
        return months.filter( validMonth => {
            return month === validMonth.fullName.toLowerCase() || month === validMonth.abbrName.toLowerCase();
        }).length > 0;
    }

    return false;
}