var assert = require('assert');
var weather_service = require('../weather-service.js');

describe('Validates weather data requests', function() {
    describe('#validates_weather_dates()', function() {
      it('should pass valid dates within 10 days', function() {
        
        assert.equal(true,weather_service.date_validates("2020-03-18 00:00:00","2020-03-15 00:00:00"));
      });
      it('should not pass dates outside 10 days', function() {
        
        assert.equal(false,weather_service.date_validates("2020-03-29 00:00:00","2020-03-15 00:00:00"));
      });
      it('should pass dates in the past', function() {
        assert.equal(true,weather_service.date_validates("2020-01-29 00:00:00","2020-03-15 00:00:00"));
      });
    });
  });

