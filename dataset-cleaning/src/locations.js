const neatCsv = require("neat-csv");
const _ = require("lodash");
const fs = require("fs");

const sourceFile = "../source/austin_metrobike_kiosk_locations.csv";
const resultFileJSON = "../result/austin_metrobike_kiosk_locations.json";

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
  const locationsCsv = fs.readFileSync(sourceFile);

  const allLocations = await readTrips(locationsCsv);

  const allLocationsCamelCase = allLocations.map((location) =>
    camelCaseObjectKeys(location)
  );

  const allLocationsWithRequiredData = allLocationsCamelCase.filter(
    (location) => _.has(location, "kioskId") && _.has(location, "location")
  );

  const allLocationsWithLatAndLong = allLocationsWithRequiredData.map(
    (location) => {
      const _location = location.location.replace(/\(|\)/g, "").split(", ");
      const lat = _location[0];
      const long = _location[1];
      return { ...location, lat, long };
    }
  );

  saveToJSON(allLocationsWithLatAndLong);
};

module.exports = { main };
