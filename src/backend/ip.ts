import {PLACE} from "../const";
import {execSync} from 'child_process'

function tryExecSync(command) {
    try {
        return execSync(command)
    } catch (e) {
        return null
    }
}

export function changeIP(place: PLACE, adp: string, id: string) {
    return new Promise<void>((resolve) => {
        if (place === PLACE.home) {
            tryExecSync('netsh -c int ip set address name="' + adp + '" source=dhcp');
            tryExecSync('netsh -c int ip set dnsservers name="' + adp + '" source=dhcp');
            resolve()
        }
        if (place === PLACE.school) {
            let ip, gate, a, b, c, su

            if (id.length === 4) {
                a = Math.floor(parseInt(id) / 1000);
                b = Math.floor(parseInt(id) / 100 % 10);
                c = parseInt(id) % 100;
            }
            if (id.length === 5) {
                a = Math.floor(parseInt(id) / 10000);
                b = Math.floor(parseInt(id) / 100 % 10);
                c = parseInt(id) % 100;
            }

            su = 9 + c + (b - 1) * 16;
            if (a === 1) {
                ip = '10.140.82.' + String(su);
                gate = '10.140.82.254';
            }
            if (a === 2) {
                ip = '10.140.83.' + String(su);
                gate = '10.140.83.254';
            }
            if (a === 3) {
                ip = '10.140.84.' + String(su);
                gate = '10.140.84.254';
            }

            const mask = "255.255.255.0";
            const dns1 = '211.46.153.1';
            const dns2 = '210.104.203.1';

            tryExecSync('netsh -c int ip set address name="' + adp + '" source=static addr=' + ip + ' mask=' + mask + ' gateway=' + gate + ' gwmetric=0');
            tryExecSync('netsh -c int ip set dnsservers name="' + adp + '" source=static ' + dns1 + ' validate=no');
            tryExecSync('netsh interface ip add dns name="' + adp + '" addr=' + dns2 + ' validate=no index=2');
            resolve()
        }
    })
}