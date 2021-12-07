import flask
from flask import request
import servicemanager
import socket
import sys
import win32event
import win32service
import win32serviceutil
import changeIp

app = flask.Flask(__name__)
stuId = ''


@app.route('/')
def main():
    return 'IP Backend Service'


@app.route('/version')
def version():
    return '6.0.0'


@app.route('/ip')
def ip():
    return str(sys.argv)


@app.route("/register/<stuid>")
def register(stuid):
    global stuId
    stuId = stuid
    return ''


@app.route("/stuid")
def stuid():
    global stuId
    return str(stuId)


@app.route("/exit")
def quit():
    exit()


@app.route('/change', methods=['POST'])
def change():
    content = request.json
    if content['place'] is None or content['adapter'] is None or content['id'] is None:
        return '{"success": "false"}'

    changeIp.changeIp(content['place'], content['adapter'], content['id'])
    return '{"success": true}'


class BackendService(win32serviceutil.ServiceFramework):
    _svc_name_ = "IP_BACKEND"
    _svc_display_name_ = "IP BACKEND Service"

    def __init__(self, args):
        win32serviceutil.ServiceFramework.__init__(self, args)
        self.hWaitStop = win32event.CreateEvent(None, 0, 0, None)
        socket.setdefaulttimeout(60)

    def SvcDoRun(self):
        app.run(host='0.0.0.0', port=5008)

    def SvcStop(self):
        self.ReportServiceStatus(win32service.SERVICE_STOPPED)
        exit()


if __name__ == '__main__':
    try:
        servicemanager.Initialize()
        servicemanager.PrepareToHostSingle(BackendService)
        servicemanager.StartServiceCtrlDispatcher()
    except:
        try:
            win32serviceutil.StopService("IP_BACKEND")
        except:
            pass

        try:
            win32serviceutil.InstallService(win32serviceutil.GetServiceClassString(BackendService),
                                            BackendService._svc_name_, BackendService._svc_display_name_,
                                            startType=win32service.SERVICE_AUTO_START)
        except:
            pass

        win32serviceutil.StartService("IP_BACKEND")
