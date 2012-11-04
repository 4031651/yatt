YATT - Yet another testing tool.
===================
YATT is a powerful, easy-to-use JavaScript functional festing framework.

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
+ Mock for socket.io (partial implementation)
+ emulation of user interaction (eemul)

###Future releases
+ Add a test suites
+ Add alert/confirm/prompt interaction
+ Refactor the loger
+ Full implementation of the socket.io mock
+ Mock/Hooking of the jQuery.ajax
+ Extensions for the  browsers
+ Mock/Hooking of the XHR object 