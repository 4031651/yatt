YATT - Yet another testing tool.
===================
YATT is a powerful, easy-to-use JavaScript functional festing framework.<br />
version 0.2.2

###Usage
To use yatt you should create a test page. This page is not very different from the page of your application.
On this page you will need to include yatt and necessary mocks. You will also need to write and include to the page
a script which contains your test. Done!
<pre><code>&lt;script src="path/to/mocks/socket.io.js" type="text/javascript">&lt;/script>
&lt;script src="path/to/yatt.js" type="text/javascript">&lt;/script>

&lt;script src="path/to/tests/some.ftest.js" type="text/javascript">&lt;/script>
</code></pre>

###Features
+ Assertions statements
+ Asynchronous tests
+ Suites of a tests
+ Alert/confirm/prompt interaction
+ Custom tests logging (see [logger class](http://4031651.github.com/yatt/api/index.html#yatt_logger_init))
+ Mock for socket.io
+ Emulation of user interaction (eemul)

###Future releases
+ Timeout for tests
+ Mock/Hooking of the jQuery.ajax
+ Extensions for the  browsers
+ Mock/Hooking of the XHR object 