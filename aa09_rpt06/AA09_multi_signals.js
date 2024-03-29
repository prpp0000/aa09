// 'use strict';
// tmp36_node.js

var serialport = require('serialport');
var portName = 'COM4';  // check your COM port!!
var port    =   process.env.PORT || 3000;

var io = require('socket.io').listen(port);

// serial port object
var sp = new serialport(portName,{
    baudRate: 9600,   // 9600  38400
    dataBits: 8,
    parity: 'none',
    stopBits: 1,
    flowControl: false,
    parser: serialport.parsers.readline('\r\n')  // new serialport.parsers.Readline
});
var dStr = '';
var readData = '';  // Array
var lux = '';
var humi = '';
var temp = '';
var mdata = [];
var firstcommaidx =0;
var secondcommaidx =0;
sp.on('data', function (data) { // call back when data is received
    // raw data only 
        //console.log(data); 
        readData = data.toString();
        firstcommaidx = readData.indexOf(',');
        secondcommaidx = readData.indexOf(',',firstcommaidx+1);
    if(firstcommaidx > 0) {
        lux = readData.substring(0,firstcommaidx);
        humi = readData.substring(firstcommaidx + 1,secondcommaidx);
        temp =readData.substring(secondcommaidx+1);
        readData = '';
    
        dStr = getDateString();      
        mdata[0] = dStr;  // date
        mdata[1] = lux;  // date
        mdata[2] = humi;
        mdata[3] = temp;
        console.log('AA09,' + mdata);
        io.sockets.emit('message', mdata);  // send data to all clients   
  } else {
    console.log(readData);
    }
});


io.sockets.on('connection', function (socket) {
    // If socket.io receives message from the client browser then 
    // this call back will be executed.
    socket.on('message', function (msg) {
        console.log(msg);
    });
    // If a web browser disconnects from Socket.IO then this callback is called.
    socket.on('disconnect', function () {
        console.log('disconnected');
    });
});

// helper function to get a nicely formatted date string for IOT
function getDateString() {
    var time = new Date().getTime();
    // 32400000 is (GMT+9 Korea, GimHae)
    // for your timezone just multiply +/-GMT by 3600000
    var datestr = new Date(time +32400000).
    toISOString().replace(/T/, ' ').replace(/Z/, '');
    return datestr;
}