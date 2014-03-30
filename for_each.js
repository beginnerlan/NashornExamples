// nashorn supports for..each extension supported
// by Mozilla. See also
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for_each...in

var strs = [ "hello", "world" ];
for each (str in strs)
    print(str)

// create a java int[] object
var JArray = Java.type("int[]");
var arr = new JArray(10);

// store squares as values
for (i in arr) 
    arr[i] = i*i

// for .. each on java arrays
print("squares")
for each (i in arr)
    print(i)

var System = Java.type("java.lang.System")

// for..each on java Iterables
// print System properties as name = value pairs
print("System properties")
for each (p in System.properties.entrySet()) {
    print(p.key, "=", p.value)
} 

// print process environment vars as name = value pairs
print("Process environment")
for each (e in System.env.entrySet()) {
    print(e.key, "=", e.value)
}
