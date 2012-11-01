/*global yatt, assert, app*/
var socket = app.socket.getServer();

yatt.test('Test ok()', function () {
    yatt.logMsg('Assertion methods:');
    assert.ok(5, 'Value is not true');
    yatt.pass();
});

yatt.test('Test equal()', function () {
    assert.equal(10, 10, 'Not equal');
    yatt.pass();
});

yatt.test('Test notEqual()', function () {
    assert.notEqual(10, 5, 'Values are equal');
    yatt.pass();
});

yatt.test('Test strictEqual()', function () {
    assert.strictEqual(5, 5, 'Not strictEqual');
    yatt.pass();
});

yatt.test('Test notStrictEqual()', function () {
    assert.notStrictEqual(false, 0, 'Values are strict equal');
    yatt.pass();
});

yatt.test('Test deepEqual()', function () {
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
});

yatt.test('Test notDeepEqual()', function () {
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
});

yatt.test('Test throws()', function () {
    function UserException(message) {
        this.message = message;
        this.name = "UserException";
    }
    function throwFunc() {
        throw new UserException('Exception message');
    }
    assert.throws(throwFunc, UserException, 'Missing exception');
    yatt.pass();
});

yatt.test('Test doesNotThrow()', function () {
    assert.doesNotThrow(function () { }, 'Unexpected error');
    yatt.pass();
});

yatt.test('Get User', function () {
    yatt.logMsg('Socket.io mock.');
    var userdata = {
        id: 1,
        name: "User1",
        rank: 1055,
        userpic: "userpic.png"
    };
    socket.emit('setUser', userdata);
    assert.deepEqual(userdata, app.user, 'Userdata doesn\'t match');
    yatt.pass();
});

yatt.test('userList', function () {
    yatt.logMsg('Async test.');
    socket.once('getUserList', function () {
        socket.emit('setUserList', [{id: 1, userpic: "userpic.png", name: "User1", rank: 1055},
                                    {id: 2, userpic: "userpic.png", name: "User2", rank: 971},
                                    {id: 3, userpic: "userpic.png", name: "User3", rank: 1000 }]);
        assert.equal(jQuery('#users li').length, 2, 'Exactly two users sshould be rendered');
        yatt.pass();
    });
    socket.emit('ready');
});