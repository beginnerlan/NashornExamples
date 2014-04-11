#// Usage: jjs -fx jsonviewer.js
// or
//        jjs -fx jsonviewer.js -- <url-of-json-doc>

if (! $OPTIONS._fx) {
    print("Usage: jjs -fx jsonviewer.js -- <url-of-json-doc>")
    exit(1)
}

// This example downloads a JSON file from a URL and
// shows the same as a JavaFX tree view.

// Using JavaFX from Nashorn. See also:
// http://docs.oracle.com/javase/8/docs/technotes/guides/scripting/nashorn/javafx.html

// JavaFX classes used
var StackPane = Java.type("javafx.scene.layout.StackPane")
var Scene     = Java.type("javafx.scene.Scene")
var TreeItem  = Java.type("javafx.scene.control.TreeItem")
var TreeView  = Java.type("javafx.scene.control.TreeView")

// read text content of a URL
function readTextFromURL(url) {
    // equivalent to 
    // 
    //    import java.io.*;
    //    import java.net.*;
    //    import java.lang.StringBuffer;
    //
    // only inside the 'with' statement
    with (new JavaImporter(java.io,
        java.net,
        java.lang.StringBuilder)) {
        var buf = new StringBuilder()
        var u = new URL(url)
        var reader = new BufferedReader(
            new InputStreamReader(u.openStream()))
        var line = null
        try {
            while ((line = reader.readLine()) != null)
                buf.append(line).append('\n')
        } finally {
            reader.close()
        }

        return buf.toString()
    }
}

// Create a javafx TreeItem to view a script object
function treeItemForObject(obj, name) {
    var item = new TreeItem(name)
    for (var prop in obj) {
       var node = obj[prop]
       if (typeof node == 'object') {
           if (node == null) {
               // skip nulls
               continue;
           }

           if (Array.isArray(node) && node.length == 0) {
               // skip empty arrays
               continue
           }

           var subitem = treeItemForObject(node, prop)
       } else {
           var subitem = new TreeItem(prop + ": " + node)
       }
       item.children.add(subitem)
    }
    return item
}

var DEFAULT_URL = "http://api.openweathermap.org/data/2.5/forecast/daily?q=Chennai&amp;mode=json&amp;units=metric&amp;cnt=7`"

var url = arguments.length == 0? DEFAULT_URL : arguments[0]
var obj = JSON.parse(readTextFromURL(url))

// JavaFX start method
function start(stage) {
    stage.title = "JSON Viewer"
    var rootItem = treeItemForObject(obj, url)
    var tree = new TreeView(rootItem)
    var root = new StackPane()
    root.children.add(tree)
    stage.scene = new Scene(root, 300, 450)
    stage.show()
}
