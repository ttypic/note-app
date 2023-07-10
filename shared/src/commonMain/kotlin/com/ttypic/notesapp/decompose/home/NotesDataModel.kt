package com.ttypic.notesapp.decompose.home

data class NoteUpdate(
    val nextText: String,
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