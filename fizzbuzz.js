// What is FizzBuzz? http://c2.com/cgi/wiki?FizzBuzzTest

// Yet another FizzBuzz impl. using Java 8 lambda and stream
// but using Nashorn. This is ECMAScript port of
// Java impl https://gist.github.com/stuart-marks by @stuartmarks

var IntStream = Java.type("java.util.stream.IntStream");

function ifmod(m, r, f) {
    return function(i) { return i % m == 0? r : f(i) }
}

// pass script function for lambda
IntStream.rangeClosed(1, 100).
   mapToObj(
      ifmod(15, "FizzBuzz", ifmod(5, "Buzz", ifmod(3, "Fizz", String))))
      .forEach(print);
