const wifiName = require('wifi-name');

function checkDns() {
    var dns = require('dns');
    return new Promise((resolve, reject) => {
        dns.lookupService('8.8.8.8', 53, function (err, hostname, service) {
            if(err==null) resolve(true);
            else resolve(false);
        });
    });
}

function checkInternet() {
    return new Promise((resolve, reject) => {
        var r = require("request")({url:'http://www.msftconnecttest.com/', timeout: 1000}, function (e, response) {
            if (e != null) resolve(false);
            else if ('<pre>' == response.body.substr(0, 5)) resolve(true);
            else resolve(false);
        });
    });
}

function getWifiName() {
    try {
        return wifiName.sync();
    } catch (e) {
        return null;
    }
}

exports.checkInternet = checkInternet;
exports.getWifiName = getWifiName;
exports.checkDns = checkDns;