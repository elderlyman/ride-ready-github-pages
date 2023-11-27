import React, { useEffect, useState } from 'react';
import '../styles.css';
import {
    formatWeatherForecastTimeFully,
    roundEventStartTime,
    formatEventTime,
} from '../helpers/utils';
import {
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
} from '@mui/material';

//test revert

const WeatherEventsTable = () => {
    const [eventsWithWeather, setEventsWithWeather] = useState([]);
    const [loading, setLoading] = useState(true);
    // const [weatherLocation, setWeatherLocation] = useState(`lat=42.3601&lon=-71.0589`); // Default location is Boston
    const [lat, setLat] = useState('42.3601');
    const [lon, setLon] = useState('-71.0589');
    const [daysFromNow, setDaysFromNow] = useState('2 days');
    const [eventLocation, setEventLocation] = useState('boston');
    const [clickedLocationButton, setClickedLocationButton] = useState('boston');
    const [clickedRangeButton, setClickedRangeButton] = useState('2 Days');
    const [timeRange, setTimeRange] = useState('2 Days');

    const bestBostonVenues = [
        "Fenway Park",
        "TD Garden",
        "Charles Playhouse",
        "Citizens Bank Opera House",
        "House of Blues - Boston",
        "Orpheum Theatre",
        "Shubert Theatre",
        "Boch Center Wang Theatre",
        "Big Night Live",
        "Rockland Trust Bank Pavilion",
    ];

    const bestNewOrleansVenues = [
        "Smoothie King Center",
        "Saenger Theatre New Orleans",
        "The Fillmore New Orleans",
        "House of Blues New Orleans",
        "Orpheum Theater New Orleans",
        "Tipitinas",
        "The Joy Theater",
        "Mahalia Jackson Theater",
        "Civic Theatre",
        "One Eyed Jacks",
    ];

    const [bestVenues, setBestVenues] = useState(bestBostonVenues);

    const handleLocationChange = (newLocation) => {
        if (newLocation === 'boston') {
            setEventLocation('boston');
            // setWeatherLocation(`lat=42.3601&lon=-71.0589`);
            setLat('42.3601');
            setLon('-71.0589');
            setBestVenues(bestBostonVenues);
        } else if (newLocation === 'new orleans') {
            setEventLocation('new orleans');
            // setWeatherLocation(`lat=29.9511&lon=-90.0715`);
            setLat('29.9511');
            setLon('-90.0715');
            setBestVenues(bestNewOrleansVenues);
        }
        setClickedLocationButton(newLocation);
    };

    const handleTimeRangeChange = (newTimeRange) => {
        setTimeRange(newTimeRange);
        setClickedRangeButton(newTimeRange);
    };

    useEffect(() => {
        const formatDateRange = (range) => {
            const date = new Date();
            date.setDate(date.getDate() + range);
            const dd = date.getDate().toString().padStart(2, '0');
            const mm = (date.getMonth() + 1).toString().padStart(2, '0');
            const yyyy = date.getFullYear();
            const hh = date.getHours().toString().padStart(2, '0');
            const minutes = date.getMinutes().toString().padStart(2, '0');
            const ss = date.getSeconds().toString().padStart(2, '0');
            return `${yyyy}-${mm}-${dd}T${hh}:${minutes}:${ss}`;
        };

        let daysFromNow = formatDateRange(2);

        if (timeRange === '7 Days') {
            setDaysFromNow(formatDateRange(7));

        } else if (timeRange === '30 Days') {
            setDaysFromNow(formatDateRange(30));
        }

        const fetchData = async () => {
            const siteName = 'admirable-seahorse-918a72';
            const helloFunctionUrl = `https://${siteName}.netlify.app/.netlify/functions/hello`;
            const getWeatherFunctionUrl = `https://${siteName}.netlify.app/.netlify/functions/getWeather?lat=${lat}&lon=${lon}&exclude=minutely,daily&units=imperial&appid=${process.env.REACT_APP_OPENWEATHERMAP_APP_ID}`;
            const getSeatGeekEventsFunctionUrl = `https://${siteName}.netlify.app/.netlify/functions/getSeatGeekEvents?client_id=${process.env.REACT_APP_SEATGEEK_CLIENT_ID}&venue.city=${eventLocation}&datetime_local.lte=${daysFromNow}&per_page=1000`;

            // Making an HTTP GET request to the Netlify function endpoint
            fetch(helloFunctionUrl)
                .then(response => response.json())
                .then(data => console.log(data))
                .catch(error => console.error('Error:', error));


            // TODO = understand why these are both breaking uniformly now.header error ? but maybe node error
            try {
                const response = await Promise.all([
                    fetch(getWeatherFunctionUrl
                    ),
                    fetch(
                        getSeatGeekEventsFunctionUrl),
                ]);


                //old

                // try {
                //     const response = await Promise.all([
                //         fetch(
                //             `https://api.openweathermap.org/data/2.5/onecall?${weatherLocation}&exclude=minutely,daily&units=imperial&appid=${process.env.REACT_APP_OPENWEATHERMAP_APP_ID}`
                //         ),
                //         fetch(
                //             `https://api.seatgeek.com/2/events?client_id=${process.env.REACT_APP_SEATGEEK_CLIENT_ID}&venue.city=${eventLocation}&datetime_local.lte=${daysFromNow}&per_page=1000`
                //         )
                //     ]);


                const data = await Promise.all(response.map((res) => res.json()));

                const openWeatherData = data[0];
                const seatGeekData = data[1];

                const futureEvents = seatGeekData.events.filter(
                    (event) => new Date(event.datetime_local) > new Date()
                );

                const eventsWithWeather = futureEvents.map((event) => {
                    const timeMatchWeatherForecast = openWeatherData.hourly.find(
                        (weatherItem) =>
                            formatWeatherForecastTimeFully(weatherItem.dt).toString() ===
                            roundEventStartTime(event.datetime_local).toString()
                    );

                    return {
                        ...event,
                        timeMatchWeatherForecast: timeMatchWeatherForecast || null,
                    };
                });

                setEventsWithWeather(eventsWithWeather);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, [eventLocation, timeRange, bestVenues, lat, lon, daysFromNow]);

    return (
        <div>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <div>
                    <Button
                        onClick={() => handleLocationChange('boston')}
                        style={{
                            borderColor: clickedLocationButton === 'boston' ? 'red' : 'transparent',
                            borderWidth: '2px',
                            color: clickedLocationButton === 'boston' ? 'red' : 'blue',
                        }}
                    >
                        Boston
                    </Button>
                    <Button
                        onClick={() => handleLocationChange('new orleans')}
                        style={{
                            borderColor: clickedLocationButton === 'new orleans' ? 'red' : 'transparent',
                            borderWidth: '2px',
                            color: clickedLocationButton === 'new orleans' ? 'red' : 'blue',
                        }}
                    >
                        New Orleans
                    </Button>
                    <Button
                        onClick={() => handleTimeRangeChange('7 Days')}
                        style={{
                            borderColor: clickedRangeButton === '7 Days' ? 'red' : 'transparent',
                            borderWidth: '2px',
                            color: clickedRangeButton === '7 Days' ? 'red' : 'blue',
                        }}
                    >
                        7 Days
                    </Button>
                    <Button
                        onClick={() => handleTimeRangeChange('30 Days')}
                        style={{
                            borderColor: clickedRangeButton === '30 Days' ? 'red' : 'transparent',
                            borderWidth: '2px',
                            color: clickedRangeButton === '30 Days' ? 'red' : 'blue',
                        }}
                    >
                        30 Days
                    </Button>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Date</TableCell>
                                    <TableCell>Event</TableCell>
                                    <TableCell>Ticket Price Range</TableCell>
                                    <TableCell>Venue</TableCell>
                                    {eventsWithWeather[0]?.timeMatchWeatherForecast ? (
                                        <>
                                            <TableCell>Temp</TableCell>
                                            <TableCell>Feels Like</TableCell>
                                            <TableCell>Wind</TableCell>
                                            <TableCell>Conditions</TableCell>
                                        </>
                                    ) : null}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {eventsWithWeather.map((event) => (
                                    <TableRow key={event.id}>
                                        <TableCell>{formatEventTime(event.datetime_local)}</TableCell>
                                        <TableCell>{event.short_title}</TableCell>
                                        <TableCell>${event.stats.lowest_price} - ${event.stats.highest_price}</TableCell>
                                        <TableCell>{event.venue.name}</TableCell>
                                        {event.timeMatchWeatherForecast ? (
                                            <>
                                                <TableCell>{event.timeMatchWeatherForecast.temp}&deg; F</TableCell>
                                                <TableCell>{event.timeMatchWeatherForecast.feels_like}&deg; F</TableCell>
                                                <TableCell>{event.timeMatchWeatherForecast.wind_speed} M.P.H.</TableCell>
                                                <TableCell>{event.timeMatchWeatherForecast.weather[0].description}</TableCell>
                                            </>
                                        ) : null}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            )}
        </div>
    );
};

export default WeatherEventsTable;
