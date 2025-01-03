const GeolocationManager = (key) => {
    let data=[]
    let keyCache=key
    return {
        addLocation : (location,locationDescription) => {
            return new Promise ((resolve,reject) => {
                try{
                    let locationFinale=location.replaceAll(" ","%20")
                    let url= "https://eu1.locationiq.com/v1/search?q=#LOCATION#&format=json&key=#KEYCACHE#"
                    url=url.replace("#KEYCACHE#",keyCache);
                    url=url.replace("#LOCATION#",locationFinale);
                    fetch(url,{method: 'GET', headers: {accept: 'application/json'}})
                    .then(response => response.json())
                    .then(response => resolve(
                        data.push(
                            {
                                name : location,
                                coords : [response[0].lat,response[0].lon],
                                description : locationDescription
                            }
                        )    
                    ))
                } catch (exception) {
                    reject(exception)
                }
            })
        },  
        getLocations : () => {
            return data
        }
    }
}

export {GeolocationManager}