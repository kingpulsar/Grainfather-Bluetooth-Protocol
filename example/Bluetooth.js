var noble = require('noble');
const EventEmitter = require('events');

const GF_SERVICE_UUID = "0000cdd000001000800000805f9b34fb";
const GF_READ_CHARACTERISTIC_UUID = "0003cdd100001000800000805f9b0131";
const GF_WRITE_CHARACTERISTIC_UUID = "0003cdd200001000800000805f9b0131";

module.exports = class Bluetooth extends EventEmitter {

    constructor() {
        super();

        this.readCharacteristic;
        this.writeCharacteristic;
        this.peripheral;

        noble.on('stateChange', this.onStateChange.bind(this));
        noble.on('discover', this.onDiscoverDevice.bind(this));
    }

    onStateChange(state) {
        if (state == "poweredOn") {
            this.scanForDevice();
        }
    }

    disconnect() {
        if(this.peripheral)
            this.peripheral.disconnect();
    }

    scanForDevice() {
        console.log("Started scanning for the grainfather");
        noble.startScanning([GF_SERVICE_UUID], false);
    }

    stopScanning() {
        if(this.writeCharacteristic)
            return;

        noble.stopScanning(error => error ? console.log : null);
        console.log("Found grainfather");
    }

    onDiscoverDevice(peripheral) {  
        this.stopScanning(true);
        console.log(`Connecting to '${peripheral.advertisement.localName}' ${peripheral.id}`);
        this.setupDevice(peripheral);
    }

    setupDevice(peripheral) {
        peripheral.connect(error => {
            if (error) {
                console.log(error);
                return;
            }

            this.peripheral = peripheral;
            
            console.log("Connected");
            peripheral.once('disconnect', () => {
                this.writeCharacteristic = null;
                this.readCharacteristic = null;
                console.log("Disconnected :(");
            });

            console.log("Discovering characteristics");
            peripheral.discoverSomeServicesAndCharacteristics(
                [GF_SERVICE_UUID],
                [GF_WRITE_CHARACTERISTIC_UUID, GF_READ_CHARACTERISTIC_UUID],
                this.onDiscoverCharacteristic.bind(this)
            );
        });
    }

    onDiscoverCharacteristic(error, services, characteristics) {
        if (error) {
            console.log(error);
            return;
        }

        console.log("Discovered " + characteristics.length + " charactertistics");

        for(const c of characteristics) {
            if(c.uuid === GF_READ_CHARACTERISTIC_UUID)
                this.readCharacteristic = c;
            
            if(c.uuid === GF_WRITE_CHARACTERISTIC_UUID)
                this.writeCharacteristic = c;
        }

        console.log("Bluetooth ready");
        this.emit('ready');

        this.readCharacteristic.subscribe(error => error ? console.log : null);
        this.readCharacteristic.on('data', this.onData.bind(this));
    }

    onData(data, isNotification) {
        this.emit('data', data, isNotification);
    }

    formatCommand(command) {
        return new Buffer(command.padEnd(19, " "), "utf-8");
    }

    send(command) {
        return new Promise((resolve, reject) => {
            if(!this.writeCharacteristic)
                return reject("Write characteristic not ready");

            let message = this.formatCommand(command);
            console.log("Sending command: " + message.toString());
            this.writeCharacteristic.write(message, true, error => {
                error ? reject(error) : resolve();
            });
        });
    }

}