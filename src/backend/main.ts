import {execSync} from 'child_process'
import express from 'express'
import temp from 'temp'
import fs from 'fs'
import path from "path";
import {changeIP} from "./ip"

const app = express()
app.use(express.json())

function getServiceConfig(name: string, command: string) {
    return `<?xml version="1.0" encoding="UTF-16"?>
<Task version="1.4" xmlns="http://schemas.microsoft.com/windows/2004/02/mit/task">
  <RegistrationInfo>
    <Date>2019-09-21T08:37:08</Date>
    <Author>NULL</Author>
    <URI>\\MyTasks\\${name}</URI>
  </RegistrationInfo>
  <Triggers>
    <LogonTrigger>
      <StartBoundary>2019-09-21T08:37:00</StartBoundary>
      <Enabled>true</Enabled>
    </LogonTrigger>
  </Triggers>
  <Principals>
    <Principal id="Author">
      <RunLevel>HighestAvailable</RunLevel>
    </Principal>
  </Principals>
  <Settings>
      <MultipleInstancesPolicy>StopExisting</MultipleInstancesPolicy>
      <DisallowStartIfOnBatteries>false</DisallowStartIfOnBatteries>
      <StopIfGoingOnBatteries>false</StopIfGoingOnBatteries>
      <AllowHardTerminate>false</AllowHardTerminate>
      <StartWhenAvailable>false</StartWhenAvailable>
      <RunOnlyIfNetworkAvailable>false</RunOnlyIfNetworkAvailable>
      <IdleSettings>
          <StopOnIdleEnd>false</StopOnIdleEnd>
          <RestartOnIdle>false</RestartOnIdle>
      </IdleSettings>
      <AllowStartOnDemand>true</AllowStartOnDemand>
      <Enabled>true</Enabled>
      <Hidden>false</Hidden>
      <RunOnlyIfIdle>false</RunOnlyIfIdle>
    <DisallowStartOnRemoteAppSession>false</DisallowStartOnRemoteAppSession>
    <UseUnifiedSchedulingEngine>true</UseUnifiedSchedulingEngine>
    <WakeToRun>false</WakeToRun>
    <ExecutionTimeLimit>PT0S</ExecutionTimeLimit>
      <Priority>1</Priority>
  </Settings>
  <Actions Context="Author">
    <Exec>
      ${command}
    </Exec>
  </Actions>
</Task>`
}

function registerService(silent = false) {
    return new Promise<void>(((resolve, reject) => {
        if (!silent) {
            try {
                execSync('schtasks /run /tn "MyTasks\\iasa-ip-stop"')
            } catch (e) {

            }
        }
        try {
            execSync('schtasks /delete /tn "MyTasks\\iasa-ip" /f');
        } catch (e) {

        }
        try {
            execSync('schtasks /delete /tn "MyTasks\\iasa-ip-stop" /f');
        } catch (e) {

        }
        temp.open({suffix: '.xml'}, function (err, info) {
            let exePath = process.argv[0]
            let exeName = process.argv[0].split('\\').slice(-1)[0]
            fs.writeSync(info.fd, getServiceConfig('iasa-ip', `<Command>cscript</Command>
      <Arguments>"${path.join(exePath, '..', 'runner.vbs')}" "${exePath} -s"</Arguments>`));
            fs.close(info.fd, function (err) {
                let res = execSync('schtasks /create /tn "MyTasks\\iasa-ip" /xml "' + info.path + '" /f');

                temp.open({suffix: '.xml'}, function (err, info) {
                    fs.writeSync(info.fd, getServiceConfig('iasa-ip-stop', `<Command>taskkill</Command>
      <Arguments>-f -im "${exeName}"</Arguments>`));
                    fs.close(info.fd, function (err) {
                        let res = execSync('schtasks /create /tn "MyTasks\\iasa-ip-stop" /xml "' + info.path + '" /f');
                        resolve()
                    });
                });
            });
        });
    }))
}

app.post('/change', async (req, res) => {
    changeIP(req.body.place, req.body.adapter, req.body.id).then(() => {
        res.send({success: true})
    }).catch(() => {
        res.send({success: false})
    })
});

app.get('/', async (req, res) => {
    res.send('IP Backend Service')
});

(async () => {
    await registerService(process.argv.slice(-1)[0] === '-s')
    if (process.argv.slice(-1)[0] !== '-s') {
        execSync('schtasks /run /tn "MyTasks\\iasa-ip"')
        process.exit(0)
    }
    app.listen(5008)
})()


