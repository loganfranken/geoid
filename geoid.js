var geoid = (function() {

  var watchId = null;
  var hasPosition = false;
  var currentPosition = null;

  function getPosition() {

    // Default Settings

    // Minimimum Accuracy: The minimum level of accuracy (measured in meters)
    // to accept
    // Default: 10 meters (30 feet)
    var minAccuracy = 10; // Default: 10 meters (30 feet)

    // Enable High Accuracy: Whether or not an accurate, but possibly
    // expensive, geolocation result should be returned
    // Default: true
    var enableHighAccuracy = true;

    // Timeout: How long to wait for a result before giving up
    // Default: 30 seconds
    var timeout = 30000;

    // Maximum Age: How old (in milliseconds) of a cached position to accept
    // Default: 0 (don't accept a cached position)
    var maximumAge = 0;

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

        // Start measuring elapsed time
        var time = 0;
        var timeMeasureInterval = 10;

        function updateTime()
        {

          time += timeMeasureInterval;

          // We've exceeded our timeout
          if(time > timeout) {

            if(currentPosition === null) {

              // We weren't able to get *any* position, so we return an
              // error state
              reject('Unable to retrieve position');

            }
            else {

              // Return the best geolocation data we were able to get
              clearInterval(intervalId);
              navigator.geolocation.clearWatch(watchId);
              resolve(currentPosition);

            }

          }

        }

        var intervalId = setInterval(updateTime, timeMeasureInterval);

        watchId = navigator.geolocation.watchPosition(

          // On Success
          function(position) {

            hasPosition = true;
            currentPosition = position;

            if(position.coords.accuracy <= minAccuracy) {

              // As soon as we have achieved the desired accuracy,
              // clear the watch
              clearInterval(intervalId);
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
            timeout: timeout,
            maximumAge: maximumAge
          }

        );
    });
  }

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

  return {
    getPosition: getPosition,
    hasPosition: function() { return hasPosition; },
    getLastPosition: function() { return currentPosition; }
  };

})();
