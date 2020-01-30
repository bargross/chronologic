/*
    @param
    @return
    @description
*/
export const replaceMultipleValues = (values=[], positions={}, container) => {
    if(isEmpty(values)) {
        throw new Error('No [values] parameter provided');
    }

    if(isEmpty(positions)) {
        throw new Error('No [positions] parameter provided');
    }

    if(isEmpty(container)) {
        throw new Error('No [container] parameter provided');
    }

    if(isValidPositionObject(positions)) {
        throw new Error('Invalid [positions] parameter provided');
    }

    let temp = container;
    Object.keys(positions).forEach( (option, index) => {
        temp = replaceValue(values[index], positions[option], temp, option);
    });

    return temp;
};

/**
  
*/
export const isValidPositionObject = (positions) => {
    
    if(isEmpty(position)) {
        throw new Error('No [positions] parameter provided');
    }
    
    var hasAllDateElements = positions.hasOwnProperty('day')
        && positions.hasOwnProperty('month')
        && positions.hasOwnProperty('year');

    var hasPositionsOnly = (position) => {
        return position.hasOwnProperty('start')
            && position.hasOwnProperty('end');
    }

    if(hasAllDateElements) {
        return Object.keys(position).filter( (key) => {
            return hasPositionsOnly(position[key]);
        }).length === 3;
    }

    return hasPositionsOnly(position);
};


/*
    @param
    @return
    @description
*/
export const findIndexes = (format='', arrayOfOptions=[]) => {
   return arrayOfOptions.map( (acceptedFormat) => {
        var match = format.match(acceptedFormat.regex);
        if(match) {
            var stringValueFound = match.toLocaleString();
            return {
				start: match.index,
            	end: (match.index+stringValueFound.length)
        	};
        }
    })[0];
};

/*
    @param
    @return
    @description
*/
export const findDelimiter = (format='') => {
    return checkAndExecuteSingleStringValue(format, '', (curatedFormat) => {
        var regex = /[-, ,. /]/;
        return curatedFormat.match(regex).toString();
    });
};

/*
    @param
    @return
    @description given two string values it checks for a blank element 
    throws call-stack except 
    */
   export const checkAndExecuteSingleStringValue = (valueOne, defaultValue, callback) =>{
       if( !isEmpty(valueOne) ) {
           return callback(valueOne);
        } else {
            return defaultValue;
        }
    };
    
    /*
    @param
    @return
    @description given two string values it checks for a blank (i.e.: empty='', undefined, null)  
    throws call-stack except 
*/
export const checkAndExecute = (valueOne, valueTwo, defaultValue, callback) =>{
    if( !isEmpty(valueOne) && !isEmpty(valueTwo)) {
        return callback(valueOne, valueTwo);
    } else { 
        return defaultValue;
    }
};

/*
    @param
    @return
    @description a general purpose function that checks a single digit string to see if is a valid character
*/
export const isChar = (digit) => (assertTypeOf(digit, 'string') && digit.length === 1) && (digit.toLowerCase() >= 'a' && digit.toLowerCase() <= 'z');

/*
    @param
    @return
    @description a general purpose function that checks a single digit string to see if is a valid character
*/
export const isValidName = (stringValue) => {
    for(var char in stringValue) {
        if(!isChar(char)) {
            return false;
        }
    }
    return true;
};

/*
    @param
    @return
    @description identifies a numeric value within a string
*/
export const isNumeric = (value = 0 | '') => (value !== undefined || value !== null || value !== '') && !isNaN(value);
  
/*
    @param
    @return
  	@description simple check for the type of a value
*/
export const assertTypeOf = (value, type='') => value && (value).constructor.name.toLowerCase() === (type).toLowerCase();

/*
    @param
    @return
    @description Checks of a string is either undefined or empty
*/
export const isEmpty = (value) => {
    if(!value || value == null) {
        return true;
    }
    switch( (value).constructor.name.toLowerCase()) {
        case 'string': return (assertTypeOf(value, 'string') && value === '');
        case 'array': return value == [] || value.length == 0;
        case 'object': return value === {} || Object.keys(value).length == 0;
        default: return false;
    }
};

/*
    @param
    @return
    @description
*/
export const replaceValue = (value='', position={}, container='', option='') => {
    if(isEmpty(value)) {
        throw new Error('No value provided');
    }

    if(isEmpty(position)) {
        throw new Error('No position/s provided');
    }

    if(isEmpty(container)) {
        throw new Error('No container provided');
    }

    if(isEmpty(option)) {
        throw new Error('No option provided');
    }

    if(Object.keys(position).length > 2) {
        console.warn('[replaceValue] only works with individual positioning!');
        return container;
    }

    if( !(option === 'day'|'month'|'year') ) {
        var currentValue = container.substring(position.start, position.end+1);
        return container.replace(currentValue, value);
    }
    
    return container;
};
