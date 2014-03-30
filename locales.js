// This is nashorn port of
// https://gist.github.com/brunoborges/9864750#file-foo-java
// by @brunoborges

// Java classes used
var Arrays = Java.type("java.util.Arrays")
var Collectors = Java.type("java.util.stream.Collectors")
var JString = Java.type("java.lang.String")
var Locale = Java.type("java.util.Locale")

var formatStr = "Country : %s \t\t\t\t:\t Country Code : %s"

// Nashorn allows script functions to be passed
// whereever Java8 lambdas are expected.

// Nashorn also supports "expression closures" supported by
// Mozilla JavaScript 1.8 version. See also
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/New_in_JavaScript/1.8

// The following prints locales in (country) display name order
var list = Arrays.asList(Locale.getISOCountries())
    .stream()
    .map(function(x) new Locale("", x))
    .sorted(function(c0, c1) c0.displayCountry.compareTo(c1.displayCountry))
    .map(function(l) JString.format(formatStr, l.displayCountry, l.country))
    .collect(Collectors.toList())

list.forEach(print)
