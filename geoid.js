var geoid = {};

geoid.getPosition = function() {

  var watchId;
  var minAccuracy = 40; // Measured in meters
  var enableHighAccuracy = true;
  var timeout = 30000; // 5 minutes

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
        timeout: timeout
      }

    );

  });
}
