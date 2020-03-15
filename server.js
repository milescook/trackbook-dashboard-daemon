var trackbook_dashboard_service = require('./trackbook-dashboard-service.js');
var next_meeting_updater = require('./dashboard-widgets/next-meeting-updater.js');


next_meeting_widgets = trackbook_dashboard_service.get_by_widget('next-meeting',next_meeting_updater.process);


