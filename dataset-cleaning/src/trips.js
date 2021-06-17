const neatCsv = require("neat-csv");
const _ = require("lodash");
const fs = require("fs");

const sourceFile = "../source/austin_metrobike_trips.csv";
const aboveDate = new Date("01/01/2018");
const resultFileJSON = "../result/austin_metrobike_trips.json";

const readTrips = async (csv) => {
  return await neatCsv(csv);
};

const camelCaseObjectKeys = (obj) => {
  return _.mapKeys(obj, (v, k) => _.camelCase(k));
};

const saveToJSON = (obj) => {
  const data = JSON.stringify(obj);
  fs.writeFileSync(resultFileJSON, data);
};

const main = async () => {
  const tripsCsv = fs.readFileSync(sourceFile);

  const allTrips = await readTrips(tripsCsv);

  const allTripsCamelCase = allTrips.map((trip) => camelCaseObjectKeys(trip));

  const allTripsWithRequiredData = allTripsCamelCase.filter(
    (trip) => _.has(trip, "checkoutDate") && _.has(trip, "tripDurationMinutes")
  );

  const allTripsCleanTypes = allTripsWithRequiredData.map((trip) => ({
    ...trip,
    checkoutDate: new Date(trip.checkoutDate),
    tripDurationMinutes: parseInt(trip.tripDurationMinutes),
  }));

  const tripsStartingOn2018 = allTripsCleanTypes.filter(
    (trip) => trip.checkoutDate.getTime() >= aboveDate.getTime()
  );

  const tripsThatHaveTripDurationGreaterThanZero = tripsStartingOn2018.filter(
    (trip) => trip.tripDurationMinutes > 0
  );

  const tripsDropMonthAndYear = tripsThatHaveTripDurationGreaterThanZero.map(
    (trip) => {
      trip = _.omit(trip, "month");
      trip = _.omit(trip, "year");
      return trip;
    }
  );

  saveToJSON(tripsDropMonthAndYear);
};

module.exports = { main };
