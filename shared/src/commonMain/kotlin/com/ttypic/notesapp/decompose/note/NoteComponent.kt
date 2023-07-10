package com.ttypic.notesapp.decompose.note

import com.arkivanov.decompose.ComponentContext
import com.ttypic.notesapp.decompose.home.ExternalNoteUpdate
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.filter

interface NoteComponent {
    val initialText: String
    val noteUpdates: Flow<ExternalNoteUpdate>
    val onGoBackToListClicked: () -> Unit
    fun onShareClicked()
}

class DefaultNoteComponent(
    componentContext: ComponentContext,
    private val noteId: String,
    override val initialText: String,
    allNotesUpdates: Flow<ExternalNoteUpdate>,
    override val onGoBackToListClicked: () -> Unit,
    private val onShareNoteClicked: (noteId: String) -> Unit,
) : NoteComponent, ComponentContext by componentContext {
    override fun onShareClicked() {
        onShareNoteClicked(noteId)
    }

    override val noteUpdates: Flow<ExternalNoteUpdate> =
        allNotesUpdates.filter { it.change.noteId == noteId }

}