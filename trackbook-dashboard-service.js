var request = require('requestretry');
var http = require('http');
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
    var request_options = {
        host: trackbook_host,
        port: trackbook_port,
        path: path,
		maxAttempts: 1,
		retryDelay: 5000,
        headers: trackbook_headers
    };
        
   
	
	var req = http.request(request_options, function(res) 
	{
		res.setEncoding('utf-8');
			
		var responseString = '';
		res.on('data', function(data) 
		{
			responseString += data;
		});
			
		res.on("error", function(err){
			console.log("Problem reaching API to get conversation: ", err);
		})

		res.on('end', function() 
		{
            return_object = JSON.parse(responseString);
            console.log("Trackbook API Returned:");
            console.log(return_object);
            callback(return_object);
		});
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
        
        var req = http.request(options, function(res) {
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