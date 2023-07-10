package com.ttypic.notesapp.decompose.notelist

import com.arkivanov.decompose.ComponentContext
import com.arkivanov.decompose.value.Value
import com.arkivanov.decompose.value.operator.map
import com.ttypic.notesapp.decompose.home.Note
import com.ttypic.notesapp.decompose.home.NotesDataModel

interface NoteListComponent {
    val model: Value<Model>

    val onLogoutClicked: () -> Unit
    val onNoteSelected: (noteId: String) -> Unit

    data class Model(
        val notes: List<Note> = listOf(),
        val sharedNotes: List<Note> = listOf(),
    )
}

class DefaultNoteListComponent(
    componentContext: ComponentContext,
    notesDataModel: Value<NotesDataModel>,
    override val onLogoutClicked: () -> Unit,
    override val onNoteSelected: (noteId: String) -> Unit,
) : NoteListComponent, ComponentContext by componentContext {

    override val model: Value<NoteListComponent.Model> = notesDataModel.map {
        NoteListComponent.Model(it.notes, it.sharedNotes)
    }
}