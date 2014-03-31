
// generate/print 100 uniformly distributed random values
// and print summary statistics on it

var DoubleStream = Java.type("java.util.stream.DoubleStream")

// pass script function when a lambda is required
// Math.random passed here for double generator lambda
// print passed to forEach method

DoubleStream
    .generate(Math.random)
    .limit(100)
    .forEach(print)

print(DoubleStream
    .generate(Math.random)
    .limit(100)
    .summaryStatistics())
