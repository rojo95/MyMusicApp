export function milisegundosToMinutesAndHours(milliseconds) {
    var seconds = Math.floor(milliseconds / 1000);
    var minutes = Math.floor(seconds / 60);
    var hours = 0;

    if (minutes > 60) {
        hours = Math.floor(minutes / 60);
        minutes = minutes % 60;
    }

    var seconds = seconds % 60;

    if (hours > 0) {
        return (
            (hours < 10 ? "0" + hours : hours) +
            ":" +
            (minutes < 10 ? "0" + minutes : minutes) +
            ":" +
            (seconds < 10 ? "0" + seconds : seconds) +
            " hrs"
        );
    } else if (minutes > 0) {
        return (
            minutes + ":" + (seconds < 10 ? "0" + seconds : seconds) + " min"
        );
    } else {
        return seconds + " sec";
    }
}

export function formatNumber(num) {
    return parseFloat(num).toLocaleString("de-DE");
}
