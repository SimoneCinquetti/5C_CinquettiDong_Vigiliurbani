const createTable = (parentElement) => {
    let data;
    let immutableData;
    return {
        build: (dataInput) => {
            data = dataInput;
            immutableData = dataInput;
        },
        render: () => {
            let htmlTable = '<table class="table border border-dark table-sm column">';
            htmlTable += data.map((row) =>
                "<tr>" + row.map((col) =>
                    "<td class='border border-dark'>" + col + "</td>"
                ).join("")
            ).join("") + "</tr>";
            htmlTable += "</table>";
            parentElement.innerHTML = htmlTable;
        },
        filter: (address) => {
            if (address == "") {
                data = immutableData;
                return;
            }

            data = immutableData.filter(sublist => sublist[0].includes(address));
            data.unshift(immutableData[0]);
        }, 
    }
}

export { createTable }