const listeners = {};

// 🔊 DENGERIN EVENT
export function on(event, callback) {
    if (!listeners[event]) {
        listeners[event] = [];
    }
    listeners[event].push(callback);
}

// 📢 KIRIM EVENT
export function emit(event, data) {
    if (!listeners[event]) return;

    listeners[event].forEach(cb => cb(data));
}