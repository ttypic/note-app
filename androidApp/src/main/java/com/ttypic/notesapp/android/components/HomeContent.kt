package com.ttypic.notesapp.android.components

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import com.arkivanov.decompose.extensions.compose.jetbrains.stack.Children
import com.arkivanov.decompose.extensions.compose.jetbrains.stack.animation.fade
import com.arkivanov.decompose.extensions.compose.jetbrains.stack.animation.stackAnimation
import com.arkivanov.decompose.extensions.compose.jetbrains.subscribeAsState
import com.ttypic.notesapp.decompose.home.HomeComponent

@Composable
fun HomeContent(component: HomeComponent, modifier: Modifier = Modifier) {
    val childStack by component.childStack.subscribeAsState()

    Column(modifier = modifier) {
        Children(
            stack = childStack,
            modifier = Modifier.weight(weight = 1F),
            animation = stackAnimation(fade()),
        ) {
            when (val child = it.instance) {
                is HomeComponent.Child.NoteChild -> NoteContent(
                    child.component,
                    Modifier.fillMaxSize()
                )
                is HomeComponent.Child.NoteListChild -> NoteListContent(
                    child.component,
                    Modifier.fillMaxSize()
                )
                is HomeComponent.Child.ShareNoteChild -> NoteShareContent(
                    child.component,
                    Modifier.fillMaxSize()
                )
            }
        }
    }
}