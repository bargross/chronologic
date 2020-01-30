
export const inferTimeFormat = (time='') => {
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


/*
    @param
    @return
    @description
*/
export const isValidTime = (time='') => {

    var timeChecker = (_time='', hasSeconds=false, hasMilliseconds=false) => {
        var hour   = timeParts.hour;
        var minutes = timeParts.minutes;

        var check = (quantifier, isHour=false) => {
            return isHour ? (quantifier >= 0 && quantifier <= 24) : (quantifier >= 0 && quantifier <= 59); 
        };
        if( hasSeconds ) {
            var seconds = _time[3];
            return check(hour, true) && check(minutes, false) && check(seconds, false); 
        } else if(hasSeconds && hasMilliseconds) {
            var seconds = _time[3], milliseconds = _time[4];
            return check(hour, true) && check(minutes, false) && check(seconds, false) && check(milliseconds, false);
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

    var inferenceResult = inferTimeFormat(time);
    var timeParts = getTimeValue(time, 'all', inferenceResult.hasSeconds, true);

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