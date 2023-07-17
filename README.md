# Real-time Collaborative Notes Application

This is real-time collaborative notes proof-of-concept.

This monorepo has several modules:

1. `server/` - monolithic Node.JS server, that communicate with clients through WebSocket
   protocol
2. `web/` - React-based client
3. `androidApp/` - Android client
4. `shared/` - shared library that can be used for iOS and Android (contains either pure Kotlin or
   platform specific realization for each platform)
5. `iosApp/` - iOS client (not implemented)

## Overall architecture

Global architecture based on:

1. Event sourcing
2. Command and query segregation (CQRS)
3. Operation Transformation (OT)

## Known limitations

### Monolithic server

Right know server is monolithic, uses in-memory queue and therefore isn't horizontally scalable.
It is probably OK if it has low traffic, up to 100 RPS.

Fortunately, because of server module structure it can be easily improved:

1. in-memory queues can be easily replaced by persistent queues
2. events processing can be easily extracted to separate server

after this improvements it can handle up to tens of thousands RPS.

At this point we can probably use any Message Broker, our team is familiar with,
including Kafka. Probably Message Brokers, which implements AMQP will have better
framework support.

If we want to handle millions RPS, Kafka will be one of the best choices, but we will
need to make some additional improvements on server side, because Database will become
a bottleneck.

### Database

Right now server uses in-memory Sqlite database, in order to start application easier.
But it can easily use any RDBMS.

### Offline mode

Note is not working offline, all offline changes can be lost.
It can be improve with some tweaks with how we store Note data.
Or we can use CRDT data structures.

### Monitoring and tests

Also server hasn't got any monitoring and any tests.

## Installation

JDK 11+ required.

To start the module, please take a look at the corresponding `README.md` file.
