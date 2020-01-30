import { findIndexes, isEmpty, checkAndExecuteSingleStringValue, findDelimiter } from '../helper/helper';
import { isMonth, isYear, isDay } from '../date/validators';

export const formats = {
    day: [ // look for regular expressions to match the exact string
        { regex: /dd/ },
        { regex: /DDD/, isAbbreviated: true },
    ],
    month: [
        { regex: /mm/ , isAbbreviated: false },
        { regex: /MM/ , isAbbreviated: false },
        { regex: /mmm/ , isAbbreviated: true },
        { regex: /MMM/ , isAbbreviated: true }
    ],
    year: [
        {  regex: /yyyy/  },
    ],
    defaultLongDateFormat: { // must be able to detect full format
        LTS  : 'h:mm:ss A',
        LT   : 'h:mm A',
        L    : 'MM/DD/YYYY',
        LL   : 'MMMM D, YYYY',
        LLL  : 'MMMM D, YYYY h:mm A',
        LLLL : 'dddd, MMMM D, YYYY h:mm A'
    }
};

export const findPosition = (format='', option='') => {

    if(isEmpty(format)) {
        throw new Error('No format provided');
    }

    if(isEmpty(option)) {
        throw new Error('No option provided');
    }

    if(Object.keys(formats).indexOf(option) === -1 && option !== 'all') {
        return {};
    }
    
    if(option === 'all') {
        return {
            day: findIndexes(format, formats.day),
            month: findIndexes(format, formats.month),
            year: findIndexes(format, formats.year)
        };
    } else {
        return findIndexes(format, formats[option]);
    }
};

/*
    @param date
    @return format
    @description from the date the function infers the format
*/
export const getFormat = (date) => {

    if(isEmpty(date)) {
        throw new Error('No [date] or valid [date] parameter provided');
    }

    var delimiter = findDelimiter(date);
    var delimiterGlobalRegex = new RegExp(delimiter, 'g');

    var indexes = {
        day: '{1}',
        month: '{2}',
        year: '{3}'
    };
    var result = [];
    switch(date.match(delimiterGlobalRegex).length) {
        case 2:
            date.split(delimiterGlobalRegex).map( (value) => {
                if(isDay(value)) {
                    if(result.indexOf(indexes.day) === -1) {
                        result.push(indexes.day);
                    }
                }
                if(isYear(date)) {
                    if(result.indexOf(indexes.year) === -1) {
                        result.push(indexes.year);
                    }
                }
                if(isMonth(date)) {
                    if(result.indexOf(indexes.month) === -1) {
                        result.push(indexes.month);
                    }
                }
            });
            return result;
        case 3:
            // long date

            break;
    }
};