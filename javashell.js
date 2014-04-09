// Usage: jjs -scripting javashell.js

// Simple Java "shell" with which you can try out
// your few liner Java code leaving imports, main etc.
// And you can leave even compilation as this script
// takes care boilerplate+compile step for you.

// Java types used
var Arrays = Java.type("java.util.Arrays")
var BufferedReader = Java.type("java.io.BufferedReader")
var File = Java.type("java.io.File")
var FileWriter = Java.type("java.io.FileWriter")
var InputStreamReader = Java.type("java.io.InputStreamReader")
var PrintWriter = Java.type("java.io.PrintWriter")
var ProcessBuilder = Java.type("java.lang.ProcessBuilder")
var System = Java.type("java.lang.System")

// delete file of given name
function deleteFile(name) {
    new File(name).delete()
}

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
function generate(show) {
    var str = input()
    if (str == "") {
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

public class Main {
   public static void main(String[] args) {
       ${str}
   }
}
EOF

    if (show) {
        print(fullcode)
    }

    writeTo("Main.java", fullcode)
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

// read-compile-run loop
while(true) {
    deleteFile("Main.class")
    if (generate()) {
        exec("javac Main.java")
        exec("java Main")
    } else {
        break
    }
}
