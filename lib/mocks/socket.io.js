/**
 * Socket.io Mock
 * Licensed under the MIT license.
 *
 * @author Sergey Tsapenko <4031651@gmail.com>
 * @version  0.1
 */

/**
 * @private
 */
function Observer() {
    
}

/**
 * @private
 */
Observer.prototype.on = function (name, fn) {
    if (!this.$events) {
        this.$events = {};
    }

    if (!this.$events[name]) {
        this.$events[name] = [fn];
    } else {
        this.$events[name].push(fn);
    }

    return this;
};

/**
 * @private
 */
Observer.prototype.once = function (name, fn) {
    var self = this;

    function on() {
        self.removeListener(name, on);
        fn.apply(this, arguments);
    }


    on.listener = fn;
    this.on(name, on);

    return this;
};

/**
 * @private
 */
Observer.prototype.removeListener = function (name, fn) {
    if (this.$events && this.$events[name]) {
        var list = this.$events[name],
            pos = -1;

        for (var i = 0, l = list.length; i < l; i++) {
            if (list[i] === fn || (list[i].listener && list[i].listener === fn)) {
                pos = i;
                break;
            }
        }

        if (pos < 0) {
            return this;
        }

        list.splice(pos, 1);

        if (!list.length) {
            delete this.$events[name];
        }
    }

    return this;
};

/**
 * @private
 */
Observer.prototype.emit = function (name) {
    if (!this.$events) {
        return false;
    }
    var handler = this.$events[name];

    if (!handler) {
        return false;
    }
    var args = Array.prototype.slice.call(arguments, 1);

    var listeners = handler.slice();

    for (var i = 0, l = listeners.length; i < l; i++) {
        listeners[i].apply(this, args);
    }

    return true;
};

/**
 * Socket.io mock constructor
 *
 * @constructor
 */
function Socket() {
    this.client = new Observer();
    this.server = new Observer();
}
/**
 * Adds a listener.
 *
 * @param {String}   name Event name
 * @param {Function} fn   Callback function. Called when event was triggered
 */
Socket.prototype.on = function (name, fn) {
    this.client.on.apply(this.client, [name, fn]);
    return this;
};
/**
 * Emits an event.
 *
 * @param {String} name Event name
 * @param {Mixed}  data Event data
 */
Socket.prototype.emit = function (/*optional*/name) {
    this.server.emit.apply(this.server, arguments);
    return this;
};
/**
 * Get socket server.
 *
 * @return {Server} Socket server object
 */
Socket.prototype.getServer = function () {
    var self = this;
    return {
        /**
         * Adds a listener.
         *
         * @param {String}   name Event name
         * @param {Function} fn   Callback function. Called when event was triggered
         */
        on:   function () {
            self.server.on.apply(self.server, arguments);
            return self;
        },
        /**
         * Adds a volatile listener.
         *
         * @param {String}   name Event name
         * @param {Function} fn   Callback function. Called when event was triggered
         */
        once: function () {
            self.server.once.apply(self.server, arguments);
            return self;
        },
        /**
         * Emits an event.
         *
         * @param {String} name Event name
         * @param {Mixed}  data Event data
         */
        emit: function () {
            self.client.emit.apply(self.client, arguments);
            return self;
        },
        CLASS_NAME: 'SocketServer'
    };
};

var io = {
    /**
     * Connect to the hosts.
     *
     * @param {String} url String that describe the URL.
     * Any string. In fact this string no used. Just for compatibility with Socket.io connect()
     *
     * @return {Socket} Socket.io Socket object
     */
    connect: function (/*optional*/url) {
        return new Socket();
    }
};