/*global yatt, assert*/

// Add a button that runs the tests.
yatt.setStartButton('Start tests', 'yatt_start');

yatt.test('Test w/o suite', function () {
    yatt.pass();
});

yatt.suite('assertion')
.test('Test ok()', function () {
    yatt.logMsg('Assertion methods:');
    assert.ok(5, 'Value is not true');
    yatt.pass();
})
.test('Test equal()', function () {
    assert.equal(10, 10, 'Not equal');
    yatt.pass();
})
.test('Test notEqual()', function () {
    assert.notEqual(10, 5, 'Values are equal');
    yatt.pass();
})
.test('Test strictEqual()', function () {
    assert.strictEqual(5, 5, 'Not strictEqual');
    yatt.pass();
})
.test('Test notStrictEqual()', function () {
    assert.notStrictEqual(false, 0, 'Values are strict equal');
    yatt.pass();
})
.test('Test deepEqual()', function () {
    var actual = {
        a: 1,
        b: true,
        c: {
            a: 2
        },
        d: [1, 2, 3, '4']
    };
    var expected = {
        a: 1,
        b: true,
        c: {
            a: 2
        },
        d: [1, 2, 3, '4']
    };
    assert.deepEqual(actual, expected, 'Not deep equal');
    yatt.pass();
})
.test('Test notDeepEqual()', function () {
    var actual = {
        a: 1,
        b: true,
        c: {
            a: 2
        },
        d: [1, 2, 3, '4']
    };
    var expected = {
        a: 1,
        b: true,
        c: {
            a: 2
        },
        d: [1, 2, 3, '7']
    };
    assert.notDeepEqual(actual, expected, 'Values are deep equal');
    yatt.pass();
})
.test('Test throws()', function () {
    function UserException(message) {
        this.message = message;
        this.name = "UserException";
    }
    function throwFunc() {
        throw new UserException('Exception message');
    }
    assert.throws(throwFunc, UserException, 'Missing exception');
    yatt.pass();
})
.test('Test doesNotThrow()', function () {
    assert.doesNotThrow(function () { }, 'Unexpected error');
    yatt.pass();
});
