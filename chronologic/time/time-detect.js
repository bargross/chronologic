import {
    checkAndExecute, 
    checkAndExecuteSingleStringValue,
    isEmpty 
} from '../helper/helper';
import { isValidTime } from '../time/time'

/*
    @param date
    @return time string if found, otherwise empty string
    @description finds a time value within a specific string
*/
export const detectTime = (date='') => {
	return checkAndExecuteSingleStringValue(date, '', (validDate) => {
		let time;
        if(date.indexOf(',') !== -1) {
            time = validDate.split(',')[validDate.length-1].trim();
            if(!isValidTime(time)) {
                return '';
            } 

            return time; 
        } else {
            var matchedValue = validDate.indexOf(':');
            if(matchedValue > -1) {
                time = validDate.substring(matchedValue-2, validDate.length);
                var occurrence = time.split('').filter(val => val === ':').length;
                let missingIndexes = 2;

                if(time.indexOf('.') !== -1) {
                    missingIndexes += ((missingIndexes * 2) + 1);
                }
                return time.substring(0, 3*occurrence+missingIndexes );
            }
        }
    });
};

/*
    @param time
    @param option
    @param hasSeconds
    @param parseToInt
    @return time value or empty string otherwise
    @description extracts time values: hour, minutes, etc... from a time specific string
*/
export const getTimeValues = (time='', option='', hasSeconds=false) => {
    var defaultValue = '';
    return checkAndExecute(time, option, defaultValue, (time, option) => {
        switch(option) {
            case 'hour':
                var hour = time.substring(0, 2);
                return hour;
            case 'minutes':
                var minutes = time.substring(3, 5); 
                return minutes;
            case 'seconds':
                var seconds = time.substring(6, 8);
                return hasSeconds ? seconds : '';
            case 'all':
                var timeValues = {
                    hour: time.substring(0, 2),
                    minutes: time.substring(3, 5)
                };
                if(hasSeconds) {
                    var secondsAsString = time.substring(6, 8);
                    timeValues.seconds = secondsAsString;
                }
                return timeValues;
        }
    });
};

/*
    @param date
    @return time string if found, otherwise empty string
    @description finds a time value within a specific string as an integer
*/
export const getTimeValueAsInt = (time = '', option = '', hasSeconds=false) => {
    if(isEmpty(time)) {
        throw new Error('Empty time value');
    }

    if(isEmpty(option)) {
        throw new Error('No option was given');
    }

    var allTimeValues = getTimeValues(time, option, hasSeconds);
        
    if(option === 'all') {
        var allTimeValuesAsInt = Object.assign({}, allTimeValues);

        allTimeValuesAsInt['hour'] = parseInt(allTimeValues['hour']);
        allTimeValuesAsInt['minutes'] = parseInt(allTimeValues['minutes']);
        allTimeValuesAsInt['seconds'] = parseInt(allTimeValues['seconds']);

        return allTimeValuesAsInt;
    }

    return parseInt(allTimeValues);
}

/*
    @param date
    @return time string if found, otherwise empty string
    @description finds a time value within a specific string
*/
export const includesTime = (date) => {
    if(isEmpty(date)) {
        return false;
    }

    if(isEmpty(date.indexOf(','))) {
        return false;
    }

    var dateArrayString = date.split(',');

    return isValidTime(dateArrayString[1]);
}