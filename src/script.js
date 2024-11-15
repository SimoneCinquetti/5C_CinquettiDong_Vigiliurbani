import { GeolocationManager } from "./libraries/MapManagment/GeolocationManager.js";
import { createTable } from "./libraries/components/table.js";
fetch("./config.json").then(r => r.json()).then((configuration) => {
    const locations= GeolocationManager(configuration.keyCache)
    locations.addLocation("Via Rovereto 14 milano").then(console.log(locations.getLocations()))
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
