import { app } from "./js/event-listeners.js";

try {
    app();
} catch (err) {
    alert(err.message);
}
