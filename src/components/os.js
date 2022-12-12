import { EOL, cpus, homedir, userInfo, arch } from "os";

export function parseArg(arg) {
  switch (arg) {
    case "--EOL":
      printEOL();
      break;
    case "--cpus":
      printCpus();
      break;
    case "--homedir":
      printHomedir();
      break;
    case "--username":
      printUsername();
      break;
    case "--architecture":
      printArch();
      break;
    default:
      console.log("Wrong parameter");
  }
}

function printEOL() {
  console.log(JSON.stringify(EOL).replaceAll('"', ""));
}

function printCpus() {
  console.log(cpus());
  const cpuInfo = cpus();
  console.log("Model: ", cpuInfo[0].model);
  console.log("Cores: ", cpuInfo.length);
  console.log(`Clock speed: ${cpuInfo[0].speed / 1000}Ghz`);
}

function printHomedir() {
  console.log(homedir());
}

function printUsername() {
  console.log(userInfo().username);
}

function printArch() {
  console.log(arch());
}
