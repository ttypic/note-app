package com.ttypic.notesapp.android.components

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.material.Icon
import androidx.compose.material.IconButton
import androidx.compose.material.MaterialTheme
import androidx.compose.material.Text
import androidx.compose.material.TextField
import androidx.compose.material.TopAppBar
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.Share
import androidx.compose.runtime.Composable
import androidx.compose.runtime.DisposableEffect
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.TextRange
import androidx.compose.ui.text.input.TextFieldValue
import androidx.compose.ui.unit.dp
import com.ttypic.notesapp.decompose.home.SelectionRange
import com.ttypic.notesapp.decompose.note.NoteComponent
import kotlinx.coroutines.flow.launchIn
import kotlinx.coroutines.flow.onEach

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

        val text = remember { mutableStateOf(TextFieldValue(text = component.initialText)) }

        val coroutineScope = rememberCoroutineScope()

        DisposableEffect(Unit) {
            val flowSubscription = component.noteUpdates.onEach {
                var selection = text.value.selection
                if (selection.start >= it.change.endSelection) {
                    val shift =
                        it.change.replacement.length - (it.change.endSelection - it.change.startSelection)
                    selection = TextRange(selection.start + shift, selection.end + shift)
                }
                text.value = TextFieldValue(it.nextText, selection)
            }.launchIn(coroutineScope)

            onDispose {
                flowSubscription.cancel()
            }
        }

        TextField(
            modifier = Modifier
                .fillMaxSize()
                .padding(16.dp),
            value = text.value,
            onValueChange = {
                if (text.value.text != it.text) {
                    component.onLocalChange(
                        text.value.text,
                        it.text,
                        SelectionRange(text.value.selection.start, text.value.selection.end),
                        SelectionRange(it.selection.start, it.selection.end),
                    )
                }
                text.value = it
            },
        )
    }
}