import { isEmpty } from "../utils/utils";
import { ElementExtractor } from "./element-extractor";
import { Validator } from "./validator";



export class Format {

    /**
     * Converts a date to UTC format
     * 
     * @static
     * @memberof Formatter
     * @function dateToUTCDateString
     * @param {string} date
     * @param {string} format
     */
    static dateToUTCDateString(date = '', format='') {
        if(isEmpty(date)) {
            throw new Error('No [date] or valid [date] parameter provided');
        }

        if(isEmpty(format)) {
            throw new Error('No [format] or valid [format] parameter provided');
        }
        
        var day = ElementExtractor.getDay(date, format);
        var month = ElementExtractor.getMonth(date, format);
        var year = ElementExtractor.getYear(date, format);

        return `${month}-${day}-${year}`;
    };

    /**
     * Not worth writing about this yet
     * 
     * @static
     * @memberof Generator
     * @function inferStandardFormat
     * @param {string} date
     * @param {string} format
     */
    static inferStandardFormat(part='', format='') {
        
        // TODO: find a better solution to auto format detection and dispose of this ugly solution which doesn't even work properly (ugh!) 

        let dayAdded = false, monthAdded = false, yearAdded = false;
        var datePart = Number(part);

        var abbreviated = (part='', delimiter='', addDelimiter=false) => {
            if(part.length == 3) {
                var formatType = Validator.isAbbreviatedOrFullName(part);
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

    static inferTimeFormat(time='') {
        
        var timeParts = time.split(':');
        var lastPart = timeParts[timeParts.length - 1];
    
        if(lastPart.includes('.')) {
           var parts = lastPart.split('.');
           var lastIndex = timeParts.length - 1;
    
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

    // TODO: comple date inferece functions
    //  inferFullDateFormat = (part='', format='') {
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
    // inferDateFormat = (date='') {
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
}