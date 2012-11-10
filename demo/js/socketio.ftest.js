/*global yatt, assert, app*/
var socket = app.socket.getServer();

yatt.suite('Socket.io')
.test('Get User', function () {
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
})
.test('Users List', function () {
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