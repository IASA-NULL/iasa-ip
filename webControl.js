const wifiName = require('wifi-name');
const network = require('network');
const dns = require('dns');

function checkDns() {
    return new Promise((resolve) => {
        dns.lookupService('8.8.8.8', 53, err => {
            if (err == null) resolve(true);
            else resolve(false);
        });
    });
}

function checkInternet() {
    return new Promise((resolve) => {
        require("request")({url: 'http://www.msftconnecttest.com/', timeout: 1000}, (e, response) => {
            if (e) resolve(false);
            else if ('<pre>' === response.body.substr(0, 5)) resolve(true);
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

function checkLanCable() {
    return new Promise((resolve) => {
        network.get_active_interface((err, obj) => {
            if (String(obj.type) === 'Wired') resolve(true);
            else resolve(false);
        });
    });
}

exports.checkInternet = checkInternet;
exports.getWifiName = getWifiName;
exports.checkDns = checkDns;
exports.checkLanCable = checkLanCable;