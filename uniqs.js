// Usage: jjs uniqs.js -- <file>
// Unix uniq-like tool - omit repeated lines
// But this version uses Stream API 

if (arguments.length < 1) {
    print("Usage: jjs uniqs.js -- <file>")
    exit(1)
}

var Files = Java.type("java.nio.file.Files")
var FileSystems = Java.type("java.nio.file.FileSystems")
var stream = Files.lines(FileSystems.default.getPath(arguments[0]))
try {
   stream.distinct().forEach(print)
} finally {
   stream.close()
}
