/*global io, tmpl*/
function App() {
    this.init();
}
jQuery.extend(App.prototype, {
    socket: io.connect('url/to/socket'),
    user: {},

    init: function () {
        this.socket
            .on('setUser', this.setUser.bind(this))
            .on('ready', function () {
                this.socket.emit('getUserList');
            }.bind(this))
            .on('setUserList', this.setUserList.bind(this));
    },
    setUser: function (data) {
        this.user = data;
        this.renderUser(jQuery('#user-info'), data);
    },
    setUserList: function (users) {
        var me = this.user;
        this.userList = users.filter(function (u) {
            return u.id != me.id;
        });

        jQuery('#users').html(tmpl('userlist', {users: this.userList}));
    },
    renderUser: function ($root, user) {
        $root.find('#name').text(user.name);
        $root.find('#rank').text(user.rank);
        $root.find('#pictext').text('User #' + user.id);
        $root.find('#userpic').attr('src', 'img/' + user.userpic);
    }
});

var app = new App();
