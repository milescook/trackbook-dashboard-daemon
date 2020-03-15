weather_service = {};
var http = require('http');
var nconf = require('nconf')

nconf.env().file({ file: 'weatherapi-config.json' })

var api_key = nconf.get('TBD_WEATHER_API_KEY');

weather_service.date_validates = function(date,date_now)
{
    
    
    if(undefined==date_now)
        date_now = Date.now();

    
    date_check_unix = Date.parse(date) / 1000;
    date_now_unix = Date.parse(date_now) / 1000;
    max_diff = 60 * 60 * 24 * 10;

    return date_check_unix < date_now_unix || ( date_check_unix - date_now_unix < max_diff);
}
// WeatherAPI.com
weather_service.get_by_search = function(search_params,next_meeting,callback){
    if(!weather_service.date_validates(search_params.date))
        return;

    host = "api.weatherapi.com";
    path = "/v1/forecast.json";
    params = "?key=" + api_key + "&q=" + search_params.location + "&dt=" + search_params.date;

    var request_options = {
        host: host,
        port: 80,
        path: path + params,
		maxAttempts: 1,
		retryDelay: 5000,
		headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
		}};
        
   
    console.log(params);
    
	var req = http.request(request_options, function(res) 
	{
		res.setEncoding('utf-8');
			
		var responseString = '';
		res.on('data', function(data) 
		{
			responseString += data;
		});
			
		res.on("error", function(err){
			console.log("Problem reaching Weather API: ", err);
		})

		res.on('end', function() 
		{
            return_object = JSON.parse(responseString);
            callback(return_object,next_meeting);
		});
	});

	req.end();
};


module.exports = weather_service; 