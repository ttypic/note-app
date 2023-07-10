package com.ttypic.notesapp.android.components

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.Icon
import androidx.compose.material.IconButton
import androidx.compose.material.MaterialTheme
import androidx.compose.material.Text
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ExitToApp
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import com.arkivanov.decompose.extensions.compose.jetbrains.subscribeAsState
import com.ttypic.notesapp.decompose.notelist.NoteListComponent

@Composable
fun NoteListContent(component: NoteListComponent, modifier: Modifier = Modifier) {
    val model by component.model.subscribeAsState()

    Column(modifier = modifier) {
        Box(
            Modifier
                .fillMaxWidth()
                .padding(16.dp)
        ) {
            Text(
                text = "N",
                style = MaterialTheme.typography.h2,
                modifier = Modifier.padding(start = 16.dp, top = 8.dp, bottom = 4.dp)
            )
            IconButton(
                onClick = { component.onLogoutClicked() },
                modifier = Modifier.align(Alignment.CenterEnd)
            ) {
                Icon(
                    imageVector = Icons.Default.ExitToApp,
                    contentDescription = "Logout"
                )
            }
        }
        Text(
            text = "My notes",
            style = MaterialTheme.typography.h5,
            modifier = Modifier.padding(start = 16.dp, top = 8.dp, bottom = 4.dp)
        )
        LazyColumn {
            items(
                items = model.notes,
                key = { it.id }
            ) { note ->
                val text = note.text.trimStart().split("\n").firstOrNull()
                Row(modifier = Modifier
                    .fillMaxWidth()
                    .clickable {
                        component.onNoteSelected(note.id)
                    }
                    .padding(horizontal = 16.dp, vertical = 4.dp)
                ) {
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                    ) {
                        Text(
                            maxLines = 1,
                            overflow = TextOverflow.Ellipsis,
                            text = if (text.isNullOrBlank()) "Untitled" else text,
                            style = MaterialTheme.typography.subtitle1,
                            color = if (text.isNullOrBlank()) Color.LightGray else Color.Black,
                        )
                    }
                }
            }
        }
        Text(
            text = "Shared with me",
            style = MaterialTheme.typography.h5,
            modifier = Modifier.padding(start = 16.dp, top = 8.dp, bottom = 4.dp)
        )
        LazyColumn {
            items(
                items = model.sharedNotes,
                key = { it.id }
            ) { note ->
                val text = note.text.trimStart().split("\n").firstOrNull()
                Row(modifier = Modifier
                    .fillMaxWidth()
                    .clickable {
                        component.onNoteSelected(note.id)
                    }
                    .padding(horizontal = 16.dp, vertical = 4.dp)
                ) {
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                    ) {
                        Text(
                            maxLines = 1,
                            overflow = TextOverflow.Ellipsis,
                            text = if (text.isNullOrBlank()) "Untitled" else text,
                            style = MaterialTheme.typography.subtitle1,
                            color = if (text.isNullOrBlank()) Color.LightGray else Color.Black,
                        )
                    }
                }
            }
        }
    }

}
