import fs from 'fs'
import {execSync} from 'child_process'
import path from "path";
import rcedit from 'rcedit'
import {version} from '../../package.json'

const ver = 'v3.2'
const customIconPath = path.join(__dirname, '..', 'res', 'logo.ico');
const resourceHackerPath = path.join(__dirname, '..', 'build_tool', 'RH.exe')

let pkgPrecompiledBinaries


process.env["SOURCE_RESOURCE_HACKER"] = resourceHackerPath;

fs.rmdirSync('pkg-cache', {recursive: true});
console.log("Download pkg precompiled libraries");
downloadOriginalPkgPrecompiledBinaries();

setTimeout(() => {
    fs.readdir('pkg-cache/' + ver, async (err, files) => {
        let fileName = files[0].replace('fetched', 'built')
        fs.renameSync(
            path.join(__dirname, '..', 'pkg-cache', ver, files[0]),
            path.join(__dirname, '..', 'pkg-cache', ver, fileName)
        );
        pkgPrecompiledBinaries =
            path.join(__dirname, '..', 'pkg-cache', ver, fileName)
        console.log("Customize pkg precompiled libraries");
        await customizePkgPrecompiledBinaries();
        console.log("Build customized executables");
        buildCustomizedExecutables();
        console.log("Done");
    });
}, 1000)


function downloadOriginalPkgPrecompiledBinaries() {
    if (!fs.existsSync(pkgPrecompiledBinaries)) {
        executePkg("temp.exe");
        fs.unlinkSync("temp.exe");
    }
}

async function customizePkgPrecompiledBinaries() {
    await rcedit(pkgPrecompiledBinaries, {
        icon: customIconPath,
        "requested-execution-level": "requireAdministrator"
    })
}

function buildCustomizedExecutables() {
    executePkg(`res/IP_SERVICE_${version}.exe`);
}

function executePkg(exeName) {
    execSync(
        `yarn run cross-env PKG_CACHE_PATH=./pkg-cache pkg build/backend.js --target node14-win-x64 --output "${exeName}"`
    );
}

