import { isNumeric, isEmpty, assertTypeOf } from "../helper/helper";

export const months = [
    { fullName: 'January',    abbreviatedName: 'Jan', length: 31 },
    { fullName: 'February',   abbreviatedName: 'Feb', length: 28 },
    { fullName: 'March',      abbreviatedName: 'Mar', length: 31 },
    { fullName: 'April',      abbreviatedName: 'Apr', length: 30 },
    { fullName: 'May',        abbreviatedName: 'May', length: 31 },
    { fullName: 'June',       abbreviatedName: 'Jun', length: 30 },
    { fullName: 'July',       abbreviatedName: 'Jul', length: 31 },
    { fullName: 'August',     abbreviatedName: 'Aug', length: 31 },
    { fullName: 'September',  abbreviatedName: 'Sep', length: 30 },
    { fullName: 'October',    abbreviatedName: 'Oct', length: 31 },
    { fullName: 'November',   abbreviatedName: 'Nov', length: 30 },
    { fullName: 'December',   abbreviatedName: 'Dec', length: 31 }
];


export const getMonthInfo = (month=-1|'', option=''|'name'|'abbr'|'length', year=0) => {
    if(isNumeric(month) && (month < 0 || month > 12 ) ) {
        return {};
    }

    if(month === 2 && year > 0 && isLeapYear(year)) {
        info.length = info.length + 1;
    }

    if(option && !isEmpty(option)) {
        switch(option) {
            case 'name':
                return months.fullName;
            case 'abbr':
                return months.abbreviatedName;
            case 'length':
                return months[option];
            case 'all':
                return months;
            default: 
                return {};
        }
    }
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