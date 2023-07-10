# Real-time Collaborative Notes Application (Web Client)

Web client is Typescript React application, that:

1. connect to the server using WebSocket protocol
2. stream local changes to the server
3. listen to external changes and apply it

## Installation

if `Node` installed:

```shell
npm install
npm start
```

or if `Node` haven't installed:

1. Uncomment in `build.gradle.kts`

```kotlin
    // version.set("16.19.0")
// download.set(true)
```

2. Run

```shell
./gradlew :web:start
```