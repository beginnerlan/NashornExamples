// Usage: jjs uniqs.js -- <file>
// omit repeated lines and print unique lines
// But this version uses Stream API 

if (arguments.length < 1) {
    print("Usage: jjs uniqs.js -- <file>")
    exit(1)
}

var Files = Java.type("java.nio.file.Files")
var FileSystems = Java.type("java.nio.file.FileSystems")
print('Unique lines:',
   Files
    .lines(FileSystems.default.getPath(arguments[0]))
    .distinct()
    .peek(print)
    .count())
