// Usage: jjs -fx javaastviewer.js -- <.java files>

// This example demonstrates Java subclassing by Java.extend
// and javac Compiler and Tree API. This example also uses
// -fx and javafx TreeView to visualize Java AST as TreeView

if (arguments.length == 0) {
    print("Usage: jjs -fx javaastviewer.js -- <.java files>")
    exit(1)
}

// Java types used
var Enum = Java.type("java.lang.Enum")
var HashSet  = Java.type("java.util.HashSet")
var Name = Java.type("javax.lang.model.element.Name")
var List = Java.type("java.util.List")
var Set  = Java.type("java.util.Set")
var SimpleTreeVisitor = Java.type("com.sun.source.util.SimpleTreeVisitor")
var StringArray = Java.type("java.lang.String[]")
var ToolProvider = Java.type("javax.tools.ToolProvider")
var Tree = Java.type("com.sun.source.tree.Tree")

function javaASTToScriptObject(args) {
    // properties ignored (javac implementation class properties) in AST view.
    // may not be exhaustive - any getAbc would become "abc" property or
    // public field becomes a property of same name.
    var ignoredProps = new HashSet()
    for each (var word in 
        ['extending', 'implementing', 'init', 'mods', 'clazz', 'defs', 
         'expr', 'tag', 'preferredPosition', 'qualid', 'recvparam',
         'restype', 'params', 'startPosition', 'thrown',
         'tree', 'typarams', 'typetag', 'vartype']) {
        ignoredProps.add(word)
    }

    // get the system compiler tool
    var compiler = ToolProvider.systemJavaCompiler

    // get standard file manager
    var fileMgr = compiler.getStandardFileManager(null, null, null)

    // make a list of compilation unit from command line argument file names
    // Using Java.to convert script array (arguments) to a Java String[]
    var compUnits = fileMgr.getJavaFileObjects(Java.to(args, StringArray))

    // create a new compilation task
    var task = compiler.getTask(null, fileMgr, null, null, null, compUnits)

    // subclass SimpleTreeVisitor - converts Java AST node to
    // a simple script object by walking through it
    var ConverterVisitor = Java.extend(SimpleTreeVisitor)

    var visitor = new ConverterVisitor() {
        // convert java AST node to a friendly script object
        // which can be viewed. Every node ends up in defaultAction 
        // method of SimpleTreeVisitor method.

        defaultAction: function (node, p) {
            var resultObj = {}
            // Nashorn does not iterate properties and methods of Java objects
            // But, we can bind properties of any object (including java objects)
            // to a script object and iterate it!
            var obj = {}
            Object.bindProperties(obj, node)

            // we don't want every property, method of java object
            for (var prop in obj) {
                var val = obj[prop]
                var type = typeof val
                // ignore 'method' members
                if (type == 'function' || type == 'undefined') {
                    continue
                }

                // ignore properties from Javac implementation
                // classes - hack by name!!
                if (ignoredProps.contains(prop)) {
                    continue
                }

                // subtree - recurse it
                if (val instanceof Tree) {
                    resultObj[prop] = visitor.visit(val, p)
                } else if (val instanceof List) {
                    // List of trees - recurse each and make an array
                    var len = val.size()
                    if (len != 0) {
                        var arr = []
                        for (var j = 0; j < len; j++) {
                            var e = val[j]
                            if (e instanceof Tree) {
                                arr.push(visitor.visit(e, p))
                            }
                        }
                        resultObj[prop] = arr
                    }
                } else if (val instanceof Set) {
                    // Set - used for modifier flags
                    // make array
                    var len = val.size()
                    if (len != 0) {
                        var arr = []
                        for each (var e in val) {
                            if (e instanceof Enum || typeof e == 'string') {
                                arr.push(e.toString())
                            }
                        }
                        resultObj[prop] = arr
                    }
                } else if (val instanceof Enum || val instanceof Name) {
                    // make string for any Enum or Name
                    resultObj[prop] = val.toString()
                } else if (type != 'object') {
                    // primitives 'as is'
                    resultObj[prop] = val
                }
            }
            return resultObj
        }
    }

    // top level object with one property for each compilation unit
    var scriptObj = {}
    for each (var cu in task.parse()) {
        scriptObj[cu.sourceFile.name] = cu.accept(visitor, null)
    }

    return scriptObj
}

// JavaFX classes used
var StackPane = Java.type("javafx.scene.layout.StackPane")
var Scene     = Java.type("javafx.scene.Scene")
var TreeItem  = Java.type("javafx.scene.control.TreeItem")
var TreeView  = Java.type("javafx.scene.control.TreeView")

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
           var subitem = treeItemForObject(node, prop)
       } else {
           var subitem = new TreeItem(prop + ": " + node)
       }
       item.children.add(subitem)
    }

    item.expanded = true
    return item
}

var commandArgs = arguments;

// JavaFX start method
function start(stage) {
    var obj = javaASTToScriptObject(commandArgs)
    stage.title = "Java AST Viewer"
    var rootItem = treeItemForObject(obj, "AST")
    rootItem.expanded = true
    var tree = new TreeView(rootItem)
    var root = new StackPane()
    root.children.add(tree)
    stage.scene = new Scene(root, 300, 450)
    stage.show()
}
