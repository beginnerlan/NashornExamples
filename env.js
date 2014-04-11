#// Usage: jjs -scripting env.js

// In nashorn -scripting mode, 
// "$ENV" object exposes process 
// environment variables

print($ENV.PATH)
print($ENV.JAVA_HOME)

for (i in $ENV) {
   print(i, "->", $ENV[i])
}
