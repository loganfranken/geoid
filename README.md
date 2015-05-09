# geoid

**geoid** provides a simplified interface to the [HTML5 geolocation API](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation/Using_geolocation).

## Getting Started

Here's a **basic example**:

```javascript
geoid.getPosition().then(function(position) {

    // Position retrieved successfully
    var lat = position.coords.latitude;
    var lon = position.coords.longitude;

}).catch(function(err) {

  // An error occurred while retrieving the position

});
```

## Why Use This?

The standard HTML5 geolocation library is actually pretty simple to use:

```javascript
navigator.geolocation.getCurrentPosition(

  // On success
  function(position) {
  },

  // On error
  function(error) {
  }

);
```

However, geoid provides a couple of **benefits** over the native API:

* Returns a promise for simpler chaining
* Polls ``watchPosition`` to return more accurate data

## Settings

Settings can be passed into the ``getPosition`` function:

```javascript
geoid.getPosition({

  accuracy: 10,
  timeout: 10000

})
```

### accuracy (Number)

**Default:** 10 meters (30 feet)

The desired level of accuracy (measured in meters).

For example, if you want geoid to keep polling the user's position until
it finds geolocation information within 5 meters (~16 feet) of the user's
current location, you would set this value to ``5``.

### timeout (Number)

**Default:** 3,000 milliseconds (3 seconds)

The maximum amount of time geoid should spend trying to retrieve the user's
location within the desired accuracy level.

For example, if you want geoid to keep trying to get more accurate
geolocation data for a maximum of 30 seconds, you would set this value to
``30000``.

## Fallbacks

Geoid provides a number of fallbacks if, for whatever reason, the desired
geolocation information can't be returned.

### Timeout Exceeded

If the timeout is exceeded and geolocation data at the desired accuracy
could not be retrieved, geoid will return the latest geoid data that was
retrieved.

### Early Exit

If, after calling ``getPosition``, you decide you do not want to wait for the
result, you can always access the latest geolocation data retrieved from
geoid via the following public methods:

```javascript
if(geoid.hasPosition()) {
  var position = geoid.getLastPosition();
}
```

### Other Exceptions

If geoid encounters a fatal exception while trying to access geolocation
information (e.g. the user did not allow geolocation), the promise will be
rejected and the ``catch`` method can be used to handle this situation:


```javascript
geoid.getPosition().then(function(position) { }).catch(function(err) {

  // An error occurred while retrieving the position

});
```
