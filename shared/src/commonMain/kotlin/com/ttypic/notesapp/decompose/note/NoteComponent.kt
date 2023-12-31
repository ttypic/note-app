package com.ttypic.notesapp.decompose.note

import com.arkivanov.decompose.ComponentContext
import com.benasher44.uuid.uuid4
import com.ttypic.notesapp.decompose.home.Diff
import com.ttypic.notesapp.decompose.home.ExternalNoteUpdate
import com.ttypic.notesapp.decompose.home.LocalNoteChange
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.filter

interface NoteComponent {
    val initialText: String
    val noteUpdates: Flow<ExternalNoteUpdate>
    val onGoBackToListClicked: () -> Unit
    fun onLocalChange(diff: Diff)

    fun onShareClicked()
}

class DefaultNoteComponent(
    componentContext: ComponentContext,
    private val noteId: String,
    override val initialText: String,
    allNotesUpdates: Flow<ExternalNoteUpdate>,
    override val onGoBackToListClicked: () -> Unit,
    private val onShareNoteClicked: (noteId: String) -> Unit,
    private val emitLocalChange: (LocalNoteChange) -> Unit,
) : NoteComponent, ComponentContext by componentContext {
    override fun onShareClicked() {
        onShareNoteClicked(noteId)
    }

    override val noteUpdates: Flow<ExternalNoteUpdate> =
        allNotesUpdates.filter { it.change.noteId == noteId }

    override fun onLocalChange(diff: Diff) {
        emitLocalChange(
            LocalNoteChange(
                id = uuid4().toString(),
                noteId = noteId,
                replacement = diff.replacement,
                startSelection = diff.start,
                endSelection = diff.end,
            )
        )
    }

}
