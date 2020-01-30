import { findPosition } from "../maps/format";
import { findDelimiter } from "../helper/helper";
import { isValidMonth } from "./validators";
import { getInfo } from "../maps/month";


/*
    @param
    @return
    @description
*/
export const getDatePart = (date='', format='', option='', parse) => {
    return checkAndExecute(date, format, -1, (curatedDate, curatedFormat) => get(curatedDate, curatedFormat, option, parse));
};

/*
    @param
    @return
    @description gets the coordinates of a specific element of the date string
    and returns the actual value (as a string, maybe add option to parse it)
*/
export const get = (date, format, option, parse) => {
    let position = null;
    switch(option) {
        case 'day':
            position = findPosition(format, 'day');
            break;
        case 'month':
            position = findPosition(format, 'month');
            break;
        case 'year':
            position = findPosition(format, 'year');
            break;
        case 'all':
            position = findPosition(format, 'all');
            break;
        default:
            position = -1;
            break;
    }

    if(position === -1) {
        console.warn(option + ' not found!');
		return position;
    }
    
    var part = getDatePartByPosition(date, position);
    if(parse) {   
        if(option === 'all') {
			Object.keys(part).forEach(key => {
                part[key] = parseInt(part[key]);
            });
            return part;
        } else {
            return parseInt(part);
        }
    }

    return part
};



// Not sure this function is still relevant

/*
    @param
    @return
    @description
 */
// export const getInfo = (value=-1|'', arrayOfOptions=[], option='') => {
//     if(value == 0) {
//         value = 1;
//     }

//     let number = -1;
//     switch(option) {
//         case 'full':
//             return assertTypeOf(value, 'number') ? arrayOfOptions[value-1].fullName : ''; 
//         case 'abbr':
//             return assertTypeOf(value, 'number') ? arrayOfOptions[value-1].abbrName : ''; 
//         case 'num':
//             if(assertTypeOf(value, 'string') && !isNaN(value)) {
//                 number = arrayOfOptions
//                     .map( (info, index) => {
//                         if(info.fullName === value || info.abbrName === value) {
//                             return index+1;
//                         }
//                     })[0];
//             }
//             return number;
//         default:
//             return {};
//     }
// };

/*
    @param
    @return
    @description
*/
export const getDatePartByPosition = (date, position) => {
    // var count = 0;
	var keys = Object.keys(position);
	var values = {
        day: undefined,
        month: undefined,
        year: undefined
    };

    switch(keys.length) {
        case 2:
            return date.substring(position.start, position.end);
        case 3:
            keys.forEach( key => {
                values[key] = date.substring(position[key].start, position[key].end);
            });

            return values;
        default:
            console.warn('Invalid positions in object');
            return;
    }
};



export const getDay = (date='', format='') => getDatePart(date, format, 'day', true);

/*
    @param
    @return
    @description
*/
export const getMonth = (date='', format='') => getDatePart(date, format, 'month', true);

/*
    @param
    @return
    @description
*/
export const getYear = (date='', format='') => getDatePart(date, format, 'year', true);

/*
    @param
    @return
    @description Not used yet but will be used for the validation of time object representation
*/
// TODO: this is assuming the standard format is dd/mm/yyyy
export const fromNumericDayGetFullDate = (day=-1, currentDate='', format='') => {
    var delimiter = findDelimiter(format);
    
    var month = getMonth(currentDate, format);
    var year = getYear(currentDate, format); 

    return day !== -1 ? `${day}${delimiter}${month}${delimiter}${year}` : '';
};


export const getMonthLength = (month) => {
    if(!isValidMonth(month)) {
        throw new Error('Invalid [month] provided');
    }

    return getInfo(month, 'length');
}