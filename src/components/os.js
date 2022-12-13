import { EOL, cpus, homedir, userInfo, arch } from "os";

export function parseArg(arg) {
  switch (arg) {
    case "--EOL":
      console.log(JSON.stringify(EOL).replaceAll('"', ""));
      break;
    case "--cpus":
      const cpuInfo = cpus();
      console.log("Model: ", cpuInfo[0].model);
      console.log("Cores: ", cpuInfo.length);
      console.log(`Clock speed: ${cpuInfo[0].speed / 1000}Ghz`);
      break;
    case "--homedir":
      console.log(homedir());
      break;
    case "--username":
      console.log(userInfo().username);
      break;
    case "--architecture":
      console.log(arch());
      break;
    default:
      console.log("Invalid input");
  }
}
