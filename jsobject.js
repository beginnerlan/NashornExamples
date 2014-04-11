#// Usage: jjs -scripting -cp . jsobject.js

// This sample demonstrats how to expose a
// script friendly object from your java code
// by implementing jdk.nashorn.api.scripting.JSObject

// compile the java program
`javac BufferArray.java`

// print error, if any and exit
if ($ERR != '') {
    print($ERR)
    exit($EXIT)
}

// create BufferArray
var BufferArray = Java.type("BufferArray")
var bb = new BufferArray(10)

// 'magic' methods called to retrieve set/get
// properties on BufferArray instance
var len = bb.length
print("bb.length = " + len)
for (var i = 0; i < len; i++) {
    bb[i] = i*i
}

for (var i = 0; i < len; i++) {
    print(bb[i])
}

// get underlying buffer by calling a method
// on BufferArray magic object

// 'buf' is a function member
print(typeof bb.buf)
var buf = bb.buf()

// use retrieved underlying nio buffer
var cap = buf.capacity()
print("buf.capacity() = " + cap)
for (var i = 0; i < cap; i++) {
   print(buf.get(i))
}
