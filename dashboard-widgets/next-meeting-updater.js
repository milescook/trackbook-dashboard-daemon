next_meeting_updater = {};
var weather_service = require('../weather-service.js');

next_meeting_updater.process = function (widgets)
{
    widgets.forEach(next_meeting => {
        search_params = {};
        search_params.location = next_meeting.data_object.postcode;
        search_params.date = next_meeting.data_object.date;
        const day_weather_call = new Promise(resolve => weather_service.get_by_search(search_params,resolve));

        Promise.all([day_weather_call]).then(function(return_values){
            next_meeting = next_meeting_updater.add_weather_updates(return_values,next_meeting);
        next_meeting_updater.update_meeting_data(next_meeting);
        });
     
});
}

// Expects an array of weather results: 0 => day, 1..n => n sessions
next_meeting_updater.add_weather_updates = function(weather_results,next_meeting)
{
    next_meeting.data_object.weather = next_meeting_updater.parse_meeting_weather(weather_results[0].forecast.forecastday[0].day);
    next_meeting.data_object = JSON.stringify(next_meeting.data_object);
    next_meeting.last_updated = new Date().toISOString().slice(0, 19).replace('T', ' ');
    return next_meeting;
}

next_meeting_updater.parse_meeting_weather = function(weather)
{
    console.log("Returning meeting with weather");
    weather_object = {};
    weather_object.temp_low = weather.mintemp_c;
    weather_object.temp_high = weather.maxtemp_c;
    weather_object.condition_text = weather.condition.text;
    weather_object.graphic = weather.condition.icon;
    
    return weather_object;
}


next_meeting_updater.update_meeting_data = function(next_meeting)
{
    trackbook_dashboard_service.update_widget(next_meeting);
}

module.exports = next_meeting_updater