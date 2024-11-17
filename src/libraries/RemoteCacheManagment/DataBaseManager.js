const DataBaseManager = (RemoteKeyCache,RemoteDataBaseName) => {
    let keyCache=RemoteKeyCache
    let dataBaseName=RemoteDataBaseName
    let list
    const getDataBase = new Promise ((resolve,reject) => {
        try{
            fetch("http://ws.cipiaceinfo.it/cache/get", {
                method: "POST",
                headers: {
                    "content-type": "application/json",
                    "key": keyCache
                },
                body: JSON.stringify({
                    key: dataBaseName
                })
            }).then(response => response.json()).then(
                response=>resolve(list=JSON.parse(response.result))
            )
        } catch (exception) {
            reject(exception)
        }
    })
    const setDataBase = (object) => {
        fetch("http://ws.cipiaceinfo.it/cache/set", { 
            method: "POST",
            headers: {
                "content-type": "application/json",
                "key": keyCache
            },
            body: JSON.stringify({
                key : dataBaseName,
                value : JSON.stringify(object)
            })
        }).then(response => response.json()).then(response => {console.log(response.result)})
    }
    return {
        downloadData : getDataBase,
        resetData : () => {
            setDataBase([])
        },
        getData : () => {
            return list
        },
        addToData : (object) => {
            getDataBase.then(
                ()=>{
                    list.push(object)
                    setDataBase(list)
                }
            )
        }
    }
}

export { DataBaseManager }

/*
fetch("http://ws.cipiaceinfo.it/cache/get", { 
    method: "POST",
    headers: {
        "content-type": "application/json",
        "key": keyCache
    },
    body: JSON.stringify({
        key: dataBaseName
    })
}).then(r => r.json()).then(r=>dictionary=JSON.parse(r.result))

fetch("http://ws.cipiaceinfo.it/cache/set", { 
    method: "POST",
    headers: {
        "content-type": "application/json",
        "key": keyCache
    },
    body: JSON.stringify({
        key : dataBaseName,
        value : JSON.stringify(dictionary)
    })
}).then(r => r.json()).then(r => {console.log(r.result)})
*/