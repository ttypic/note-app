package com.ttypic.notesapp.decompose.sharenote

import com.arkivanov.decompose.ComponentContext
import com.ttypic.notesapp.decompose.coroutineScope
import io.ktor.client.*
import io.ktor.client.request.*
import io.ktor.client.statement.*
import io.ktor.http.*
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.launch
import org.koin.core.component.KoinComponent
import org.koin.core.component.inject

interface NoteShareComponent {
    val onGoBack: () -> Unit
    fun shareWith(username: String)
}

class DefaultShareNoteComponent(
    componentContext: ComponentContext,
    private val noteId: String,
    private val accessToken: String,
    override val onGoBack: () -> Unit,
) : NoteShareComponent, ComponentContext by componentContext, KoinComponent {
    private val scope = coroutineScope(Dispatchers.Main + SupervisorJob())
    private val httpClient: HttpClient by inject()

    override fun shareWith(username: String) {
        scope.launch {
            try {
                val response: HttpResponse = httpClient.post("http://10.0.2.2:8000/share") {
                    contentType(ContentType.Application.Json)
                    headers {
                        bearerAuth(accessToken)
                    }
                    setBody(ShareRequest(noteId, username))
                }
                if (response.status.isSuccess()) {
                    onGoBack()
                }
            } catch (_: Exception) {
            }
        }
    }

}

@kotlinx.serialization.Serializable
data class ShareRequest(val noteId: String, val sharedWith: String)
