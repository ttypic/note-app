# Real-time Collaborative Notes Application (Server)

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
./gradlew :server-nest:start
```

## Project structure

Projects contains modules:

1. `auth` - handle Authentication and Authorization
2. `db` - handle work with DB
3. `notes` - handle work with Notes (querying, applying changes)
4. `users` - handle work with Users
5. `ws` - handle WebSocket connections
6. `eventstore` - reads, stores, consumes incoming requests
   for notes and broadcasts processed events. (Can be extracted)
