var geoid = (function() {

  var watchId = null;
  var hasPosition = false;
  var currentPosition = null;

  function getPosition() {

    // Settings
    var minAccuracy = 100; // Measured in meters
    var enableHighAccuracy = true;
    var timeout = 30000; // 5 minutes
    var maximumAge = 0; // Whether or not a cached position can be used

    // Immediately get an inaccurate current position as a fallback in case
    // our other attempts fail
    navigator.geolocation.getCurrentPosition(

      // On Success
      function(position) {

        // Don't override an accurate position (if it somehow came in first)
        if(!geoid.hasPosition)
          {
            hasPosition = true;
            currentPosition = position;
          }

        },

        // On Error
        function(error) {

          // Swallow errors occurring from this initial call

        },

        // Settings (for a quick, inaccurate call)
        {
          enableHighAccuracy: false,
          maximumAge: Math.Infinity
        }

      );

      // Set up the promise for the more accurate geolocation call using
      // repeated watchPosition calls
      return new Promise(function(resolve, reject) {

        watchId = navigator.geolocation.watchPosition(

          // On Success
          function(position) {

            if(position.coords.accuracy <= minAccuracy) {

              // As soon as we have achieved the desired accuracy, clear the watch
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

  function hasPosition() {
    return hasPosition;
  }

  function getLastPosition() {
    return currPosition;
  }

  return {
    getPosition: getPosition,
    hasPosition: hasPosition,
    getLastPosition: getLastPosition
  };

})();
