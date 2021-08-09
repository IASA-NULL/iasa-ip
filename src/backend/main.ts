import {execSync} from 'child_process'
import express from 'express'
import temp from 'temp'
import fs from 'fs'
import path from "path";

const app = express()

function getServiceConfig(exePath: string) {
    return `<?xml version="1.0" encoding="UTF-16"?>
<Task version="1.4" xmlns="http://schemas.microsoft.com/windows/2004/02/mit/task">
  <RegistrationInfo>
    <Date>2019-09-21T08:37:08</Date>
    <Author>NULL</Author>
    <URI>\MyTasks\iasa-ip-l</URI>
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
      <Command>cscript</Command>
      <Arguments>"${path.join(exePath, '..', 'runner.vbs')}" "${exePath} -s"</Arguments>
    </Exec>
  </Actions>
</Task>`
}

function registerService() {
    return new Promise<void>(((resolve, reject) => {
        temp.open({suffix: '.xml'}, function (err, info) {
            fs.writeSync(info.fd, getServiceConfig(process.argv[0]));
            fs.close(info.fd, function (err) {
                let res = execSync('schtasks /create /tn "MyTasks\\iasa-ip" /xml "' + info.path + '" /f');
                resolve()
            });
        });
    }))
}

app.get('/change', async (req, res) => {
    setTimeout(() => {
        res.send({success: true})
    }, 1000)
});

app.get('/', async (req, res) => {
    res.send('IP Backend Service')
});

(async () => {
    await registerService()
    if (process.argv.slice(-1)[0] !== '-s') {
        execSync('schtasks /run /tn "MyTasks\\iasa-ip"')
        process.exit(0)
    }
    app.listen(5008)
})()

