export const formatWeatherForecastTimeFully = (unixTimeStamp) => {
    return new Date(unixTimeStamp * 1000);
};


export const roundEventStartTime = (eventStartLocalTimeUTC) => {
    const date = new Date(eventStartLocalTimeUTC);
    let hh = date.getHours();
    let minutes = date.getMinutes();

    if (minutes <= 30) {
        minutes = 0;
    } else {
        minutes = 0;
        hh++;
        if (hh > 24) {
            hh = 0;
        }
    }

    // Set the rounded hours and minutes
    date.setHours(hh, minutes, 0, 0);

    return date;
};



export const twoDigitEventDate = (eventStartLocalTimeUTC) => {
    return new Date(eventStartLocalTimeUTC).getDate();
};

export const twoDigitDateToday = new Date().getDate();
export const twoDigitDateTomorrow = twoDigitDateToday + 1;

export const formatEventTime = (datetime_local) => {
    const date = new Date(datetime_local);


    return date.toLocaleString("en-US", {
        weekday: "short",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}
