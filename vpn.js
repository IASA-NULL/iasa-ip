const {spawn} = require('child_process');
const {Notification} = require('electron');
const {execSync} = require('child_process');
const temp = require('temp');
const fs = require('fs');

let proc = null;
let notification = null;
let intv = null;

function checkOpenVpn() {
    try {
        if (fs.existsSync('C:\\Program Files\\OpenVPN\\bin\\openvpn.exe')) return true;
        else return false;
    } catch (e) {
        return false;
    }
}

function installVpn() {
    return new Promise(function (resolve, reject) {
        if (checkOpenVpn()) {
            resolve();
            return;
        }
        execSync('res\\openvpn.exe /S');
        intv = setInterval(() => {
            if (checkOpenVpn()) {
                clearInterval(intv);
                intv = null;
                resolve();
            }
        }, 3000);
    });
}

function startVpn() {
    return new Promise(function (resolve, reject) {
        installVpn().then(() => {
            if (notification) notification.close();
            notification = new Notification({
                title: 'VPN 연결중',
                body: '게임 실행을 탐지해 VPN에 연결하는 중입니다.',
                icon: 'C:\\Program Files\\IP\\res\\ipLogo.ico'
            });
            notification.show();
            require("request")({url: 'http://www.vpngate.net/api/iphone/', timeout: 10000}, (e, res, body) => {
                try {
                    temp.open({suffix: '.ovpn'}, function (err, info) {
                        if (err) throw err;
                        fs.write(info.fd, Buffer.from(body.split(/\r?\n/)[2].split(',').reverse()[0], 'base64').toString(), (err) => {
                            //console.log(err);
                        });
                        fs.close(info.fd, function (err) {
                            if (err) throw err;
                            if (!e) {
                                proc = spawn('C:\\Program Files\\OpenVPN\\bin\\openvpn.exe', ['--config', info.path]);
                                proc.stdout.on('data', (data) => {
                                    if (data.toString().includes('opened')) {
                                        if (notification) notification.close();
                                        notification = new Notification({
                                            title: 'VPN 연결됨',
                                            body: 'VPN에 자동으로 연결했습니다.',
                                            icon: 'C:\\Program Files\\IP\\res\\ipLogo.ico'
                                        });
                                        notification.show();
                                        resolve();
                                    }
                                });
                            } else reject();
                        });
                    });
                } catch (e) {

                }
            });
        });
    });
}

function stopVpn() {
    if (!proc) return;
    proc.stdin.pause();
    proc.kill();
    proc = null;
}

exports.startVpn = startVpn;
exports.stopVpn = stopVpn;