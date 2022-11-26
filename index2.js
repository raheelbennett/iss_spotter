const { nextISSTimesForMyLocation } = require('./iss_promised');


const printPassTimes = function(passTimes) {
  for (const pass of passTimes) {
    const datetime = new Date(0);
    datetime.setUTCSeconds(pass.risetime);
    const duration = pass.duration;
    console.log(`Next pass at ${datetime} for ${duration} seconds!`);
  }
};

nextISSTimesForMyLocation()
  .then(printPassTimes) // following compass syntax, appears that if the return value of .then is going to be the argument for calback function we don't need to state it (arrow function shortcut).
  .catch((error) => {
    console.log("It didn't work: ", error.message);
  });