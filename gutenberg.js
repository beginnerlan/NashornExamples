// Usage: jjs -scripting gutenberg.js

// Simple example that demonstrates reading XML Rss feed
// to generate a HTML file from script and show it by browser

// Java classes used
var Characters = Java.type("javax.xml.stream.events.Characters")
var Factory = Java.type("javax.xml.stream.XMLInputFactory")
var File = Java.type("java.io.File")
var FileWriter = Java.type("java.io.FileWriter")
var PrintWriter = Java.type("java.io.PrintWriter")
var URL = Java.type("java.net.URL")

// read Rss feed from a URL. Returns an array
// of objects having only title and link properties
function readRssFeed(url) {
    var fac = Factory.newInstance()
    var reader = fac.createXMLEventReader(url.openStream())

    // get text content from next event
    function getChars() {
        var result = ""
        var e = reader.nextEvent()
        if (e instanceof Characters) {
            result = e.getData()
        }
        return result
    }

    var items = []
    var title, link
    var inItem = false
    while (reader.hasNext()) {
        var evt = reader.nextEvent()
        if (evt.isStartElement()) {
            var local = evt.name.localPart
            if (local == "item") {
               // capture title, description now
               inItem = true
            }
        
            if (inItem) {
                switch (local) {
                    case 'title':
                        title = getChars()
                        break
                    case 'link':
                        link = getChars()
                        break
                }
            }
        } else if (evt.isEndElement()) {
            var local = evt.name.localPart
            if (local == "item") {
                // one item done, save it in result array
                items.push({ title: title, link: link })
                inItem = false
            }
        }
    }

    return items
}

// generate simple HTML for an RSS feed
function getBooksHtml() {
    var url = new URL("http://www.gutenberg.org/cache/epub/feeds/today.rss")
    var items = readRssFeed(url)

    var str = "<ul>"

    // Nashorn's string interpolation and heredoc
    // support is very handy in generating text content
    // that is filled with elements from runtime objects.
    // We insert title and link in <li> elements here.
    for each (i in items) {
        str += <<EOF
<li>
    <a href="${i.link}">${i.title}</a>
</li>
EOF
    }
    str += "</ul>"
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
