//It will contain most of the logic for fetching the data from each API endpoint.
const request = require('request');



/**
 * Makes a single API request to retrieve the user's IP address.
 * Input:
 *   - A callback (to pass back an error or the IP string)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The IP address as a string (null if error). Example: "162.245.144.188"
 */
const fetchMyIP = (callback) => {
  request('https://api.ipify.org?format=json', (error, response, body) => {

    if (error) {
      callback(error, null);
      return;
    }

    if (response.statusCode !== 200) { // in case  no error is sent by the request function, but there's still a problem in the response.
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    const ip = JSON.parse(body).ip; // This will conver original JSON from string to object then return value for the kay ip.
    callback(null, ip);
  });
};

const fetchCoordsByIP = (ip, callback) => {
  request(`http://ipwho.is/${ip}`, (error, response, body) => {

    if (error) {
      callback(error, null);
      return;
    }
    const JSONObj = JSON.parse(body);
    if (body.includes(`"success":false`)) { // in case  no error is sent by the request function, but there's still a problem in the response.
      callback(JSONObj, null);
      return;
    }
    //console.log(JSONObj);
    const latitude = JSONObj.latitude;
    const longitude = JSONObj.longitude;

    callback(null, { latitude, longitude });
  });
};


const fetchISSFlyOverTimes = (coords, callback) => {
  request(`https://iss-flyover.herokuapp.com/json/?lat=${coords.latitude}&lon=${coords.longitude}`, (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }
    if (response.statusCode !== 200) { // in case  no error is sent by the request function, but there's still a problem in the response.
      const msg = `Status Code ${response.statusCode} when fetching ISS pass times. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }

    const bodyObjResponse = JSON.parse(body).response;

    //This function should pass back the array of objects inside the response property.
    callback(null, bodyObjResponse);
  });

};

/**
 * Orchestrates multiple API requests in order to determine the next 5 upcoming ISS fly overs for the user's current location.
 * Input:
 *   - A callback with an error or results.
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly-over times as an array (null if error):
 *     [ { risetime: <number>, duration: <number> }, ... ]
 */
const nextISSTimesForMyLocation = (callback) => {
  fetchMyIP((error, ip) => { //fetchMyIP only takes one argument, the callack function and returns (error, ip)
    if (error) {
      return callback(error, null);
    }
    fetchCoordsByIP(ip, (error, coords) => { //fetchCoordsByIP takes in two arguments, and returns (error, coords)
      if (error) {
        return callback(error, null);
      }
      fetchISSFlyOverTimes(coords, (error, bodyObjResponse) => { //fetchISSFlyOverTimes takes in two arguments, and returns (error, bodyObjResponse)
        if (error) {
          return callback(error, null);
        }
        callback(error, bodyObjResponse);
      });
    });
  });
};

module.exports = {
  nextISSTimesForMyLocation
};