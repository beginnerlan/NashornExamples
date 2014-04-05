// Usage: jjs shell.js

// Simple Shell program using nashorn
(function() {
    // Java classes used
    var Arrays = Java.type("java.util.Arrays")
    var BufferedReader = Java.type("java.io.BufferedReader")
    var InputStreamReader = Java.type("java.io.InputStreamReader")
    var ProcessBuilder = Java.type("java.lang.ProcessBuilder")
    var Redirect = Java.type("java.lang.ProcessBuilder.Redirect")
    var System = Java.type("java.lang.System")

    // print prompt
    function prompt() {
        System.out.print("> ")
    }

    var reader = new BufferedReader(new InputStreamReader(System.in))
    prompt()
    // read and evaluate each line from stdin
    reader.lines().forEach(function(line) {
        if (! line.isEmpty()) {
            var args = line.split(' ')
            try {
                // special 'eval' command to evaluate JS code
                if (args[0] == 'eval') {
                    var code = line.substring('eval'.length)
                    var res = eval(code)
                    if (res != undefined) {
                        print(res)
                    }
                } else {
                    // build child process and start it!
                    var procBuilder = 
                        new ProcessBuilder(Arrays.asList(args))
                            .redirectInput(Redirect.INHERIT)
                            .redirectOutput(Redirect.INHERIT)
                            .redirectError(Redirect.INHERIT)
                    var p = procBuilder.start()
                    p.waitFor()
                }
            } catch (e) {
                // print exception, if any
                print(e)
            }
        }
        prompt()
    })
})()
