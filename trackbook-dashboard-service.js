var request = require('requestretry');
var http = require('http');
var https = require('https');
var querystring = require('querystring');
var nconf = require('nconf')

nconf.env().file({ file: 'trackbook-config.json' })

var trackbook_port = nconf.get('TBD_TRACKBOOK_PORT');
var trackbook_host = nconf.get('TBD_TRACKBOOK_HOST');
var trackbook_api_auth = nconf.get('TBD_TRACKBOOK_AUTH');

trackbook_dashboard_service = {};
var trackbook_headers = 
{
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': trackbook_api_auth
};

trackbook_dashboard_service.get_by_widget = function (widget,callback)
{
    path = "/dashboardWidgets/byWidgetType/next-meeting";
    console.log("Fetching widgets from: "+trackbook_host+path+" on port "+trackbook_port);
    
    var request_options = {
        host: trackbook_host,
        port: trackbook_port,
        path: path,
		maxAttempts: 3,
		retryDelay: 1000,
        headers: trackbook_headers
    };
        
   if(trackbook_port==443)
    request_handler = https;
    else
    request_handler = http;
	
	var req = request_handler.request(request_options, function(res) 
	{
		res.setEncoding('utf-8');
			
		var responseString = '';
		res.on('data', function(data) 
		{
            responseString += data;
            console.log(data);
		});
			
		res.on("error", function(err){
			console.log("Problem reaching API to get conversation: ", err);
		})

		res.on('end', function() 
		{
            console.log("Trackbook API Returned:");
            return_object = JSON.parse(responseString);
            
            console.log(return_object);
            callback(return_object);
		});
	}).on("error", (err) => {
        console.log("Error: " + err.message);
      });

	req.end();

}
trackbook_dashboard_service.update_widget = function(widget)
{
    path = "/dashboardWidgets/edit/"+widget.id;
    
        var postBodyString = querystring.stringify(widget);
        
        var options = {
          host: trackbook_host,
          port: trackbook_port,
          path: path,
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                'Content-Length': postBodyString.length,
                'Accept': 'application/json',
                'Authorization': trackbook_api_auth
            }
        };
        if(trackbook_port==443)
        request_handler = https;
        else
        request_handler = http;

        var req = request_handler.request(options, function(res) {
                res.setEncoding('utf-8');
        
                var responseString = '';
        
            res.on('data', function(data) {
              responseString += data;
                });
                
            
            res.on('end', function() {
                console.log("Recieved Trackbook API Response with code:"+res.statusCode);
               
            
            });
            
        });
    
        req.on('error', (e) => {
            console.error(e);
        });	
        
        req.write(postBodyString);
    
        req.end();
}

module.exports = trackbook_dashboard_service