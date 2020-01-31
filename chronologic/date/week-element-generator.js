import { checkAndExecute, assertTypeOf } from "../helper/helper";
import { ElementExtractor } from "./element-extractor";
import { getDayInfo } from "../maps/day";
import { Formatter } from "./formatter";


export class WeekElementGenerator {

    // returns the week number of the specific day
    /*
        @param
        @return
        @description
    */
    static findWeekNumber = function(date= '' | Date, format='', year=0) {

        let validDate;
        if(date instanceof Date) {
            validDate = date;
        
        } else if(assertTypeOf(date, 'string')) {

            var utcDateString = Formatter.dateToUTCDateString(date, format);
            validDate = new Date(utcDateString);

        } else {
        
            throw new Error('Invalid [date] parameter provided');
        }
        
        var firstDayOfYear = new Date('01/01/' + year);
        
        var millisecondsTillDate = (firstDayOfYear - validDate) / (1000 * 59 * 59 * 24);
        var totalDaysToDate = Math.abs( millisecondsTillDate );
        
        return Math.round(totalDaysToDate / 7);
    };

    // Tomohiko Sakamoto algorithm (read later)
    /*
        @param
        @return
        @description
    */
    static findDayOfWeek = function(day, month, year) {
        var tDays = [0, 3, 2, 5, 0, 3, 5, 1, 4, 6, 2, 4];
        var nYear = year - (month < 3) ? 1 : 0;
        var dayOfWeek = (nYear + nYear/4 - nYear/100 + nYear/400 + tDays[month-1] + day) % 7;

        return Math.ceil(dayOfWeek);
    };

    static findDayOfWeekByDate(date='', format='') {
        return checkAndExecute(date, format, '', (sanitizedDate, sanitizedFormat) => {
            var allDateParts = ElementExtractor.getDatePart(sanitizedDate, sanitizedFormat, 'all', true);
            var dayOfWeek = this.findDayOfWeek(allDateParts.day, allDateParts.month, allDateParts.year);
            
            if(dayOfWeek) {
                return dayOfWeek;
            }

            throw Error('Invalid date provided'); 
        });
    };

    /*
        @param
        @return
        @description
    */
    static findWeekDayName (day, month, year) {
        var dayOfWeek = this.findDayOfWeek(day, month, year);

        return getDayInfo(dayOfWeek, 'name');
    };

    /*
        @param
        @return
        @description
    */
    static findWeekDayNameByDate = (date, format) => {
        var dateParts = ElementExtractor.getDatePart(date, format, 'name', true);
        var dayOfWeek = this.findDayOfWeek(dateParts.day, dateParts.month, dateParts.year);

        return getDayInfo(dayOfWeek, 'name');
    };
}