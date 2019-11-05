// Calendar object
function chronologic(date='', format='', options={}) {
    
    let dateOnly;
    let time;
    if(includesTime(date)) {
        const dateArrayString = date.split(',');
        dateOnly = dateArrayString[0];
        time = detectTime(dateArrayString[1])
    }
    
    const day   = getDatePart(date, format, 'day', true);
    const month = getDatePart(date, format, 'month', true);
    const year  = getDatePart(date, format, 'year', true);

    this.timeFormat = inferTimeFormat(time);
    this.day    = day;
    this.month  = month;
    this.year   = year;
    this.date   = dateOnly;
	this.time   = time;
	this.format = format;
    
    const week = getWeekNumber(date, year);
	this.week  = week;
    
	const actualDate = new Date();
    const actualTime = actualDate.toLocaleTimeString();
    
    const actualDateString = actualDate.toLocaleDateString();
    const dayPart = getDatePart(actualDateString, 'dd/MM/yyyy', 'day', true);
    const monthPart = getDatePart(actualDateString, 'dd/MM/yyyy', 'month', true);
    const yearPart = getDatePart(actualDateString, 'dd/MM/yyyy', 'year', true);
    
    this.currentDay  = {
        name: days.getInfo(actualDate.getDay(), 'fullName'),
        weekDay: getWeekDayName(dayPart, monthPart, yearPart),
        day: dayPart,
        timeSet: { 
            time: actualTime, 
            format: inferTimeFormat(actualTime) 
        },
        week: getWeekNumber(actualDate, yearPart),
        year: yearPart,
        month: monthPart,
        fullDate: `${dayPart}/${ (monthPart > 9 ? monthPart : '0'+monthPart) }/${yearPart}`,
        format: 'dd/MM/yyyy'
    };

    // TODO: Re-do last day of the year
    // lastDayOfTheYear   = { 
    //     name: isShallowInstance ? days[lastDayOfYear] : '',
    //     number: 31 
    // };
    
    this.weeksLeft       = 52 - week;
    this.currentWeek     = week;
    this.currentMonth    = month;
    this.totalMonthsLeft = 12 - actualDate.getMonth();
    this.isLeapYear      = isLeapYear(year);
    this.isCurrentYear   = year == actualDate.getFullYear();
    this.options         = options;
}

chronologic.prototype = {
    detectTime: function(date='') {
        return detectTime(date);
    },
    getTimeFormat: function(time='') {
        if(isValidTime(time)) {
            return inferTimeFormat(time);
        } 
        return '';
    },
    genMonthFromDate: function(date='', format='') {
        const dateParts = getDatePart(date, format, 'all', true);
        const monthInfo = months.getInfo(dateParts.month, 'all', dateParts.year);
        const positions = formats.findPosition(format, 'all');
        return genMonthFromDate(1, monthInfo.length, dateParts.month, dateParts.year, positions);
    },

    // setters
    getOriginalDate: function() { return this.date; },
    getOriginalFormat: function() {  return this.format; },
    getOriginalOptions: function() { return this.options; },

    // setters
    setDate: function(date) { this.date = date; },
    setFormat: function(format) { this.format = format; },
    setOptions: function(options)  { this.options = options; },

    getMonthCalendarName: function(date='', format='') {
        const result = checkAndExecute(date, format, '', (date, format) => {
            const month = getDatePart(date, format, 'month');
            const year = getDatePart(date, format, 'year');
            return months.getInfo(month, 'name', year);
        });

        if(result === '') {
            return checkAndExecute(this.date, this.format);
        } else {
          return  result;
        }
    },
    // setCalendar: function(_calendar) {

    // },
    getCurrentYear: function() {
        return this.currentYear;
    },
    getCalendarYear: function() {
        return this.year;
    },
    getDay: function(date='', format='', asInt=false) {
        let day = getDatePart(date, format, 'day', asInt);
        if(isEmpty(day)) {
            return getDatePart(this.date, this.format, 'day', asInt);
        }
        return day;
    },
    getMonth: function(date='', format='', asInt=false) {
        let month = getDatePart(date, format, 'month', asInt);
        if(month === '') {
            return getDatePart(this.date, this.format, 'month');
        }
        return month;
    },
    getYear:  function(date='', format='', asInt=false) {
        let year = getDatePart(date, format, 'year', asInt);
        if(isEmpty(year)) {
            return getDatePart(this.date, this.format, 'year');
        }
        return year;
    },
    toString:  function() {
        return this.date;
    },
    getCurrentDay: function() {
        return this.currentDay;
    },
    getLocationsInDateString: function(format) {
        return formats.findPosition(format, 'all');
    },
    getWeekNumber: function(date= '' | {}) {
        return getWeekNumber(date);
    },
    getDayOfWeek: function(day, month, year) {
        return getDayOfWeek(day, month, year);
    },
    getMonthLength: function(month=-1, year=-1) {
        if(month > 0 && year > 0) {
            return months.getInfo(month, 'length', year);
        } else {
            return 0;
        }
    },
    // validation functions
    isLeapYear: function(year) {
        switch(typeof year) {
            case 'number': return isLeapYear(year);
            case 'string':
                if(!stringIsNumeric(year) || (year.length !== 2 || year.length != 4) ) {
                    return false;
                } 
                    return isLeapYear(parseInt(year));
            case 'object':
                if(year instanceof Date) {
                    return isLeapYear(year.getFullYear());
                }

                console.warn('Invalid object type, only (Date) can be passed as parameter');
                return false;
            default: 
                console.warn('Invalid argument type');
                return false;
        }
    },
    isValidYear: function(year) {
        return isValidYear(year);
    },
    includesTime: function(date) {
        return includesTime(date);
    }
};




//====================================================================================================================
//                                                    Maps
//====================================================================================================================

const months = {
    info: [
        { fullName: 'January',    abbrName: 'Jan', length: 31 },
        { fullName: 'February',   abbrName: 'Feb', length: 28 },
        { fullName: 'March',      abbrName: 'Mar', length: 31 },
        { fullName: 'April',      abbrName: 'Apr', length: 30 },
        { fullName: 'May',        abbrName: 'May', length: 31 },
        { fullName: 'June',       abbrName: 'Jun', length: 30 },
        { fullName: 'July',       abbrName: 'Jul', length: 31 },
        { fullName: 'August',     abbrName: 'Aug', length: 31 },
        { fullName: 'September',  abbrName: 'Sep', length: 30 },
        { fullName: 'October',    abbrName: 'Oct', length: 31 },
        { fullName: 'November',   abbrName: 'Nov', length: 30 },
        { fullName: 'December',   abbrName: 'Dec', length: 31 }
    ],
    exists: function(month=-1|'') {
        if(!isNaN(month)) {
            return month >= 1 && month <= 12;
        }
        
        if(isEmpty(month)) {
            return false;
        }
        month = month.toLowerCase();
        return this.info.filter( validMonth => {
            return month === validMonth.fullName.toLowerCase() || month === validMonth.abbrName.toLowerCase();
        }).length > 0;
    },
    getInfo: function(month=-1|'', option=''|'name'|'abbr'|'length'|'all', year=0) {
        if(!isNaN(month) && (month < 0 || month > 12 ) ) {
            return {};
        }
        const info = getInfo(month, this.info, option);
        if(month === 2 && year > 0 && isLeapYear(year)) {
            info.length = info.length + 1;
        }

        if(option && !isEmpty(option)) {
            switch(option) {
                case 'name':
                    return info.fullName;
                case 'abbr':
                    return info.abbrName;
                case 'length':
                    return info[option];
                case 'all':
                    return info;
                default: 
                    return {};
            }
        }
    }
};


const days = {
    info: [
        { fullName: 'Monday',    abbrName: 'Mon' },
        { fullName: 'Tuesday',   abbrName: 'Tue' },
        { fullName: 'Wednesday', abbrName: 'Wed' },
        { fullName: 'Thursday',  abbrName: 'Thu' },
        { fullName: 'Friday',    abbrName: 'Fri' },
        { fullName: 'Saturday',  abbrName: 'Sat' },
        { fullName: 'Sunday',    abbrName: 'Sun' }
    ],
    // TODO: Review fetch function for name
    getInfo: function(day=-1|'', option=''|'name'|'abbr'|'number'|'all') {
        if(!isNaN(day) && day < 1 && day > 7) {
            return '';
        }
        
        const getByType = (day) => {
            if(assertTypeOf(day, 'number')) {
                if(day === 0) {
                    return (this.info[day])[option];
                }
                return (this.info[day-1])[option];
            }

            if(assertTypeOf(day, 'string')) {
                const lowerCaseDay = day.toLowerCase();
                let result = -1;
                this.info.forEach( (dayInfo, index) => {
                    if(dayInfo.fullName === lowerCaseDay || dayInfo.abbrName === lowerCaseDay) {
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
                            // case 'all':
                            //     const all = dayInfo;
                            //     all['number'] = index+1;
                                
                            //     return all;
                            default:
                                console.warn(`Unknown option ${option}`);
                                break;
                        }
                    }
                });
                return result;
            }
        }

        return getByType(day);
    },
    exists:function(day=-1|'') {
        if(!isNaN(day)) {
            day = Number(day);
            return day >= 1 && day <= 7;
        }
        
        if(isEmpty(day)) {
            return false;
        }

        day = day.toLowerCase();
        return this.dayInfo.filter( (validDay) => {
            return day === validDay.fullName.toLowerCase() || day === validDay.abbrName.toLowerCase();
        }).length > 0;
    }
};

const formats = {
    regexOf: {
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
    },
    findPosition: function(format='', option='') {
        if(format === '' || (Object.keys(this.regexOf).indexOf(option) === -1 && option !== 'all')) {
            return {};
        }
        
        if(option === 'all') {
            const result = {
                day: findIndexes(format, this.regexOf.day),
                month: findIndexes(format, this.regexOf.month),
                year: findIndexes(format, this.regexOf.year)
            };
			return result;
        } else {
            return findIndexes(format, this.regexOf[option]);
        }
    }
};

//====================================================================================================================
//                                                    Functions
//====================================================================================================================

// Promise resolve-reject methods

// const resolve = (callback = () => { }, value) => {
//     return '';
// };

// const reject = (callback = () => { }, value) => {
//     return '';
// };

// const wrap = (resolve, reject) => {
//     return new Promise(resolve, reject);
// };


// chronologic date validation methods
// ============================================================

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
// const isValidMonthObject = (month={}) => {
//     if(isValidMonth(month))
//         return (
//             month.hasOwnProperty('name') &&
//             month.hasOwnProperty('days') &&
//             month.hasOwnProperty('calendarNumber') &&
//             month.hasOwnProperty('isCurrentMonth') &&
//             month.hasOwnProperty('day') &&
//             month.hasOwnProperty('time') &&
//             month.hasOwnProperty('year')
//         );

//     return false;
// };

const isValidMonth = (month) => {
    let validMonth;
    if(assertTypeOf(month, 'number')) {
        validMonth = month;
    } else if(assertTypeOf(month, 'string') && stringIsNumeric(month)) {
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
const isValidYear = (year) => {
    let validYear;
	if(assertTypeOf(year, 'string') && stringIsNumeric(year)) {
        validYear = parseInt(year);
    } else if(assertTypeOf(year, 'number')) {
        validYear = year;
    } else {
		return false;
    }
	
    const getDigitCount = (value) => Math.round(Math.log(value) * Math.LOG10E + 1);
    
	const currentYear = new Date().getFullYear();
	const length = getDigitCount(validYear); 
	const currentLength = getDigitCount(currentYear); // ??
    return length <= currentLength && validYear <= currentYear;
};

const isValidDay = (part) => {
    if(assertTypeOf(part, 'string') && isNaN(part)) {
        const numericValue = Number(part);
        return numericValue >= 0 && numericValue <= 12;
    } 
	
	if(part.length > 2) {
        return days.dayExists(part);
    } 
};

const isAbbreviatedOrFullName = (part) => {
    const result = {
        isAbbrDay: false,
        isAbbrMonth: false,
        isFullDayName: false,
        isFullMonthName: false
    };
    if(assertTypeOf(part, 'string')) {
        if(part.length > 1 && isValidName(part)) {
            if(part.length > 3) {
                result.isFullMonthName = months.exists(part);
                result.isFullDayName = days.exists(part);
            } else {
                result.isAbbrDay = months.exists(part);
                result.isAbbrMonth = days.exists(part);
            }
        }
    }
    return result;
};

const isDay = (part) => {
    const isAbbr = isAbbreviatedOrFullName(part);
    return (stringIsNumeric(part) && isValidDay(part)) || (isAbbr.isFullDayName || isAbbr.isAbbrDay);
};

const isMonth = (part) => {
    const isAbbr = isAbbreviatedOrFullName(part);
    return (stringIsNumeric(part) && isValidMonth(part)) || (isAbbr.isFullMonthName || isAbbr.isAbbrMonth);
};

const isYear = (part) => stringIsNumeric(part) && isValidYear(part);

// Data Extraction
// ============================================================


// Date manipulation methods
// ============================================================

/*
    @param
    @return
    @description Not used yet but will be used for the validation of time object representaiton
*/
// TODO: this is assumming the standard format is dd/mm/yyyy
const fromNumericDayGetFullDate = (day=-1, currentDate='', format='') => {
    const delimeter = findDelimeter(format);
    
    const month = getDatePart(currentDate, format, 'month'), 
          year = getDatePart(currentDate, format, 'year'); 

    return day !== -1 ? `${day}${delimeter}${month}${delimeter}${year}` : '';
};


/*
    @param
    @return
    @description Not used yet but will be used for the validation of time object representaiton
*/
// const inferStandardFormat = (part='', format='') => {
//     let dayAdded = false, monthAdded = false, yearAdded = false;
//     const datePart = Number(part);
//     const abbreviated = (part='', delimeter='', addDelimeter=false) => {
//         if(part.length == 3) {
//             const formatType = isAbbreviatedOrFullName(part);
//             if(formatType.isAbbrDay) {
//                 format += `DDD${addDelimeter ? delimeter : ''}`;
//                 dayAdded = !dayAdded;
//             } 
    
//             if(formatType.isAbbrMonth) {
//                 format +=`MMM${addDelimeter ? delimeter : ''}`;
//                 monthAdded = !monthAdded;
//             }
//         }
//     };
//     if(i < dateArrayString.length - 1) {
        
//         abbreviated(part, format, delimeter, true);

//         if(part.length === 4 && !yearAdded) {
//             format += `yyyy${delimeter}`;
//             yearAdded = !yearAdded;
//         }

//         if(!isNaN(datePart) && (datePart >= 1 && datePart <= 31) && !dayAdded) {
//             format += `dd${delimeter}`;
//             dayAdded = !dayAdded;
//         }

//         if(!isNaN(datePart) && (datePart >= 1 && datePart <= 12) && !monthAdded) {
//             format += `mm${delimeter}`;
//             monthAdded = !monthAdded; 
//         }
//     } else {
//         abbreviated(part, format, delimeter, false);

//         if(part.length === 4 && !yearAdded) {
//             format += `yyyy`;
//             yearAdded = !yearAdded;
//         }

//         if(!isNaN(datePart) && (datePart >= 1 && datePart <= 31) && !dayAdded) {
//             format += `dd`;
//             dayAdded = !dayAdded;
//         }

//         if(!isNaN(datePart) && (datePart >= 1 && datePart <= 12) && !monthAdded) {
//             format += `mm`;
//             monthAdded = !monthAdded; 
//         }
//     }
// };

// TODO: comple date inferece functions
// const inferFullDateFormat = (part='', format='') => {
//     let dayAdded = false, 
//         monthAdded = false, 
//         yearAdded = false, 
//         abbrDayAdded = false, 
//         abbrMonthAdded=false;
    
//         const abbreviated = (part='', delimeter='', addDelimeter=false) => {
//         if(part.length == 3) {
//             const formatType = isAbbreviatedOrFullName(part);
//             if(formatType.isAbbrDay) {
//                 format += `DDD${addDelimeter ? delimeter : ''}`;
//                 abbrDayAdded = !abbrDayAdded;
//             } 
    
//             if(formatType.isAbbrMonth) {
//                 format +=`MMM${addDelimeter ? delimeter : ''}`;
//                 abbrMonthAdded = !abbrMonthAdded;
//             }    
//         }
//     };

    
// };


// Formulate strategy for inference
/*
    @param date
    @return format
    @description from the date the function infers the format
*/
// const inferDateFormat = (date='') => {
//     let format = '';
//     return checkAndExecuteSingleStringValue(date, format, (date) => {
//         if(date === '') {
//             return format;
//         }
//         const delimMatch = date.match(/[-,/,., ]/);
//         if(delimMatch) {
//             const dateOnly =  date.indexOf(',') !== -1 ? date.split(',')[0] : date; 
//             const delimeter = delimMatch.toString();
//             const dateArrayString = dateOnly.split(delimeter);
            
//             if(dateArrayString.length > 3) {
//                 return 'will work on this soon';
//             }
            
//             let callback = dateArrayString.length > 3 ? undefined : inferStandardFormat;
    
//             if(!callback) {
//                 return '';
//             }

//             for(let i=0; i < dateArrayString.length; ++i) {
//                 callback(dateArrayString[i], format);
//             }
//         }
    
//         return format; 
//     });
// };

/*
    @param date
    @return format
    @description from the date the function infers the format
*/
const getFormat = (value) => {
    return checkAndExecuteSingleStringValue(value, '', (validValue) => {
        const delimeter = findDelimeter(validValue);
        const delimeterGlobalRegex = new RegExp(delimeter, 'g');

        const indexes = {
            day: '{1}',
            month: '{2}',
            year: '{3}'
        };
        const result = [];
        switch(validValue.match(delimeterGlobalRegex).length) {
            case 2:
                validValue.split(delimeter).map( (value) => {
                    if(isDay(value)) {
                        if(result.indexOf(indexes.day) === -1) {
                            result.push(indexes.day);
                        }
                    }
                    if(isYear(validValue)) {
                        if(result.indexOf(indexes.year) === -1) {
                            result.push(indexes.year);
                        }
                    }
                    if(isMonth(validValue)) {
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
    });
};


/*
    @param
    @return
    @description
*/
const getWeekDayName = (day, month, year) => {
    const dayOfWeek = getDayOfWeek(day, month, year);
    return days.getInfo(dayOfWeek, 'name');
};

/*
    @param
    @return
    @description
*/
const getDatePart = (date='', format='', option='', parse) => {
    return checkAndExecute(date, format, -1, (curatedDate, curatedFormat) => get(curatedDate, curatedFormat, option, parse));
};

/*
    @param
    @return
    @description gets the coordinates of a specific alement of the date string
    and returns the actual value (as a string, maybe add option to parse it)
*/
const get = (date, format, option, parse) => {
    let position;
    switch(option) {
        case 'day':
            position = formats.findPosition(format, 'day');
            break;
        case 'month':
            position = formats.findPosition(format, 'month');
            break;
        case 'year':
            position = formats.findPosition(format, 'year');
            break;
        case 'all':
            position = formats.findPosition(format, 'all');
            break;
        default:
            position = -1;
            break;
    }

    if(position === -1) {
        console.warn(option + ' not found!');
		return position;
    }
    
    const part = getDatePartByPosition(date, position);
    if(parse) {   
        if(option === 'all') {
            Object.keys(part).forEach(result => {
                result[key] = parseInt(part);
            });
            return result;
        } else {
            return parseInt(part);
        }
    }

    return part
};

/*
    @param
    @return
    @description
 */
const getInfo = (value=-1|'', arrayOfOptions=[], option='') => {
    if(value == 0) {
        value = 1;
    }

    let number = -1;
    switch(option) {
        case 'full':
            return assertTypeOf(value, 'number') ? arrayOfOptions[value-1].fullName : ''; 
        case 'abbr':
            return assertTypeOf(value, 'number') ? arrayOfOptions[value-1].abbrName : ''; 
        case 'num':
            if(assertTypeOf(value, 'string') && !isNaN(value)) {
                number = arrayOfOptions
                    .map( (info, index) => {
                        if(info.fullName === value || info.abbrName === value) {
                            return index+1;
                        }
                    })[0];
            }
            return number;
        default:
            return {};
    }
};


/*
    @param
    @return
    @description
*/
const replaceValue = (value='', position={}, container='', option='') => {
    if(Object.keys(position).length > 2) {
        console.warn("[replaceValue] only works with individual positoning!");
        return container;
    } else {
        if( !(option === 'day'|'month'|'year') ) {
            const currentValue = container.substring(position.start, position.end+1);
            return container.replace(currentValue, value);
        }
        return container;
    }
};


/*
    @param
    @return
    @description
*/
const getDatePartByPosition = (date, position) => {
    const keys = Object.keys(position);
    const values = {
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

// returns a full month from a specific date
/*
    @param
    @return
    @description
*/
const genMonthFromDate = function(from, to, month, year, delimeter) {
    const fullMonth = [];
	const fromDate = new Date(from);
	const toDate = new Date(to);
	
	let firstCall = true;
    while(fromDate != toDate) {
        let date = [];
        // TODO: test this section, using an array might not be a viable solution to concatenate the date value into one
        // const replaceValue = (positions, date, value) => date.replace(date.substring(positions.start, positions.end), value);

        date[positions.day] = fromDate;
        date[positions.month] = month;
        date[positions.year] = year;

       const dayOfWeek = getDayOfWeek(fromDate, month, year);
       const dayInfo = {
            calendarDate: firstCall ? from : date.join(delimeter), 
            dayName: days.getInfo(dayOfWeek, 'name'),
            dayOfWeek: dayOfWeek,
            monthDay: fromDate.toLocaleDateString(),
            timeSet: { time: '00:00:00', format: '' },
            week: getWeekNumber(date.toLocaleDateString())
        };
        fullMonth.push(dayInfo);
        if(fromDate == toDate) {
          break;
        }

		fromDate++;        
    }
	
	fullMonth.push({
        calendarDate: to, 
        dayName: days.getInfo(dayOfWeek, 'name'),
        dayOfWeek: dayOfWeek,
        monthDay: fromDate.toLocaleDateString(),
        timeSet: { time: '00:00:00', format: '' },
        week: getWeekNumber(date.toLocaleDateString())
    });
	
    return fullMonth;
};

//
//
// returns the week number of the specific day
/*
    @param
    @return
    @description
*/
const getWeekNumber = function(date= '' | {}, year=0) {

    let curatedDate;
    if(date instanceof Date) {
        curatedDate = date;
    } else if(assertTypeOf(date, 'string')) {
        curatedDate = new Date(date);
    } else {
        console.warn('Invalid date type as argument');
        return -1;
    }

    const millisTillDate = (new Date('01/01/' + year) - curatedDate) / (1000 * 59 * 59 * 24);
    const totalDaysToDate = Math.abs( millisTillDate );

    return Math.round(totalDaysToDate / 7);
};

// Tomohiko Sakamoto algorithm (read later)
/*
    @param
    @return
    @description
*/
const getDayOfWeek = function(day, month, year) {
    const tDays = [0, 3, 2, 5, 0, 3, 5, 1, 4, 6, 2, 4];
    const nYear = year - (month < 3) ? 1 : 0;
    const dayOfWeek = (nYear + nYear/4 - nYear/100 + nYear/400 + tDays[month-1] + day) % 7;
    return Math.ceil(dayOfWeek);
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
const isLeapYear = (year) => {
	if(isEmpty(year)) {
		return false;
    }

    const isLeap = (yearVal) => (yearVal / 4) % 1 == 0 ? (yearVal / 100) % 1 != 0 ? true : (yearVal / 400) % 1 == 0 ? true : false : false;
    
    if (assertTypeOf(year, 'number')) {
        return isLeap(year);
    }

    if(assertTypeOf(year, 'string') &&  stringIsNumeric(year)) {
        year = parseInt(year);
        return isLeap(year);
    }

    console.warn('Expected a number but got: ' + (typeof year));
    return false;
};

// Time detection & validation functions
// ==================================================================

/*
    @param date
    @return time string if found, otherwise empty string
    @description finds a time value within a specific string
*/
const detectTime = (date='') => {
	return checkAndExecuteSingleStringValue(date, '', (validDate) => {
		let time;
        if(date.indexOf(',') !== -1) {
            time = validDate.split(',')[validDate.length-1].trim();
            if(!isValidTime(time)) {
                return '';
            } 

            return time; 
        } else {
            const matchedValue = validDate.indexOf(':');
            if(matchedValue > -1) {
                time = validDate.substring(matchedValue-2, validDate.length);
                const occurances = time.split('').filter(val => val === ':').length;
                let missingIndexes = 2;

                if(time.indexOf('.') !== -1) {
                    missingIndexes += ((missingIndexes * 2) + 1);
                }
                return time.substring(0, 3*occurances+missingIndexes );
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
const getTimeValue = (time='', option='', hasSeconds=false, parseToInt=false) => {
    const defaultValue = parseToInt ? -1 : '';
    return checkAndExecute(time, option, defaultValue, (time, option) => {
        switch(option) {
            case 'hour':
                const hour = time.substring(0, 2);
                return asInt ? parseInt(hour) : hour;
            case 'minutes':
                const minutes = time.substring(3, 5); 
                return asInt ? parseInt(minutes) : minutes;
            case 'seconds':
                const seconds = time.substring(6, 8);
                return hasSeconds ? (asInt ? parseInt(seconds) : seconds) : '';
            case 'all':
                const timeValues = {
                    hour: time.substring(0, 2),
                    minutes: time.substring(3, 5)
                };
                if(hasSeconds) {
                    const secondsAsString = time.substring(6, 8);
                    timeValues.seconds = parseToInt ? parseInt(secondsAsString) : secondsAsString;
                }
                if(parseToInt) {
                    timeValues.hour = parseInt(timeValues.hour);
                    timeValues.minutes = parseInt(timeValues.minutes);
                }
                return timeValues;
        }
    });
};

const inferTimeFormat = (time='') => {
    const timeParts = time.split(':');
    const lastPart = timeParts[timeParts.length - 1];
    if(lastPart.includes('.')) {
       const parts = lastPart.split('.');
       const lastIndex = timeParts.length - 1;

       timeParts[lastIndex] = parts[0];
       timeParts[lastIndex+1] = parts[1];
    }
    switch(timeParts.length) {
        case 2: 
            return {
                format: 'hh:mm',
                hasSeconds: false
            };
        case 3:
            return {
                format: 'hh:mm:ss',
                hasSeconds: true
            };
        case 4:
            return {
                format: 'hh:mm:ss.s',
                hasSeconds: true
            };
        default:
            console.warn("Invalid time format detected");
            return {};
    }
};


/*
    @param
    @return
    @description
*/
const  isValidTime = (time='') => {

    const timeChecker = (_time='', hasSeconds=false, hasMillis=false) => {
        const hour   = timeParts.hour;
        const minutes = timeParts.minutes;

        const check = (quantifier, isHour=false) => {
            return isHour ? (quantifier >= 0 && quantifier <= 24) : (quantifier >= 0 && quantifier <= 59); 
        };
        if( hasSeconds ) {
            const seconds = _time[3];
            return check(hour, true) && check(minutes, false) && check(seconds, false); 
        } else if(hasSeconds && hasMillis) {
            const seconds = _time[3], millis = _time[4];
            return check(hour, true) && check(minutes, false) && check(seconds, false) && check(millis, false);
        } else return check(hour, true) && check(minutes);
    };

    let _time;
    let seconds;
    if(time.includes('.')) {
        _time = time.split(':');
        seconds = _time[2].split('.');
        _time[2] = seconds[0];
        _time[3] = seconds[1];

        _time = _time.map(Number);
    } else {
        _time = time.split(':').map(Number);
    }

    const inferenceResult = inferTimeFormat(time);
    const timeParts = getTimeValue(time, 'all', inferenceResult.hasSeconds, true);

    switch (inferenceResult.format) {
        case 'hh:mm:ss':
            return timeChecker(_time, true, false);
        case 'hh:mm':
            return timeChecker(_time, false, false);
        case 'hh:mm:ss.s':
            return timeChecker(_time.map(Number), true, true);
        default:
            return false;
    }
};


const includesTime = (date) => {
    if(isEmpty(date)) {
        return false;
    }

    if(isEmpty(date.indexOf(','))) {
        return false;
    }

    const dateArrayString = date.split(',');

    return isValidTime(dateArrayString[1]);
}

// Prototype methods
// ============================================================

//
// generates days of a full month from a specific date
// the days are objects with information about the time, weekday, annual week, etc...
// the object properties should be self-explanatory
// function has time complexity => O(N+N)
/*
    @param
    @return
    @description
*/
chronologic.prototype.getMonthObject = function(date='', format='') {
    return checkAndExecute(date, format, '', (date, format) => {
        const month = getDatePart(date, format, 'month', true);
        const dayOne = 1,
              endDay = this.getMonthLength(month); 
        const year = getDatePart(date, format, 'year', true);
        const positions = formats.findPosition(format, 'all');

        return genMonthFromDate(dayOne, endDay, month, year, findDelimeter(format), positions); 
    });
};

// TODO: rewrite this function, so it formats the date based on the position of the day, month and year placeholders in the format string  
// Unfinished function - hide for now
// chronologic.prototype.reformat = function(date, oldFormat, newFormat) {
// deprecated
/*
    @param
    @return
    @description
*/
// chronologic.prototype.reformat = function(newformat='', dateParts={}) {
//     return checkAndExecute(this.date, format, '', (date, format) => {
//         const formatParts = getDatePart(date, newformat, 'all', false);
//         let dateContent;

//         if(dateParts && Object.keys(dateParts).length > 0) {
//             dateContent = dateParts;
//         } else {
//             dateContent = getDatePart(this.date, this.format, 'all');
//         }

//         const positions = formats.findPositionPositions(format, 'all');
//         return replaceMutipleValues(formatParts, positions, dateParts);
//         // return format.replace(formatParts.day, dateContent.day)
//         //             .replace(formatParts.month, dateContent.month)
//         //             .replace(formatParts.year, dateContent.year);
//     });
// };

// Other methods
// ============================================================

// time complexity => 
/*
    @param
    @return
    @description 
*/
// chronologic.prototype.timeLocaleToString = function(date='') {
//     const time = detectTime(date);
//     const inferencedResult = inferTimeFormat(time);
//     const timeParts = getTimeValue(time, 'all', inferencedResult.hasSeconds, false);
//     const newTimeString = `${timeParts.hour}:${timeParts.minutes}:${inferencedResults.hasSeconds ? timeParts.seconds : ''}`;

//     if(!isValidTime(newTimeString, inferencedResult.format)) {
//         return '00:00:00';
//     }
//     return createdTimeString;
// };


// generates a full year with all information about months and days
// time complexity => best: O(n), worst: O(n)
/*
    @param
    @return
    @description
*/
chronologic.prototype.genFullYear = function(date='', format='') {
    let year = checkAndExecute(date, format, -1, (date, format) => getDatePart(date, format, 'year', true) );

    if(year === '') {
        year = getDatePart(this.date, this.format, 'year', true);
    }

    const months = [];
    const positions = formats.findPosition(format, 'all');
    for(let iMonth = 1; iMonth <= 12; ++iMonth) {
        const monthLength = this.getMonthLength(iMonth, year); 
        const fullMonth = genMonthFromDate(1, monthLength, iMonth, year, positions);
        months.push(fullMonth);
    }

    return months;
};

//
// generates a full month by by providing the date and the format
// the information is precise and has all information regarding the current month
// time complexity => best: O(1), worst: O(n)
/*
    @param
    @return
    @description
*/
chronologic.prototype.genMonth = function(date, format) {
    let month;
    if(date && format) {
        let isValidFormat = false;
        this.formats.date.forEach( (acceptedFormat) => {
            if(format === acceptedFormat.type) {
                isValidFormat = true;
            }
        });
        if(isValidFormat) {
            month = getDatePart(date, format, 'month', true);
        } else {
            console.warn('Invalid format provided, the format provided is not supported');
            return;
        }
    } else {
        month = getDatePart(this.date, this.format, 'month', true);
    }

    const year = getDatePart(date, format, 'year', true);
    const monthName = months.getInfo(month, 'fullName', year);
    const time = { 
        time: '00:00:00',
        format: 'hh:mm:ss' 
    };
    
    const currentMonth = new Date.getMonth();
    return {
        totalDays: this.getMonthLength(month, year),
        name: monthName,
        calendarNumber: month,
        isCurrentMonth: month === currentMonth,
        // days: this.genMonthDays(day, format),
        time: time,
        year: year
    };
};


// ============================================================
// General purpose functions
// ============================================================

/*
    @param
    @return
    @description
*/
const replaceMutipleValues = (values=[], positions={}, container) => { 
    let temp = container;
    Object.keys(positions).forEach( (option, index) => {
        temp = replaceValue(values[index], positions[option], temp, option);
    });

    return temp;
};

/*
    @param
    @return
    @description
*/
const findIndexes = (format='', arrayOfOptions=[]) => {
   return arrayOfOptions.map( (acceptedFormat) => {
        const match = format.match(acceptedFormat.regex);
        if(match) {
            const stringValueFound = match.toLocaleString();
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
const findDelimeter = (format='') => {
    return checkAndExecuteSingleStringValue(format, '', (curatedFormat) => {
        const regex = /[-, ,. /]/;
        return curatedFormat.match(regex).toString();
    });
};

/*
    @param
    @return
    @description given two string values it checks for a blank element 
    throws callstack except 
    */
   const checkAndExecuteSingleStringValue = (valueOne, defaultValue, callback) =>{
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
    throws callstack except 
*/
const checkAndExecute = (valueOne, valueTwo, defaultValue, callback) =>{
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
const isChar = (digit) => (assertTypeOf(digit, 'string') && digit.length === 1) && (digit.toLowerCase() >= 'a' && digit.toLowerCase() <= 'z');

/*
    @param
    @return
    @description a general purpose function that checks a single digit string to see if is a valid character
*/
const isValidName = (stringValue) => {
    for(const char in stringValue) {
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
const stringIsNumeric = (stringValue) => {
    if(stringValue === undefined || stringValue === null || !assertTypeOf(stringValue, 'string') || stringValue === '') {
        return false;
    }
    for(let index = 0; index < stringValue.length; ++index) {
        const char = stringValue[index];
        if(isNaN(char) && !isChar(char)) { 
            return false;
        }
    }
    return true;
};

/*
    @param
    @return
    @description simple check for the type of a value
*/
const assertTypeOf = (value, type='') => value && (value).constructor.name.toLowerCase() === (type).toLowerCase();

/*
    @param
    @return
    @description Checks of a string is either undefined or empty
*/
const isEmpty = (value) => {
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