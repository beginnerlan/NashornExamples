// Usage: jjs disassemble.js -- <.class-file-path>

// Simple .class disassembler that uses bundled ObjectWeb ASM
// classes in jdk8. WARNING: Bundled ObjectWeb ASM classes are
// not part of official jdk8 API. It can be changed/removed 
// without notice. So, this script is brittle by design!

// This example demonstrates passing arguments to script
// from jjs command line, nio and ASM usage.

// classes used
var FileSystems = Java.type("java.nio.file.FileSystems")
var Files = Java.type("java.nio.file.Files")
var System = Java.type("java.lang.System")
var PrintWriter = Java.type("java.io.PrintWriter")

// WARNING: uses non-API classes of jdk8!
var ClassReader = Java.type("jdk.internal.org.objectweb.asm.ClassReader")
var TraceClassVisitor = Java.type("jdk.internal.org.objectweb.asm.util.TraceClassVisitor")

// convert file name to Path instance
function path(file) {
    return FileSystems.default.getPath(file)
}

// read all file content as a byte[]
function readAllBytes(file) {
    return Files.readAllBytes(path(file))        
}

// disassemble .class byte[] and prints output to stdout
function disassemble(bytecode) {
    var pw = new PrintWriter(System.out)
    new ClassReader(bytecode).accept(new TraceClassVisitor(pw), 0);
}

// check for command line arg (for .class file name)
if (arguments.length == 0 || !arguments[0].endsWith('.class')) {
    print("Usage: jjs disassemble <.class file>")
    exit(1)
}

// disassemble the given .class file
disassemble(readAllBytes(arguments[0]))
