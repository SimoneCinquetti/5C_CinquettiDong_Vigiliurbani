const MapManager = (parentElementDiv) => {
    let markers=[]
    let parentElement=parentElementDiv
    let zoom = 12;
    let maxZoom = 19;
    let map
    return {
        initializeMap : () => {
            map= L.map(parentElement).setView(["45.4950448","9.2196078"], zoom);
            L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: maxZoom,
                attribution: '© <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            }).addTo(map);
        },
        renderMap : () => {
            if (markers.length > 0){
                L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    maxZoom: maxZoom,
                    attribution: '© <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                }).addTo(map);
                markers.forEach((place) => {
                    const marker = L.marker(place.coords).addTo(map);
                    marker.bindPopup(`<b>${place.description}</b>`);
                });
            } else {
                L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    maxZoom: maxZoom,
                    attribution: '© <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                }).addTo(map);
            }
        },
        addMarkers : (list) => {
            markers=list
        }
    }
}

export {MapManager}
