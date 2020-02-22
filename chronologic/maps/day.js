import { isNumeric, assertTypeOf } from "../utils/utils";

export const days = [
    { fullName: 'Monday',    abbrName: 'Mon', index: 1 },
    { fullName: 'Tuesday',   abbrName: 'Tue', index: 2 },
    { fullName: 'Wednesday', abbrName: 'Wed', index: 3 },
    { fullName: 'Thursday',  abbrName: 'Thu', index: 4 },
    { fullName: 'Friday',    abbrName: 'Fri', index: 5 },
    { fullName: 'Saturday',  abbrName: 'Sat', index: 6 },
    { fullName: 'Sunday',    abbrName: 'Sun', index: 7 }
];

export const getDayInfo = (day= 1 | '', option=''|'name'|'abbr'|'index') => {

    if(assertTypeOf(day, 'string') && !isNumeric(day)) {
        throw new Error('String contains invalid day');
    }
    
    if(isNumeric(day) || (!isNaN(day) && day < 0 || day > 7)) {
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
        let searchResult = days.filter(  (dayInfo) => dayInfo.index === day );
        
        if(searchResult.length > 0) {
            const dayInfo = searchResult[0];
            switch(option) {
                case 'name':
                    result = dayInfo.fullName;
                    break;
                case 'abbr':
                    result = dayInfo.abbrName;
                    break;
                default:
                    console.warn(`Unknown option ${option}`);
                    break;
            }
        }

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