/**
 * A JavaScript Functional Testing framework.
 * Licensed under the MIT license.
 * Use code from https://github.com/joyent/node/blob/master/lib/assert.js
 *
 * @author Sergey Tsapenko <4031651@gmail.com>
 * @version  0.2.2
 */
var assert = {},
    yatt = {};


(function (assert, yatt) {
var pSlice = Array.prototype.slice;

    /**
     * Test that expr is true (not enpty).
     *
     * @param {Mixed}  value   Tested value
     * @param {String} message Message if the assertion failed
     */
    assert.ok = function (value, message) {
        if (!!!value) {
            assert.fail(value, true, message, '==');
        }
    };
    /**
     * Test that actual and expected are equal.
     *
     * @param {Mixed}  actual
     * @param {Mixed}  expected
     * @param {String} message Message if the assertion failed
     */
    assert.equal = function (actual, expected, message) {
        if (actual != expected) {
            assert.fail(actual, expected, message, '==');
        }
    };
    /**
     * Test that actual and expected are not equal.
     *
     * @param {Mixed}  actual
     * @param {Mixed}  expected  desc
     *                           another line of description
     * @param {String} message Message if the assertion failed
     */
    assert.notEqual = function (actual, expected, message) {
        if (actual == expected) {
            assert.fail(actual, expected, message, '!=');
        }
    };

    /**
     * @private
     */
    assert.fail = function (actual, expected, message, operator) {
        message = message || 'Failed';
        yatt.queue.fail(actual, expected, message, operator);
    };

    /**
     * Test that actual and expected are identically (equal by the type and by the value).
     *
     * @param {Mixed}  actual
     * @param {Mixed}  expected
     * @param {String} message Message if the assertion failed
     */
    assert.strictEqual = function (actual, expected, message) {
        if (actual !== expected) {
            assert.fail(actual, expected, message, '===');
        }
    };
    /**
     * Test that actual and expected are not identically (not equal by the type or by the value).
     *
     * @param {Mixed}  actual
     * @param {Mixed}  expected
     * @param {String} message Message if the assertion failed
     */
    assert.notStrictEqual = function (actual, expected, message) {
        if (actual === expected) {
            assert.fail(actual, expected, message, '!==');
        }
    };

    (function (assert) {
        /**
         * @private
         */
        function isUndefinedOrNull(value) {
            return value === null || value === undefined;
        }
        /**
         * @private
         */
        function isArguments(object) {
            return Object.prototype.toString.call(object) == '[object Arguments]';
        }
        /**
         * @private
         */
        function objEquiv(a, b) {
            if (isUndefinedOrNull(a) || isUndefinedOrNull(b)) {
                return false;
            }

            if (a.prototype !== b.prototype) {
                return false;
            }

            if (isArguments(a)) {
                if (!isArguments(b)) {
                    return false;
                }
                a = pSlice.call(a);
                b = pSlice.call(b);
                return $deepEqual(a, b);
            }
            var ka, kb, key, i;
            try {
                ka = Object.keys(a);
                kb = Object.keys(b);
            } catch (e) {//happens when one is a string literal and the other isn't
                return false;
            }
            if (ka.length != kb.length) {
                return false;
            }
            ka.sort();
            kb.sort();
            //~~~cheap key test
            for (i = ka.length - 1; i >= 0; i--) {
                if (ka[i] != kb[i]) {
                    return false;
                }
            }
            //equivalent values for every corresponding key, and
            //~~~possibly expensive deep test
            for (i = ka.length - 1; i >= 0; i--) {
                key = ka[i];
                if (!$deepEqual(a[key], b[key])) {
                    return false;
                }
            }
            return true;
        }
        /**
         * @private
         */
        function $deepEqual(actual, expected) {
            if (actual === expected) {
                return true;
            } else if (actual instanceof Date && expected instanceof Date) {
                return actual.getTime() === expected.getTime();

            } else if (actual instanceof RegExp && expected instanceof RegExp) {
                return actual.source === expected.source && actual.global === expected.global && actual.multiline === expected.multiline && actual.lastIndex === expected.lastIndex && actual.ignoreCase === expected.ignoreCase;

            } else if (typeof actual != 'object' && typeof expected != 'object') {
                return actual == expected;

            } else {
                return objEquiv(actual, expected);
            }
        }
        /**
         * Test that actual and expected are equal (recursive check).
         *
         * @param {Mixed}  actual
         * @param {Mixed}  expected
         * @param {String} message Message if the assertion failed
         */
        assert.deepEqual = function (actual, expected, message) {
            if (!$deepEqual(actual, expected)) {
                assert.fail(actual, expected, message, 'deepEqual');
            }
        };
        /**
         * Test that actual and expected are not equal (recursive check).
         *
         * @param {Mixed}  actual
         * @param {Mixed}  expected
         * @param {String} message Message if the assertion failed
         */
        assert.notDeepEqual = function (actual, expected, message) {
            if ($deepEqual(actual, expected)) {
                assert.fail(actual, expected, message, 'notDeepEqual');
            }
        };

        /**
         * @private
         */
        function expectedException(actual, expected) {
            if (!actual || !expected) {
                return false;
            }

            if (expected instanceof RegExp) {
                return expected.test(actual);
            } else if (actual instanceof expected) {
                return true;
            } else if (expected.call({}, actual) === true) {
                return true;
            }

            return false;
        }
        /**
         * @private
         */
        function $throws(shouldThrow, block, expected, message) {
            var actual;

            if (typeof expected === 'string') {
                message = expected;
                expected = null;
            }

            try {
                block();
            } catch (e) {
                actual = e;
            }
            message = (expected && expected.name ? ' (' + expected.name + ').' : '.') + (message ? ' ' + message : '.');

            if (shouldThrow && !actual) {
                assert.fail('Missing expected exception' + message);
            }

            if (!shouldThrow && expectedException(actual, expected)) {
                assert.fail('Got unwanted exception' + message);
            }

            if ((shouldThrow && actual && expected && !expectedException(actual, expected)) || (!shouldThrow && actual)) {
                throw actual;
            }
        }
        /**
         * Test that an exception is raised when block is called.
         *
         * @param {Function}  block   Tested code
         * @param {Exception} error   Optional argument. Exception type
         * @param {String}    message Optional argument. Exception message
         */
        assert['throws'] = function (block, /*optional*/error, /*optional*/message) {
            $throws.apply(this, [true].concat(pSlice.call(arguments)));
        };
        /**
         * Test that an exception is not raised when block is called.
         *
         * @param {Function}  block   Tested code
         * @param {Exception} error   Optional argument. Exception type
         * @param {String}    message Optional argument. Exception message
         */
        assert.doesNotThrow = function (block, /*optional*/error, /*optional*/message) {
            $throws.apply(this, [false].concat(pSlice.call(arguments)));
        };
    }(assert));
}(assert, yatt));

(function (yatt) {
    /**
     * @private
     */
    yatt.queue = {
        current: 0,
        waits:   [],
        failed:  false
    };
    /**
     * @private
     */
    yatt.queue.clearWaits = function () {
        for (var i = 0; i < yatt.queue.waits.length; i++) {
            if (yatt.queue.waits[i]) {
                window.clearTimeout(yatt.queue.waits[i]);
            }
        }
        yatt.queue.waits = [];
    };
    /**
     * @private
     */
    yatt.queue.next = function () {
        yatt.queue.clearWaits();
        var idx = yatt.queue.current,
            len = yatt.tests.length;

        if (yatt.queue.current < len) {
            yatt.logger.test(yatt.queue.current, len, yatt.tests[idx].name, yatt.tests[idx].suite);
            yatt.tests[idx].fn();
        } else {
            yatt.logger.end(len);
        }
    };
    /**
     * @private
     */
    yatt.queue.pass = function () {
        if (yatt.queue.failed) {
            return;
        }
        var idx = yatt.queue.current;
        yatt.logger.pass(idx, yatt.tests[idx].name, yatt.tests[idx].suite);

        yatt.queue.current += 1;

        window.setTimeout(yatt.queue.next, 1);
    };
    /**
     * @private
     */
    yatt.queue.fail = function (actual, expected, message, operator) {
        var idx = yatt.queue.current;
        yatt.logger.fail(idx, yatt.tests[idx].name, yatt.tests[idx].suite, actual, expected, message, operator);
        yatt.queue.failed = true;
        yatt.queue.clearWaits();
    };

    /**
     * Wrapper function around window.setTimeout. All waits are properly cleared at the end of the test.
     *
     * @param {Number}   time Time to wait in milliseconds
     * @param {Function} fn   Callback function
     */
    yatt.wait = function (time, fn) {
        if (typeof fn == 'function') {
            var th = window.setTimeout(fn, time);
            yatt.queue.waits.push(th);
        }
    };
    /**
     * Call this function to indicate that the test case has been passed.
     */
    yatt.pass = function () {
        yatt.queue.pass();
    };
    /**
     * Call this function to indicate that the test case has been failed.
     *
     * @param {String} message Error message
     */
    yatt.fail = function (message) {
        var idx = yatt.queue.current;
        yatt.logger.message(idx, yatt.tests[idx].name, yatt.tests[idx].suite, message, '#f00');
        yatt.queue.fail();
    };
    /**
     * Print message to a test results.
     *
     * @param {String} msg error message
     */
    yatt.logMsg = function (msg) {
        var idx = yatt.queue.current;
        yatt.logger.message(idx, yatt.tests[idx].name, yatt.tests[idx].suite, '-> ' + msg, null, 'msg');
    };

    /**
     * @private
     */
    yatt.tests = [];
    /**
     * Add test.
     *
     * @param {String} name Name of test
     * @param {Function} fn test suite
     * 
     * @return {yatt} YATT object
     */
    yatt.test = function (name, fn) {
        yatt.tests.push({
            fn: fn,
            name: name,
            suite: ''
        });
        return yatt;
    };
    
    /**
     * Add tests suite.
     * @param {String} suiteName Name of suite
     * 
     * @return {Suite} Suite object. This object has one method test()
     */
    yatt.suite = function (suiteName) {
        var _suite = {
            test: function (name, fn) {
                yatt.tests.push({
                    fn: fn,
                    name: name,
                    suite: suiteName
                });
                return _suite;
            }
        }
        return _suite;
    }
    
    /**
     * Start all tests.
     */
    yatt.startTests = function () {
        yatt.logger.ready(function () {
            yatt.logger.start(yatt.tests.length);
            yatt.queue.current = 0;
            yatt.queue.failed  = false;
            window.setTimeout(yatt.queue.next, 1);
        });
    };

    /**
     * Wait for alert.
     * 
     * @param {Function} fn Callback function.
     * Will be triggered when the window.alert() function was called.
     * Receive the text of window.alert() as a parameter.
     */
    yatt.alert = function (fn) {
        window.alert = function (_alert) {
            return function (text) {
                window.alert = _alert;
                fn(text);
            }
        }(window.alert);
    };

    /**
     * Wait for confirm.
     *
     * @param {Boolean}  result Result of confirm
     * @param {Function} fn Callback function. Optional parameter.
     * Will be triggered when the window.confirm() function was called.
     * Receive the text of window.confirm() as a parameter.
     */
    yatt.confirm = function (result, fn) {
        window.confirm = function (_confirm) {
            return function (text) {
                window.confirm = _confirm;
                if (typeof fn == 'function') {
                    fn(text);
                }
                return result;
            }
        }(window.confirm);
    };

    /**
     * Wait for prompt.
     *
     * @param {Mixed}  result Result of prompt (Text or Null)
     * @param {Function} fn Callback function. Optional parameter.
     * Will be triggered when the window.prompt() function was called.
     * Receive the text of window.prompt() and default value as a parameters.
     */
    yatt.prompt = function (result, fn) {
        window.prompt = function (_prompt) {
            return function (text, _default) {
                window.prompt = _prompt;
                if (typeof fn == 'function') {
                    fn(text, _default);
                }
                return result;
            }
        }(window.prompt);
    };
}(yatt));

/**************/
/*   Logger   */
/**************/
(function (yatt) {
    var EVENTS = ['start', 'test', 'pass', 'fail', 'message', 'end'];

    function Logger(opts) {
        var logger = function () {
            if (typeof this.init == 'function') {
                this.init();
            }
        };

        for (var prop in opts) {
            if (opts.hasOwnProperty(prop)) {
                logger[prop] = opts[prop];
            }
        }

        for (var i = 0; i < EVENTS.length; i++) {
            if (typeof logger[EVENTS[i]] != 'function') {
                logger[EVENTS[i]] = function () {};
            }
        }

        if (typeof logger.ready != 'function') {
            logger.ready = function (fn) {
                fn();
            };
        }
        return logger;
    }

    /**
     * Create YATT Logger class.
     * Extends default logger class with given properties. Method init() will be called first if it will be defined in the given properties object.
     * 
     * @param {Object} properties Properties which will be extend logger
     *
     * @return {Logger} YATT Logger class
     */
    yatt.createLogger = Logger;

    /**
     * Set the logger.
     *
     * @param {Logger} logger Instanse of YATT Logger class
     */
    yatt.setLogger = function (logger) {
        yatt.logger = logger;
    };
    
    yatt.setLogger(new Logger({
        testsWin: null,
        print: function (msg) {
            this.$('#test_log').append(msg);
            this.$('#test_results').scrollTop(999999);
        },
        ready: function (fn) {
            var self = this;
            this.onReady = function () {
                self.$ = self.testsWin.$;
                fn();
            };
            if (!this.testsWin) {
                this.testsWin = window.open('tests.html', 'tests', 'dependent=yes,location=no,menubar=no,status=no,width=500');
                return;
            }
            this.onReady();
        },
        start: function (count) {
            this.$('#test_log').empty();
            this.print('<h3 style="margin: 0;">Start</h3>');
        },
        test: function (idx, count, name, suite) {
            var sn = suite ? '(' + suite + ')' : '';
            this.print('<div id="test_' + idx + '" style="font-weight: bold;">' + (idx + 1) + ' of ' + count + ': ' + sn + name + '</div>');
        },
        pass: function (idx, name, suite) {
            this.$('#test_log #test_' + idx).css('color', 'green').append(' - Ok');
        },
        fail: function (idx, name, suite, actual, expected, message, operator) {
            this.print('<div style="color:red;">' + message + '</div>');
            this.print('<pre style="color:red;">    actual: ' + actual + "\n    expected: " + expected + "\n    operator: " + operator + '</pre>');
            this.$('#test_log #test_' + idx).css('color', 'red').append(' - Fail');
        },
        message: function (idx, name, suite, msg, color, cls) {
            if (color + cls) {
                color = color ? ' style="color: ' + color + '"' : '';
                cls = cls ? ' class="' + cls + '"' : '';
                msg = '<div' + color + cls + '>' + msg + '</div>'
            }

            this.print(msg);
        },
        end: function (count) {
            this.print('<h3 style="margin: 0;">Done</h3>');
            this.testsWin = null;
        }
    }));
}(yatt));

/**************/
/*   Events   */
/**************/
(function (yatt, window, document) {
    var Events = {
        readyList: [],
        isReady: false,
        onReady: function () {
            if (Events.isReady) {
                return;
            }
            for (var i = 0; i < Events.readyList.length; i++)  {
                setTimeout(Events.readyList[i], 1);
            }
            Events.isReady = true;
        }
    };

    // Code from jQuery
    (function (window, document, Events) {
        var DOMContentLoaded = function () {
            if (document.addEventListener) {
                document.removeEventListener("DOMContentLoaded", DOMContentLoaded, false);
                Events.onReady();
            } else if (document.readyState === "complete") {
                document.detachEvent("onreadystatechange", DOMContentLoaded);
                Events.onReady();
            }
        };

        if (document.readyState === "complete") {
            setTimeout(Events.onReady, 1);
        } else if (document.addEventListener) {
            document.addEventListener("DOMContentLoaded", DOMContentLoaded, false);
            window.addEventListener("load", Events.onReady, false);
        } else {
            document.attachEvent("onreadystatechange", DOMContentLoaded);
            window.attachEvent("onload", Events.onReady);

            var top = false;
            try {
                top = window.frameElement == null && document.documentElement;
            } catch (e) {}

            if (top && top.doScroll) {
                (function doScrollCheck() {
                    if (!Events.isReady) {
                        try {
                            top.doScroll("left");
                        } catch (e) {
                            return setTimeout(doScrollCheck, 50);
                        }
                        
                        Events.onReady();
                    }
                }());
            }
        }
    } (window, document, Events));

    /**
     * Specify a function to execute when the DOM is loaded.
     *
     * @param {Function} callback A function to execute after the DOM is ready
     */
    yatt.DOMReady = function (callback) {
        Events.readyList.push(callback);
    }
}(yatt, window, document));


/**************/
/*  Settings  */
/**************/
(function (yatt, document) {
    var isSet = false;

    /**
     * Add a button that runs the tests.
     * Appends a tag "A" to the body after the DOM is loaded.
     * 
     * @param {Strind} text Button label
     * @param {Strind} id   Optional parameter. Value of "id" attribute
     * @param {Strind} cls  Optional parameter. Value of "class" attribute
     */
    yatt.setStartButton = function (text, id, cls) {
        if (isSet) {
            return;
        }
        isSet = true;
        yatt.DOMReady(function () {
            var a = document.createElement('A');
            id && a.setAttribute('id', id);
            cls && a.setAttribute('class', cls);
            a.appendChild(document.createTextNode(text || 'Start tests'));
            a.onclick = yatt.startTests
            document.body.appendChild(a);
        });
    }
}(yatt, document));
