const wifiName = require('wifi-name');

function checkInternet(cb) {
    var r = require("request")('http://www.msftconnecttest.com/', function (e, response) {
        if(e!=null) cb(false);
        else if('<pre>'==response.body.substr(0, 5)) cb(true);
        else cb(false);
    });
}

function getWifiName() {
    try{
        return wifiName.sync();
    } catch(e) {
        return null;
    }
}

orgWifiName=getWifiName();

setInterval(function() {
    if(orgWifiName!=getWifiName()) console.log(getWifiName());
    orgWifiName=getWifiName();
}, 1000);