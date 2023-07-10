package com.ttypic.notesapp.decompose.home

data class ExternalNoteUpdate(
    val nextText: String,
    val change: NoteUpdatedEventData,
)

data class LocalNoteChange(
    var id: String,
    val noteId: String,
    val replacement: String,
    var startSelection: Int,
    var endSelection: Int,
)

@Suppress("EnumEntryName")
enum class ConnectionStatus {
    idle,
    connecting,
    connected,
    disconnected,
}

data class NotesDataModel(
    /**
     * User's notes
     */
    val notes: List<Note> = listOf(),
    /**
     * Shared with user notes
     */
    val sharedNotes: List<Note> = listOf(),
    /**
     * Connection to the server status
     */
    val connectionStatus: ConnectionStatus = ConnectionStatus.idle,
    /**
     * User ID
     */
    val userId: Int = 0,
    /**
     * Username
     */
    val username: String = "",
    /**
     * JWT access token
     */
    val accessToken: String = "",
)