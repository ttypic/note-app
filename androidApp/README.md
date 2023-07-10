# Real-time Collaborative Notes Application (Android)

## Installation

Open Android Studio and run application in emulator.

For now only simulator will work, server host is hardcoded as localhost IP `10.0.2.2`

## Tech Stack

All business-logic implemented in `shared` module and can be reused in
iOS application.

_Decompose_ is using for routing it helps to split logic into lifecycle aware
components. Actual android view layer is very thin.

_Ktor_ is using for Http-calls and WebSocket.

