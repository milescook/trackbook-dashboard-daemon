var trackbook_dashboard_service = require('./trackbook-dashboard-service.js');
var next_meeting_updater = require('./dashboard-widgets/next-meeting-updater.js');

var nconf = require('nconf')

nconf.env().file({ file: 'config.json' })

var updates_dashboard_every_seconds = nconf.get('TBD_UPDATES_DASHBOARDS_EVERY_SECONDS');


main_loop();

setInterval(function(){
   main_loop();
}, updates_dashboard_every_seconds * 1000);


function main_loop()
{
    console.log("Updating dashboards");
    trackbook_dashboard_service.get_by_widget('next-meeting',next_meeting_updater.process);
}