import { app } from "./js/event-listeners.js";

try {
    app();
} catch (err) {
    console.error(err.message);
}
