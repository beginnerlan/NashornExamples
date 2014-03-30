// nashorn allows you treat every Java8 lambda as a function

var JFunction = Java.type("java.util.function.Function")
var obj = new JFunction() {
    apply: function(x) {
        print(x + ", lambda")
    }
}

// prints 'function'
print(typeof obj)

// call it!
obj("hello")
