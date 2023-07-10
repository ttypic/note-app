package com.ttypic.notesapp.decompose.home

import kotlinx.serialization.Serializable

@Serializable
@Suppress("EnumEntryName")
enum class EventType {
    noteCreated,
    noteUpdated,
    noteShared,
    userConnected,
    eventRejected,
}

@Suppress("EnumEntryName")
enum class RequestType {
    authCheckRequest,
    noteCreateRequest,
    noteUpdateRequest,
}

@Serializable
data class WsEvent(val event: EventType)

@Serializable
data class Note(
    val id: String,
    val userId: Int,
    val text: String = "",
    val version: Int = 0
)

@Serializable
data class NoteCreatedEvent(val data: NoteCreatedEventData)

@Serializable
data class NoteCreatedEventData(
    val userId: Int,
    val noteId: String,
)

@Serializable
data class NoteUpdatedEvent(val data: NoteUpdatedEventData)

@Serializable
data class NoteUpdatedEventData(
    val userId: Int,
    val noteId: String,
    val noteVersion: Int,
    val replacement: String,
    val startSelection: Int,
    val endSelection: Int,
)

@Serializable
data class NoteSharedEvent(val data: NoteSharedEventData)

@Serializable
data class NoteSharedEventData(val note: Note)

@Serializable
data class UserConnectedEvent(val data: UserConnectedEventData)

@Serializable
data class UserConnectedEventData(
    val notes: List<Note>,
    val sharedNotes: List<Note>,
    val userId: Int,
    val username: String,
)

@Serializable
data class NoteCreateRequest(
    val event: String,
    val data: NoteCreateRequestData,
)

@Serializable
data class NoteCreateRequestData(
    val id: String,
    val noteId: String,
    val userId: Int,
)