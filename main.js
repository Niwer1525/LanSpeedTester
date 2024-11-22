let packetCount = 5;
let packetSizeInMB = 10;
let varyPacketSize = false;

let hasFinished = false;

function test() {
    /* Get the values from the form */
    packetCount = document.getElementById("packetCount").value;
    packetSizeInMB = document.getElementById("packetSize").value;
    varyPacketSize = document.getElementById("varyPacketSize").checked;
    console.log("Will test with:", packetCount, packetSizeInMB, varyPacketSize);

    /* Clear the table body */
    clearTableBody("download");
    clearTableBody("upload");

    /* Test LAN speed */
    createWorker("download");
    createWorker("upload");
}

function createWorker(type) {
    let worker = new Worker("speedtester.js");

    /* Post the initial data */
    worker.postMessage({
        type: type,
        packetSizeInMB: packetSizeInMB,
        varyPacketSize: varyPacketSize,
        packetCount: packetCount
    });

    /* Handle messages from the worker */
    worker.onmessage = (e) => {
        let mode = e.data.mode;
        if (mode == "addRow") {
            let size = e.data.size;
            let count = e.data.count;
            let time = e.data.time;
            let speed = e.data.speed;

            console.log("Adding row to table:", size, count, time, speed);
            appendResultTableBody(type, size, count, time, speed);
        } else if (mode == "displayAverage")
            document.getElementById("average_"+type).innerHTML = e.data.totalSpeed;
    }

    return worker;
}

function clearTableBody(type) {
    let table = document.getElementById("results_"+type);
    let tableBody = table.getElementsByTagName("tbody")[0];
    while (tableBody.rows.length > 0) tableBody.deleteRow(0);
}

function appendResultTableBody(type, size, count, time, speed) {
    let table = document.getElementById("results_"+type);
    let tableBody = table.getElementsByTagName("tbody")[0];
    let row = tableBody.insertRow(-1);

    /* Create rows and set values */
    row.insertCell(0).innerHTML = size;
    row.insertCell(1).innerHTML = count;
    row.insertCell(2).innerHTML = time;
    row.insertCell(3).innerHTML = speed;
}