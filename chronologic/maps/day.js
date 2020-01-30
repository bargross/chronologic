import { isNumeric, assertTypeOf } from "../helper/helper";

export const days = [
    { fullName: 'Monday',    abbrName: 'Mon' },
    { fullName: 'Tuesday',   abbrName: 'Tue' },
    { fullName: 'Wednesday', abbrName: 'Wed' },
    { fullName: 'Thursday',  abbrName: 'Thu' },
    { fullName: 'Friday',    abbrName: 'Fri' },
    { fullName: 'Saturday',  abbrName: 'Sat' },
    { fullName: 'Sunday',    abbrName: 'Sun' }
];

export const getDayInfo = (day= 1 | '', option=''|'name'|'abbr'|'number') => {

    if(assertTypeOf(day, 'string') && !isNumeric(day)) {
        throw new Error('String contains invalid day');
    }
    
    if(isNaN(day) || (!isNaN(day) && day < 0 && day > 7)) {
        throw new Error(`Day outside bounds: ${day}`);
    }

    if(assertTypeOf(day, 'number')) {
        day = day - 1;
    }

    if(assertTypeOf(day, 'string') && isNumeric(day)) {
        day = parseInt(day); 
        day = day === 0 ? day : day - 1;
    }
    
    const getByType = (day) => {
        let result = null;
        days.forEach( (dayInfo, index) => {
            if(index === day) {
                switch(option) {
                    case 'name':
                        result = dayInfo.fullName;
                        break;
                    case 'abbr':
                        result = dayInfo.abbrName;
                        break;
                    case 'number':
                        result = index+1;
                        break;
                    default:
                        console.warn(`Unknown option ${option}`);
                        break;
                }
            }
        });
        return result;
    }

    return getByType(day);
}


export const dayExists = (day=-1|'') => {
    if(isNumeric(day)) {
        day = Number(day);
        return day >= 1 && day <= 7;
    }
    
    if(isEmpty(day)) {
        return false;
    }

    day = day.toLowerCase();
    return days.filter( (validDay) => {
        return day === validDay.fullName.toLowerCase() || day === validDay.abbrName.toLowerCase();
    }).length > 0;
}