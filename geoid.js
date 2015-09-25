var geoid = (function() {

  var watchId = null;
  var hasPosition = false;
  var currentPosition = null;

  // Default Settings

  // Desired Accuracy: The desired level of accuracy (measured in meters)
  // Default: 100 meters (328 feet)
  var minAccuracy = 100; // Default: 100 meters (328 feet)

  // Enable High Accuracy: Whether or not an accurate, but possibly
  // expensive, geolocation result should be returned
  // Default: true
  var enableHighAccuracy = true;

  // Timeout: How long to wait for a result before giving up
  // Default: 3 seconds
  var timeout = 3000;

  // Maximum Age: How old (in milliseconds) of a cached position to accept
  // Default: 0 (don't accept a cached position)
  var maximumAge = 0;

  // Time Measure Interval: How often the timer (used in measuring the
  // timeout is updated)
  // Default: 10 milliseconds
  var timeMeasureInterval = 10;

  function getPosition(settings) {

    if(settings)
    {
      if(settings.hasOwnProperty('accuracy'))
      {
        minAccuracy = settings.accuracy;
      }

      if(settings.hasOwnProperty('timeout'))
      {
        timeout = settings.timeout;
      }
    }

    // Immediately get an inaccurate current position as a fallback in case
    // our other attempts fail
    getQuickPosition().then(function() {

      // Don't override an accurate position (if it somehow came in first)
      if(!geoid.hasPosition)
      {
        hasPosition = true;
        currentPosition = position;
      }

    }).catch(function() {

      // Swallow the exception for this quick call

    });

    // Set up the promise for the more accurate geolocation call using
    // repeated watchPosition calls
    return new Promise(function(resolve, reject) {

      // Start the timeout timer
      startTimer(function() {

        // On timeout

        if(currentPosition === null) {

          // We weren't able to get *any* position, so we return an
          // error state
          reject('Unable to retrieve position');

        }
        else {

          // Return the best geolocation data we were able to get
          navigator.geolocation.clearWatch(watchId);
          resolve(currentPosition);

        }

      });

      // Set up the watchPosition calls
      watchId = navigator.geolocation.watchPosition(

        // On Success
        function(position) {

          hasPosition = true;
          currentPosition = position;

          if(position.coords.accuracy <= minAccuracy) {

            // As soon as we have achieved the desired accuracy,
            // clear the watch
            navigator.geolocation.clearWatch(watchId);
            resolve(position);

          }

        },

        // On Error
        function(error) {
          reject(error)
        },

        // Settings
        {
          enableHighAccuracy: enableHighAccuracy,
          maximumAge: maximumAge
        }

      );
    });
  }

  // Returns a quick, but inaccurate, geolocation result
  function getQuickPosition() {

    return new Promise(function(resolve, reject) {

      navigator.geolocation.getCurrentPosition(

        // On Success
        function(position) {
          resolve(position);
        },

        // On Error
        function(error) {
          reject(error);
        },

        // Settings (for a quick, inaccurate call)
        {
          enableHighAccuracy: false,
          maximumAge: Math.Infinity
        }

      );

    });

  }

  // A simple timer that calls the provided callback function upon
  // exceeding the timeout
  function startTimer(callback) {

    var time = 0;
    var intervalId = 0;

    function tick() {

      time += timeMeasureInterval;

      // We've exceeded our timeout
      if(time > timeout) {
        callback();
        clearInterval(intervalId);
      }

    }

    intervalId = setInterval(tick, timeMeasureInterval);

  }

  return {
    getPosition: getPosition,
    hasPosition: function() { return hasPosition; },
    getLastPosition: function() { return currentPosition; },
    getQuickPosition: getQuickPosition
  };

})();
