package com.ttypic.notesapp.android.components

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.height
import androidx.compose.material.Icon
import androidx.compose.material.IconButton
import androidx.compose.material.MaterialTheme
import androidx.compose.material.Text
import androidx.compose.material.TopAppBar
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.Share
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import com.ttypic.notesapp.decompose.note.NoteComponent

@Composable
fun NoteContent(component: NoteComponent, modifier: Modifier = Modifier) {
    Column(modifier) {
        TopAppBar(
            modifier = Modifier.height(56.dp),
            backgroundColor = Color.White,
            elevation = 4.dp
        ) {
            IconButton(
                onClick = component.onGoBackToListClicked
            ) {
                Icon(
                    imageVector = Icons.Default.ArrowBack,
                    contentDescription = "Back"
                )
            }
            Text(
                text = "",
                modifier = Modifier.weight(1f),
                style = MaterialTheme.typography.h6
            )
            IconButton(
                onClick = { component.onShareClicked() }
            ) {
                Icon(
                    imageVector = Icons.Default.Share,
                    contentDescription = "Share"
                )
            }
        }

        Text(text = component.initialText)
    }
}