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
import com.ttypic.notesapp.decompose.RootComponent

@Composable
fun RootContent(component: RootComponent, modifier: Modifier = Modifier) {
    val childStack by component.childStack.subscribeAsState()

    Column(modifier = modifier) {
        Children(
            stack = childStack,
            modifier = Modifier.weight(weight = 1F),
            animation = stackAnimation(fade()),
        ) {
            when (val child = it.instance) {
                is RootComponent.Child.HomeChild -> HomeContent(
                    child.component,
                    Modifier.fillMaxSize()
                )
                is RootComponent.Child.SignInChild -> SignInContent(
                    child.component,
                    Modifier.fillMaxSize()
                )
                is RootComponent.Child.SignUpChild -> SignUpContent(
                    child.component,
                    Modifier.fillMaxSize()
                )
            }
        }
    }
}