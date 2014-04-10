// Usage: jjs -scripting javashell.js

// Simple Java "shell" with which you can try out
// your few liner Java code leaving imports, main etc.
// And you can leave even compilation as this script
// takes care boilerplate+compile step for you.

// Java types used
var Arrays = Java.type("java.util.Arrays")
var BufferedReader = Java.type("java.io.BufferedReader")
var FileWriter = Java.type("java.io.FileWriter")
var LocalDateTime = Java.type("java.time.LocalDateTime")
var InputStreamReader = Java.type("java.io.InputStreamReader")
var PrintWriter = Java.type("java.io.PrintWriter")
var ProcessBuilder = Java.type("java.lang.ProcessBuilder")
var System = Java.type("java.lang.System")

// read multiple lines of input from stdin till user
// enters an empty line
function input(endMarker, prompt) {
    if (!endMarker) {
        endMarker = "";
    }

    if (!prompt) {
        prompt = " >> ";
    }

    var str = "";
    var reader = new BufferedReader(new InputStreamReader(System.in));
    var line;
    while (true) {
        System.out.print(prompt);
        line = reader.readLine();
        if (line == null || line == endMarker) {
            break;
        }
        str += line + "\n";
    }
    return str;
}

// write the string to the given file
function writeTo(file, str) {
    var w = new PrintWriter(new FileWriter(file))
    try {
        w.print(str)
    } finally {
        w.close()
    }
}

// generate Java code with user's input
// put inside generated main method
function generate(className) {
    var usercode = input()
    if (usercode == "") {
        return false
    }

    var fullcode = <<EOF
// userful imports, add more here if you want
// more imports.
import static java.lang.System.*;
import java.io.*;
import java.net.*;
import java.time.*;
import java.util.*;
import java.util.function.*;
import java.util.stream.*;

public class ${className} {
   public static void main(String[] args) throws Exception {
       ${usercode}
   }
}
EOF

    writeTo("${className}.java", fullcode)
    return true
}

// execute code command
function exec(args) {
    // build child process and start it!
    new ProcessBuilder(Arrays.asList(args.split(' ')))
         .inheritIO()
         .start()
         .waitFor()
}

// generate unique name
function uniqueName() {
    var now = LocalDateTime.now().toString()
    // replace unsafe chars with '_' 
    return "JavaShell" + now.replace(/-|:|\./g, '_')
}

// read-compile-run loop
while(true) {
    var className = uniqueName()
    if (generate(className)) {
        exec("javac ${className}.java")
        exec("java ${className}")
    } else {
        break
    }
}
