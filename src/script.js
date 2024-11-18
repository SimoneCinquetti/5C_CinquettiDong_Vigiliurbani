import { GeolocationManager } from "./libraries/MapManagment/GeolocationManager.js";
import { createTable } from "./libraries/components/table.js";
import { DataBaseManager } from "./libraries/RemoteCacheManagment/DataBaseManager.js";
import { MapManager } from "./libraries/MapManagment/MapManager.js";
import { createModalForm } from "./libraries/components/modalForm.js"

fetch("./config.json").then(r => r.json()).then((configuration) => {
    const locations = GeolocationManager(configuration.keyCacheGeo);
    const dataManager = DataBaseManager(configuration.keyCacheDataBase, "incidenti");
    const mapManager = MapManager("map");
    mapManager.initializeMap()

    let time = 500;

    dataManager.downloadData.then(()=>{ /* Cliccando sul marcatore vengono mostrati il numero di morti e feriti e la data dell’incidente. */
        let places= dataManager.getData()
        for (const key in places){
            let description=`
                Località: ${key},
                Targhe: ${places[key].targhe.join(" ")},
                Data e ora: ${places[key].data_e_ora.split("|").join(" ")},
                n_feriti: ${places[key].n_feriti},
                n_morti: ${places[key].n_morti}
            `;

            setTimeout(() => {
                locations.addLocation(key,description).then(() => {
                    mapManager.addMarkers(locations.getLocations())
                    mapManager.renderMap()
                });
            }, time);
            time += 500;
        }
    })
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
        if (labels.every(e => e != "") && !isNaN(labels[4]) && !isNaN(labels[5]) && parseInt(labels[4]) >= 0 && parseInt(labels[5]) >= 0) {
            dataManager.addToData(labels[0], {
                "targhe": labels[1].split(","),
                "data_e_ora": labels[2] + "|" + labels[3],
                "n_feriti": labels[4],
                "n_morti": labels[5],
            });
            let description=`
                Località: ${labels[0]},
                Targhe: ${labels[1].split(",").join(" ")},
                Data e ora: ${labels[2]} ${labels[3]},
                n_feriti: ${labels[4]},
                n_morti: ${labels[5]}
            `;
            locations.addLocation(labels[0],description).then(() => {
                mapManager.addMarkers(locations.getLocations())
                mapManager.renderMap()
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
