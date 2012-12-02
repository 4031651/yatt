/*global yatt, assert*/
yatt.suite('dialogs')
.test('alert', function () {
    yatt.alert(function (text) {
        assert.equal(text, 'test alert');
        alert('Restored.')
        yatt.pass();
    });
    alert('test alert');
})
.test('confirm', function () {
    yatt.confirm(true, function (text) {
        assert.equal(text, 'test confirm: Ok');
        yatt.logMsg('Confirm: Sey Ok');
    });
    var res = confirm('test confirm: Ok');
    assert.ok(res, 'Result sould be true');

    yatt.confirm(false, function (text) {
        assert.equal(text, 'test confirm: Cancel');
        yatt.logMsg('Confirm: Sey Cancel');
    });
    res = confirm('test confirm: Cancel');
    assert.ok(!res, 'Result sould be false');

    confirm('Restored.');
    yatt.pass();
})
.test('prompt', function () {
    yatt.prompt('text', function (text, val) {
        assert.equal(text, 'test prompt');
        assert.equal(val, 'prompt');
        yatt.logMsg('Prompt: Sey Ok');
    });
    var res = prompt('test prompt', 'prompt');
    assert.equal(res, 'text');

    yatt.prompt(null, function (text) {
        assert.equal(text, 'test prompt');
        yatt.logMsg('Prompt: Sey Cancel');
    });
    var res = prompt('test prompt');
    assert.strictEqual(res, null);
    prompt('Restored.');
    yatt.pass();
});