const request = require('request-promise-native');


// Returns: Promise of request for ip data, returned as JSON string

const fetchMyIP = () => {
  return request('https://api.ipify.org?format=json');
};

const fetchCoordsByIP = (ipResponse) => {
  const ip = JSON.parse(ipResponse).ip;
  return request(`http://ipwho.is/${ip}`);
};

const fetchISSFlyOverTimes = (coordsBody) => {
  const JSONObj = JSON.parse(coordsBody);
  const latitude = JSONObj.latitude;
  const longitude = JSONObj.longitude;
  return request(`https://iss-flyover.herokuapp.com/json/?lat=${latitude}&lon=${longitude}`);
};

const nextISSTimesForMyLocation = () => {
  return fetchMyIP()
    .then(ipResponse => fetchCoordsByIP(ipResponse))
    .then(coordsBody => fetchISSFlyOverTimes(coordsBody))
    .then(flyOverData => {
      const response = JSON.parse(flyOverData).response;
      return response;
    });
};

/* Compass solution:
const nextISSTimesForMyLocation = function() {
  return fetchMyIP()
    .then(fetchCoordsByIP)
    .then(fetchISSFlyOverTimes)
    .then((data) => {
      const { response } = JSON.parse(data);
      return response;
    });
};

module.exports = { nextISSTimesForMyLocation };
*/


module.exports = { nextISSTimesForMyLocation };


