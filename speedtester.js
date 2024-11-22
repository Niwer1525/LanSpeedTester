onmessage = (e) => {
    type = e.data.type;
    packetSizeInMB = e.data.packetSizeInMB;
    varyPacketSize = e.data.varyPacketSize;
    packetCount = e.data.packetCount;
    test();
}

function test() {
    let totalSpeed = 0;
    for(let i = 1; i <= packetCount; i++) {
        let size = packetSizeInMB * (varyPacketSize ? i : 1); // Packet size
        let startTime = performance.now();
        
        /* Simulate speed */
        let data = new Array(size * 1024 * 1024).fill(0);
        let endTime = performance.now();

        let time = (endTime - startTime) / 1000;
        let speed = size / time; // Speed in MB/s
        totalSpeed += speed;

        /* Add the result to the table */
        postMessage({
            mode: "addRow",
            size: size,
            count: i,
            time: time,
            speed: speed
        });
    }

    /* Display average speed */
    postMessage({
        mode: "displayAverage",
        totalSpeed: (totalSpeed / packetCount).toFixed(2)
    });
}