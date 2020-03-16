weather_service = {};
var http = require('http');
var nconf = require('nconf');
var request = require('request-promise-native');

nconf.env().file({ file: 'weatherapi-config.json' })

var api_key = nconf.get('TBD_WEATHER_API_KEY');

weather_service.date_validates = function(date,date_now)
{
    if(undefined==date_now)
        date_now_unix = Math.floor(new Date() / 1000);
    else
        date_now_unix = Date.parse(date_now) / 1000;

    date_check_unix = Date.parse(date) / 1000;
    
    max_diff = 60 * 60 * 24 * 10;

    return date_check_unix < date_now_unix || ( date_check_unix - date_now_unix < max_diff);
}
// WeatherAPI.com
weather_service.get_by_search = function (search_params, resolve)  {

    if(!weather_service.date_validates(search_params.date))
    {
        console.log("Date not valid for API call: "+search_params.date);
        return;
    }
    console.log("Getting weather for date "+ search_params.date);
    request.get('http://api.weatherapi.com/v1/forecast.json' + "?key=" + api_key + "&q=" + search_params.location + "&dt=" + search_params.date
    ,function(err,res,body){
        resolve(JSON.parse(body));
    });

    
    
    
};


module.exports = weather_service; 