import { store } from "../store.js";

export function exitHandler() {
    console.log(`\nThank you for using File Manager, ${store.userName}, goodbye!`);
    process.exit();
}