import os


def runSafe(command):
    try:
        os.system(command)
    except:
        pass


def changeIp(place, adp, stuid):
    if place == 1:  # home
        runSafe('netsh -c int ip set address name="' + adp + '" source=dhcp')
        runSafe('netsh -c int ip set dnsservers name="' + adp + '" source=dhcp')
    elif place == 2:  # school
        if len(stuid) == 4:
            a = int(stuid[0])
            b = int(stuid[1])
            c = int(stuid[2:])
        else:
            a = int(stuid[0])
            b = int(stuid[2])
            c = int(stuid[3:])

        su = 9 + c + (b - 1) * 16
        if a == 1:
            ip = '10.140.82.' + str(su)
            gate = '10.140.82.254'

        elif a == 2:
            ip = '10.140.83.' + str(su)
            gate = '10.140.83.254'

        else:
            ip = '10.140.84.' + str(su)
            gate = '10.140.84.254'

        mask = "255.255.255.0"
        dns1 = '211.46.153.1'
        dns2 = '210.104.203.1'
        runSafe(
            'netsh -c int ip set address name="' + adp + '" source=static addr=' + ip + ' mask=' + mask + ' gateway='
            + gate + ' gwmetric=0')
        runSafe('netsh -c int ip set dnsservers name="' + adp + '" source=static ' + dns1 + ' validate=no')
        runSafe('netsh interface ip add dns name="' + adp + '" addr=' + dns2 + ' validate=no index=2')
