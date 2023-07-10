package com.ttypic.notesapp.decompose.note

import com.arkivanov.decompose.ComponentContext
import com.benasher44.uuid.uuid4
import com.ttypic.notesapp.decompose.home.ExternalNoteUpdate
import com.ttypic.notesapp.decompose.home.LocalNoteChange
import com.ttypic.notesapp.decompose.home.SelectionRange
import com.ttypic.notesapp.decompose.home.calculateDiff
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.filter

interface NoteComponent {
    val initialText: String
    val noteUpdates: Flow<ExternalNoteUpdate>
    val onGoBackToListClicked: () -> Unit
    fun onLocalChange(
        value: String,
        nextValue: String,
        position: SelectionRange,
        nextPosition: SelectionRange,
    )

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

    override fun onLocalChange(
        value: String,
        nextValue: String,
        position: SelectionRange,
        nextPosition: SelectionRange
    ) {
        val diff = calculateDiff(value, nextValue, position, nextPosition)
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