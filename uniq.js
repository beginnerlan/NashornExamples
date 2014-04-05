// Usage: jjs uniq.js
// or: jjs uniq.js -- <file>

// Unix uniq-like tool - omit repeated lines

var BufferedReader = Java.type("java.io.BufferedReader")
var FileReader = Java.type("java.io.FileReader")
var InputStreamReader = Java.type("java.io.InputStreamReader")
var System = Java.type("java.lang.System")

// use object as set - but insertion order preserved
var uniqueLines = {}
var reader = arguments.length > 0 ?
    new FileReader(arguments[0])  :
    new InputStreamReader(System.in)
reader = new BufferedReader(reader)

// add unique lines
reader.lines().forEach(function(line) {
    uniqueLines[line] = true
})

for (line in uniqueLines) {
    print(line)
}
