export function getUserName() {
    const [command, userName] = process.argv.slice(-2);
    if(command === "--username" && userName) return userName;
    return "User";
}