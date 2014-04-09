// Usage: jjs -scripting options.js

// print all option names and values
for (i in $OPTIONS) {
    print(i, '=', $OPTIONS[i])
}
