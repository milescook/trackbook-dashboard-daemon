next_meeting_updater = {};
var weather_service = require('../weather-service.js');

next_meeting_updater.process = function (widgets)
{
    widgets.forEach(next_meeting => {
        search_params = {};
        search_params.location = next_meeting.data_object.postcode;
        search_params.date = next_meeting.data_object.date;
        weather_service.get_by_search(search_params,next_meeting,next_meeting_updater.update_weather );
    }); 
}

next_meeting_updater.update_weather = function(weather,next_meeting)
{
    weather_object = {};
    next_meeting.data_object.weather.temp_low = weather.forecast.forecastday[0].day.mintemp_c;
    next_meeting.data_object.weather.temp_high = weather.forecast.forecastday[0].day.maxtemp_c;
    next_meeting.data_object.weather.condition_text = weather.forecast.forecastday[0].day.condition.text;
    next_meeting.data_object.weather.graphic = weather.forecast.forecastday[0].day.condition.icon;
    next_meeting.data_object = JSON.stringify(next_meeting.data_object);
    next_meeting.last_updated = new Date().toISOString().slice(0, 19).replace('T', ' ');
    next_meeting_updater.update_meeting_data(next_meeting);
    console.log("SETTING WEATHER:")
    console.log(next_meeting.data_object.weather);
}


next_meeting_updater.update_meeting_data = function(next_meeting)
{
    trackbook_dashboard_service.update_widget(next_meeting);
}

module.exports = next_meeting_updater