function changeToSchool() {
    
}

function changeToOUt() {
    
}

function getCurrentState() {
    const { session } = require('electron')
    session.defaultSession.cookies.get({})
    .then((cookies) => {
        cookies.forEach(c => {
            if (String(c.name) == 'op') return parseInt(c.value);
        });
        return 0;
    }).catch((error) => {})
}

function getIpAddress(stuId) {
    if(stuId)
}

exports.changeToSchool=changeToSchool;
exports.changeToOUt=changeToOUt;
exports.getCurrentState=getCurrentState;