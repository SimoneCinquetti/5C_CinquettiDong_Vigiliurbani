import { GeolocationManager } from "./libraries/MapManagment/GeolocationManager.js";
fetch("./config.json").then(r => r.json()).then((configuration) => {
    const locations= GeolocationManager(configuration.keyCache)
    locations.addLocation("Via Rovereto 14 milano").then(console.log(locations.getLocations()))
})