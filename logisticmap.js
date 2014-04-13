#// Usage: jjs -fx -scripting logisticmap.js -- <initial_x> <R>

// Logistic map viewer using Java8 Streams and JavaFX
// See also http://en.wikipedia.org/wiki/Logistic_map

if (!$OPTIONS._fx || arguments.length < 2) {
    print("Usage: jjs -fx -scripting logisticmap.js -- <initial_x> <R>")
    exit(1)
}

// parameters for the logistic map
var x = parseFloat(arguments[0])
var R = parseFloat(arguments[1])
var NUM_POINTS = arguments.length > 2? parseFloat(arguments[2]) : 200

// Java classes used
var DoubleStream = Java.type('java.util.stream.DoubleStream')
var LineChart = Java.type("javafx.scene.chart.LineChart")
var NumberAxis = Java.type("javafx.scene.chart.NumberAxis")
var Scene = Java.type("javafx.scene.Scene")
var Stage = Java.type("javafx.stage.Stage")
var XYChart = Java.type("javafx.scene.chart.XYChart")

function start(stage) {
    stage.title = "Logistic Map: initial x = ${x}, R = ${R}"
    // make chart
    var xAxis = new NumberAxis()
    var yAxis = new NumberAxis()
    var lineChart = new LineChart(xAxis, yAxis)
    xAxis.setLabel("iteration")
    yAxis.setLabel("x")
    // make chart data series
    var series = new XYChart.Series()
    var data = series.data
    // populate data using logistic iteration
    var i = 0 
    DoubleStream
        .generate(function() x = R*x*(1-x))
        .limit(NUM_POINTS)
        .forEach(
            function(value) {
                data.add(new XYChart.Data(i, value))
                i++
            }
         )
    // add to stage
    var scene = new Scene(lineChart, 800, 600)
    lineChart.data.add(series)
    stage.scene = scene
    stage.show() 
}
