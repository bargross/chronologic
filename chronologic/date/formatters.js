import { isEmpty } from "../helper/helper";
import { getDay, getMonth, getYear } from "./splitters";


/*
    @param
    @return
    @description
*/

export const dateToUTCDateString = (date = '', format='') => {
    if(isEmpty(date)) {
        throw new Error('No [date] or valid [date] parameter provided');
    }

    if(isEmpty(format)) {
        throw new Error('No [format] or valid [format] parameter provided');
    }
	
    var day = getDay(date, format);
    var month = getMonth(date, format);
    var year = getYear(date, format);

    return `${month}-${day}-${year}`;
};

// TODO: find the solution for the auto-format detector

/*
    @param
    @return
    @description Not used yet but will be used for the validation of time object representation
*/
var inferStandardFormat = (part='', format='') => {
    let dayAdded = false, monthAdded = false, yearAdded = false;
    var datePart = Number(part);
    var abbreviated = (part='', delimiter='', addDelimiter=false) => {
        if(part.length == 3) {
            var formatType = isAbbreviatedOrFullName(part);
            if(formatType.isAbbrDay) {
                format += `DDD${addDelimiter ? delimiter : ''}`;
                dayAdded = !dayAdded;
            } 
    
            if(formatType.isAbbrMonth) {
                format +=`MMM${addDelimiter ? delimiter : ''}`;
                monthAdded = !monthAdded;
            }
        }
    };
    if(i < dateArrayString.length - 1) {
        
        abbreviated(part, format, delimiter, true);

        if(part.length === 4 && !yearAdded) {
            format += `yyyy${delimiter}`;
            yearAdded = !yearAdded;
        }

        if(!isNaN(datePart) && (datePart >= 1 && datePart <= 31) && !dayAdded) {
            format += `dd${delimiter}`;
            dayAdded = !dayAdded;
        }

        if(!isNaN(datePart) && (datePart >= 1 && datePart <= 12) && !monthAdded) {
            format += `mm${delimiter}`;
            monthAdded = !monthAdded; 
        }
    } else {
        abbreviated(part, format, delimiter, false);

        if(part.length === 4 && !yearAdded) {
            format += `yyyy`;
            yearAdded = !yearAdded;
        }

        if(!isNaN(datePart) && (datePart >= 1 && datePart <= 31) && !dayAdded) {
            format += `dd`;
            dayAdded = !dayAdded;
        }

        if(!isNaN(datePart) && (datePart >= 1 && datePart <= 12) && !monthAdded) {
            format += `mm`;
            monthAdded = !monthAdded; 
        }
    }
};

// TODO: comple date inferece functions
// var inferFullDateFormat = (part='', format='') => {
//     let dayAdded = false, 
//         monthAdded = false, 
//         yearAdded = false, 
//         abbrDayAdded = false, 
//         abbrMonthAdded=false;
    
//         var abbreviated = (part='', delimeter='', addDelimeter=false) => {
//         if(part.length == 3) {
//             var formatType = isAbbreviatedOrFullName(part);
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
// var inferDateFormat = (date='') => {
//     let format = '';
//     return checkAndExecuteSingleStringValue(date, format, (date) => {
//         if(date === '') {
//             return format;
//         }
//         var delimMatch = date.match(/[-,/,., ]/);
//         if(delimMatch) {
//             var dateOnly =  date.indexOf(',') !== -1 ? date.split(',')[0] : date; 
//             var delimeter = delimMatch.toString();
//             var dateArrayString = dateOnly.split(delimeter);
            
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