// Usage: jjs -scripting jsadapter_dom.js

// Simple example that demonstrates reading XML Rss feed
// to generate a HTML file from script and show it by browser
// Uses XML DOM parser and DOM element wrapped by script 
// "proxy" (JSAdapter constructor)

// Java classes used
var DocBuilderFac = Java.type("javax.xml.parsers.DocumentBuilderFactory")
var Node = Java.type("org.w3c.dom.Node")
var File = Java.type("java.io.File")
var FileWriter = Java.type("java.io.FileWriter")
var PrintWriter = Java.type("java.io.PrintWriter")

// constants from Node class
var ELEMENT_NODE = Node.ELEMENT_NODE
var TEXT_NODE = Node.TEXT_NODE

// parse XML from uri and return Document
function parseXML(uri) {
    var docBuilder = DocBuilderFac.newInstance().newDocumentBuilder()
    return docBuilder["parse(java.lang.String)"](uri)
}

// get child Elements of given name of the parent element given
function getChildElements(elem, name) {
    var nodeList = elem.childNodes
    var childElems = []
    var len = nodeList.length
    for (var i = 0; i < len; i++) {
        var node = nodeList.item(i)
        if (node.nodeType == ELEMENT_NODE &&
            node.tagName == name) {
            childElems.push(wrapElement(node))
        }
    }

    return childElems
}

// get concatenated child text content of an Element
function getElemText(elem) {
    var nodeList = elem.childNodes
    var len = nodeList.length
    var text = ''
    for (var i = 0; i < len; i++) {
        var node = nodeList.item(i)
        if (node.nodeType == TEXT_NODE) {
            text += node.nodeValue
        } 
    }

    return text
}

// Wrap DOM Element object as a convenient script object
// using JSAdapter. JSAdapter is like java.lang.reflect.Proxy
// in that it allows property access, method calls be trapped
// by 'magic' methods like __get__, __call__.
function wrapElement(elem) {
    if (! elem) {
        return elem
    }
    return new JSAdapter() {
        // getter to expose child elements and attributes by name
        __get__: function(name) {
            if (typeof name == 'string') {
                if (name.startsWith('@')) {
                    var attr = elem.getAttributeNode(name.substring(1))
                    return !attr? undefined : attr.value
                }

                var arr = getChildElements(elem, name)
                if (arr.length == 1) {
                    // single child element, expose as single element
                    return arr[0]
                } else {
                    // multiple children of given name, expose as array
                    return arr
                }
            }
            return undefined
        },

        __call__: function(name) {
            // toString override to get text content of this Element
            if (name == 'toString' || name == 'valueOf') {
                return getElemText(elem)
            }
            return undefined
        }
    }
}

// generate HTML using here-doc and string interpolation
function getBooksHtml() {
    var doc = parseXML("http://www.gutenberg.org/cache/epub/feeds/today.rss")
    // wrap document root Element as script convenient object
    var rss = wrapElement(doc.documentElement)
    print("rss file version " + rss['@version'])

    var str = <<HEAD

<html>
<title>${rss.channel.title}</title>
<body>
<h1>${rss.channel.description}</h1>
<p>
Published on ${rss.channel.pubDate}
</p>

HEAD

    var items = rss.channel.item;
    for each (var i in items) {
        str += <<LIST

<dl>
<dt><a href="${i.link}">${i.title}</a></dt>
<dd>${i.description}</dd>
</dl>

LIST
    }
    str += <<END

</body>
</html>

END
    return str
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

// generate books HTML
var str = getBooksHtml()

// write to file. __DIR__ is directory where
// this script is stored.
var file = new File(__DIR__ + "books.html")
writeTo(file, str)

// show it by desktop browser
try {
    var Desktop = Java.type("java.awt.Desktop")
    Desktop.desktop.browse(file.toURI())
} catch (e) {
    print(e)
}
