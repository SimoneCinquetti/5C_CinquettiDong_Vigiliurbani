import { GeolocationManager } from "./libraries/MapManagment/GeolocationManager.js";
import { createTable } from "./libraries/components/table.js";
import { DataBaseManager } from "./libraries/RemoteCacheManagment/DataBaseManager.js";
import { MapManager } from "./libraries/MapManagment/MapManager.js";
import { createModalForm } from "./libraries/components/modalForm.js"

fetch("./config.json").then(r => r.json()).then((configuration) => {
    const locations = GeolocationManager(configuration.keyCacheGeo);
    const dataManager = DataBaseManager(configuration.keyCacheDataBase, "incidenti");
    const mapManager = MapManager("map");
    locations.addLocation("Via Rovereto 14", "un bel posto").then(() => {
        console.log(locations.getLocations())
        mapManager.addMarkers(locations.getLocations())
        mapManager.renderMap()
    });

    let tableConfig = [
        ["Indirizzo", "Targhe", "Data e ora", "Numero feriti", "Numero morti"],
    ];

    const table = createTable(document.getElementById("tabella"));
    const filterText = document.getElementById("filterText");
    const filterButton = document.getElementById("filter");

    dataManager.downloadData.then(() => {
        const datas = dataManager.getData();

        for (let key in datas) {
            tableConfig.push([
                key, 
                datas[key]["targhe"].join(" "),
                datas[key]["data_e_ora"].split("|").join(" "),
                datas[key]["n_feriti"],
                datas[key]["n_morti"],
            ]);
        }
        table.build(tableConfig); 
        table.render();
    });
    
    filterButton.onclick = () => {
        table.filter(filterText.value.toLowerCase());
        table.render();
    }


    // Registrazione dell'incidente
    let registration = createModalForm(document.getElementById("modal-bd"));

    registration.setLabels({
        "indirizzo": [
            "text",
            null,
        ],
        "targhe (separate da virgole)": [
            "text",
            null
        ],
        "data": [
            "date",
            null
        ],
        "orario": [
            "time",
            null
        ],
        "morti totali": [
            "number",
            null
        ],
        "feriti totali": [
            "number",
            null
        ]
    });

    registration.onsubmit((labels) => {
        if (labels.every(e => e != "") && !isNaN(labels[4]) && !isNaN(labels[5])) {
            dataManager.addToData(labels[0], {
                "targhe": labels[1].split(","),
                "data_e_ora": labels[2] + "|" + labels[3],
                "n_feriti": labels[4],
                "n_morti": labels[5],
            });
            dataManager.downloadData.then(() => {
                const datas = dataManager.getData();
        
                for (let key in datas) {
                    tableConfig.push([
                        key, 
                        datas[key]["targhe"].join(" "),
                        datas[key]["data_e_ora"].split("|").join(" "),
                        datas[key]["n_feriti"],
                        datas[key]["n_morti"],
                    ]);
                }
                table.build(tableConfig); 
                table.render();
            });
        } else {
            document.getElementById("prompt").innerHTML = "Dati inseriti non validi!";
        }
    });

    registration.render();

})
