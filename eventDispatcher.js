export function CreateEventDispatcher() {
    const listeners = new Set();

    function EventDispatcher(callback) {
        EventDispatcher.add(callback)
    }

    EventDispatcher.add = function (callback) {
        listeners.add(callback);
    }
    EventDispatcher.delete = function (callback) {
        listeners.delete(callback);
    }
    EventDispatcher.dispatch = function (...args) {
        listeners.forEach(c => c(...args));
    }
    return EventDispatcher;
}