const wifiName = require('wifi-name');

function getWifiName() {
    try {
        return wifiName.sync();
    } catch (e) {
        return null;
    }
}

exports.getWifiName = getWifiName;