import { GeolocationManager } from "./libraries/MapManagment/GeolocationManager.js";
import { createTable } from "./libraries/components/table.js";
import { DataBaseManager } from "./libraries/RemoteCacheManagment/DataBaseManager.js";
import { MapManager} from "./libraries/MapManagment/MapManager.js";

fetch("./config.json").then(r => r.json()).then((configuration) => {
    const locations= GeolocationManager(configuration.keyCacheGeo)
    const dataManager = DataBaseManager(configuration.keyCacheDataBase,"incidenti")
    const mapManager = MapManager("map")
    locations.addLocation("Via Rovereto 14","un bel posto").then(()=>{
        console.log(locations.getLocations())
        mapManager.addMarkers(locations.getLocations())
        mapManager.renderMap()
    })
    
    
})

// Creazione della table

let tableConfig = [
    ["Indirizzo", "Targhe", "Data e ora", "Numero feriti", "Numero morti"],
    ["Pompelo", "Moto", "12:35", "1", "2"],
    ["Ciao", "Moto", "12:35", "1", "2"],
    ["Redio", "Macchina", "12:35", "1", "2"],
];

const table = createTable(document.getElementById("tabella"));
const filterText = document.getElementById("filterText");
const filterButton = document.getElementById("filter");

table.build(tableConfig);

table.render();

filterButton.onclick = () => {
    table.filter(filterText.value);
    table.render();
}
