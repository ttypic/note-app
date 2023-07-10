package com.ttypic.notesapp.decompose.note

import com.arkivanov.decompose.ComponentContext

interface NoteComponent {
    val initialText: String
    val onGoBackToListClicked: () -> Unit
    fun onShareClicked()
}

class DefaultNoteComponent(
    componentContext: ComponentContext,
    private val noteId: String,
    override val initialText: String,
    override val onGoBackToListClicked: () -> Unit,
    private val onShareNoteClicked: (noteId: String) -> Unit,
) : NoteComponent, ComponentContext by componentContext {
    override fun onShareClicked() {
        onShareNoteClicked(noteId)
    }

}