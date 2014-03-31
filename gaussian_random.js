// print 100 Guassian distributed numbers

var Random = Java.type("java.util.Random")
var DoubleStream = Java.type("java.util.stream.DoubleStream")

var r = new Random()

// closure expression (see closure_expression.js as well)
// passed as lambda double generator. "print" passed as 
// double consumer lambda to 'forEach' method.

DoubleStream
    .generate(function() r.nextGaussian())
    .limit(100)
    .forEach(print)
