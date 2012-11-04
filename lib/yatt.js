/*global jQuery*/
/**
 * A JavaScript Functional Testing framework.
 * Licensed under the MIT license.
 * Use code from https://github.com/joyent/node/blob/master/lib/assert.js
 *
 * @author Sergey Tsapenko <4031651@gmail.com>
 * @version  0.2
 */
var assert = {};

(function (assert) {
var pSlice = Array.prototype.slice;

    /**
     * Test that expr is true (not enpty).
     *
     * @param {Mixed}  value   Tested value
     * @param {String} message Message if the assertion failed
     */
    assert.ok = function (value, message) {
        if (!!!value) {
            assert.fail(value, true, message, '==', assert.ok);
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
            assert.fail(actual, expected, message, '==', assert.equal);
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
            assert.fail(actual, expected, message, '!=', assert.notEqual);
        }
    };

    /**
     * @private
     */
    assert.fail = function (actual, expected, message, operator) {
        message = message || 'Failes';
        yatt.print('<div style="color:red;">' + message + '</div>');
        yatt.print('<pre style="color:red;">    actual: ' + actual + "\n    expected: " + expected + "\n    operator: " + operator + '</pre>');
        yatt.queue.fail();
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
            assert.fail(actual, expected, message, '===', assert.strictEqual);
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
            assert.fail(actual, expected, message, '!==', assert.notStrictEqual);
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
                assert.fail(actual, expected, message, 'deepEqual', assert.deepEqual);
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
                assert.fail(actual, expected, message, 'notDeepEqual', assert.notDeepEqual);
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
}(assert))

var yatt = {};

(function () {
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
        var idx = yatt.queue.current + 0,
            len = yatt.tests.length;

        if (yatt.queue.current < len) {
            var suite = yatt.tests[idx].suite ? '(' + yatt.tests[idx].suite + ')' : '';
            yatt.print('<div id="test_' + idx + '" style="font-weight: bold;">' + (idx + 1) + ' of ' + len + ': ' + suite + yatt.tests[idx].name + '</div>');
            yatt.tests[idx].fn();
        } else {
            yatt.print('<h3 style="margin: 0;">Done</h3>');
        }
    };
    /**
     * @private
     */
    yatt.queue.pass = function () {
        if (yatt.queue.failed) {
            return;
        }

        jQuery('#test_log #test_' + yatt.queue.current, yatt.testsWin.document).css('color', 'green').append(' - Ok');
        yatt.queue.current += 1;

        window.setTimeout(yatt.queue.next, 0);
    };
    /**
     * @private
     */
    yatt.queue.fail = function () {
        yatt.queue.failed = true;
        yatt.queue.clearWaits();
        jQuery('#test_log #test_' + yatt.queue.current, yatt.testsWin.document).css('color', 'red').append(' - Fail');
    };

    /**
     * Wrapper function around window.setTimeout. Reserved for future use.
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
        yatt.print('<div style="color:red;">' + message + '</div>');
        yatt.queue.fail();
    };
    /**
     * @private
     */
    yatt.print = function (s) {
        jQuery('#test_log', yatt.testsWin.document).append(s);
        jQuery('#test_results', yatt.testsWin.document).scrollTop(999999);
    };
    /**
     * Print message to a test results.
     *
     * @param {String} msg error message
     */
    yatt.logMsg = function (msg) {
        yatt.print('<div class="msg">-&gt; ' + msg + '</div>');
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
     * @return {suite} Suite object. This object has one method test()
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
     * @private
     */
    yatt.testsWin = null;
    
    /**
     * Start all tests.
     */
    yatt.startTests = function () {
        if (!yatt.testsWin) {
            yatt.testsWin = window.open('tests.html', 'tests', 'dependent=yes,location=no,menubar=no,status=no,width=500');
            jQuery(yatt.testsWin).ready(yatt.startTests);
            return;
        }
        jQuery('#test_log', yatt.testsWin.document).empty();
        yatt.queue.clearWaits();
        yatt.queue.current = 0;
        yatt.queue.failed  = false;
        window.setTimeout(yatt.queue.next, 1000);
    };
}(yatt));

jQuery(function () {
    var a = jQuery('<a id="yatt_start">Start test</a>').click(yatt.startTests);
    jQuery('body').append(a);
});