package com.ttypic.notesapp.decompose.home

import co.touchlab.kermit.Logger
import com.arkivanov.decompose.ComponentContext
import com.arkivanov.decompose.router.stack.ChildStack
import com.arkivanov.decompose.router.stack.StackNavigation
import com.arkivanov.decompose.router.stack.childStack
import com.arkivanov.decompose.router.stack.pop
import com.arkivanov.decompose.router.stack.push
import com.arkivanov.decompose.value.MutableValue
import com.arkivanov.decompose.value.Value
import com.arkivanov.decompose.value.update
import com.arkivanov.essenty.parcelable.Parcelable
import com.arkivanov.essenty.parcelable.Parcelize
import com.benasher44.uuid.uuid4
import com.ttypic.notesapp.decompose.coroutineScope
import com.ttypic.notesapp.decompose.note.DefaultNoteComponent
import com.ttypic.notesapp.decompose.note.NoteComponent
import com.ttypic.notesapp.decompose.notelist.DefaultNoteListComponent
import com.ttypic.notesapp.decompose.notelist.NoteListComponent
import com.ttypic.notesapp.decompose.sharenote.DefaultShareNoteComponent
import com.ttypic.notesapp.decompose.sharenote.NoteShareComponent
import io.ktor.client.*
import io.ktor.client.plugins.websocket.*
import io.ktor.http.*
import io.ktor.websocket.*
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.cancelAndJoin
import kotlinx.coroutines.flow.MutableSharedFlow
import kotlinx.coroutines.flow.launchIn
import kotlinx.coroutines.flow.onEach
import kotlinx.coroutines.launch
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json
import org.koin.core.component.KoinComponent
import org.koin.core.component.inject

interface HomeComponent {
    val childStack: Value<ChildStack<*, Child>>

    sealed class Child {
        class NoteListChild(val component: NoteListComponent) : Child()
        class NoteChild(val component: NoteComponent) : Child()
        class ShareNoteChild(val component: NoteShareComponent) : Child()
    }
}

class DefaultHomeComponent(
    componentContext: ComponentContext,
    private val accessToken: String,
    private val onLogoutClicked: () -> Unit,
) : HomeComponent, ComponentContext by componentContext, KoinComponent {
    private val scope = coroutineScope(Dispatchers.Main + SupervisorJob())
    private val client = HttpClient {
        install(WebSockets)
    }
    private val json: Json by inject()
    private val sendMessageFlow = MutableSharedFlow<String>()

    private val model: MutableValue<NotesDataModel> = MutableValue(NotesDataModel())
    private val noteUpdates = MutableSharedFlow<NoteUpdate>()

    private val localChanges = ArrayDeque<NoteUpdate>()

    init {
        scope.launch {
            client.webSocket(HttpMethod.Get, host = "10.0.2.2", port = 8001, path = "/ws") {
                val messageReceivedRoutine = launch {
                    try {
                        for (message in incoming) {
                            message as? Frame.Text ?: continue
                            val messageText = message.readText()
                            onWsMessage(messageText)
                            Logger.i(messageText)
                        }
                    } catch (e: Exception) {
                        Logger.e("Error while receiving: $e")
                    }
                }

                val messageSendRoutine = sendMessageFlow.onEach {
                    try {
                        send(it)
                        Logger.i(it)
                    } catch (e: Exception) {
                        Logger.e("Error while sending: $e")
                    }
                }.launchIn(scope)

                send("{\"event\": \"authCheckRequest\", \"data\": {\"accessToken\": \"$accessToken\", \"sessionId\": \"${uuid4()}\"}}")

                messageSendRoutine.join()
                messageReceivedRoutine.cancelAndJoin()
            }
            client.close()
        }
    }

    private val navigation = StackNavigation<Config>()

    private val stack =
        childStack(
            source = navigation,
            initialConfiguration = Config.NoteList,
            childFactory = ::child,
        )

    override val childStack: Value<ChildStack<*, HomeComponent.Child>> = stack

    private fun onWsMessage(message: String) {
        scope.launch {
            val parsedType = json.decodeFromString<WsEvent>(message)
            when (parsedType.event) {
                EventType.noteCreated -> {
                    val noteCreated = json.decodeFromString<NoteCreatedEvent>(message)
                    model.update {
                        val local = it.notes.any { note -> note.id == noteCreated.data.noteId }
                        if (local) it else it.copy(
                            notes = it.notes.toMutableList().apply {
                                add(
                                    Note(
                                        id = noteCreated.data.noteId,
                                        userId = noteCreated.data.userId
                                    )
                                )
                            },
                        )
                    }
                }
                EventType.noteUpdated -> {
                    val noteUpdated = json.decodeFromString<NoteUpdatedEvent>(message)
                    val updater = updater@{ note: Note ->
                        if (noteUpdated.data.noteId != note.id) return@updater note
                        val replacement = noteUpdated.data.replacement
                        val startSelection = noteUpdated.data.startSelection
                        val endSelection = noteUpdated.data.endSelection
                        note.copy(
                            text = applyUpdate(
                                note.text,
                                startSelection,
                                endSelection,
                                replacement
                            ),
                            version = noteUpdated.data.noteVersion,
                        )
                    }
                    model.update {
                        it.copy(
                            notes = it.notes.map(updater),
                            sharedNotes = it.sharedNotes.map(updater),
                        )
                    }
//                    const localChange = currentLocalChangeRef.current?.id === data.clientId;
//                    noteIdToVersion.current[data.noteId] = data.noteVersion;
//                    const noteUpdater = (prevNotes: Note[]) => prevNotes.map(it => {
//                        if (it.id !== data.noteId) return it;
//
//                        const serverText = applyUpdate(it.text, data.startSelection, data.endSelection, data.replacement);
//
//                        if (!localChange) {
//                            externalChangesRef.current[data.serverId] = {
//                                    nextText: serverText,
//                                    change: data,
//                            };
//                        }
//
//                        return {
//                            ...it,
//                            text: serverText,
//                            version: data.noteVersion,
//                        } as Note;
//                    });
//                    setNotes(noteUpdater);
//                    setSharedNotes(noteUpdater);
//                    if (currentLocalChangeRef.current === null) return;
//                    if (localChange) {
//                        processNext();
//                        return;
//                    }
//                    if (applyOpTransform(currentLocalChangeRef.current!!, data)) {
//                        localChangesRef.current.unshift(currentLocalChangeRef.current!!);
//                        processNext();
//                    }
//                    localChangesRef.current.forEach(it => applyOpTransform(it, data));
                }
                EventType.noteShared -> {
                    val noteShared = json.decodeFromString<NoteSharedEvent>(message)
                    model.update {
                        it.copy(
                            sharedNotes = it.sharedNotes.toMutableList().apply {
                                add(noteShared.data.note)
                            },
                        )
                    }
                }
                EventType.userConnected -> {
                    val userConnected = json.decodeFromString<UserConnectedEvent>(message)
                    model.update {
                        it.copy(
                            notes = userConnected.data.notes,
                            sharedNotes = userConnected.data.sharedNotes,
                            userId = userConnected.data.userId,
                            username = userConnected.data.username,
                            connectionStatus = ConnectionStatus.connected,
                        )
                    }
                }
                EventType.eventRejected -> {
                }
            }
        }
    }

    private fun child(config: Config, componentContext: ComponentContext): HomeComponent.Child =
        when (config) {
            is Config.NoteList -> HomeComponent.Child.NoteListChild(
                DefaultNoteListComponent(
                    componentContext,
                    model,
                    onLogoutClicked,
                    ::onNoteSelected,
                    ::onAddNoteClicked,
                )
            )
            is Config.Note -> HomeComponent.Child.NoteChild(
                DefaultNoteComponent(
                    componentContext,
                    config.noteId,
                    (model.value.notes + model.value.sharedNotes).find { it.id == config.noteId }?.text
                        ?: "",
                    ::onBackClicked,
                    ::onShareNoteClicked
                )
            )
            is Config.ShareNote -> HomeComponent.Child.ShareNoteChild(
                DefaultShareNoteComponent(
                    componentContext,
                    config.noteId,
                    accessToken,
                    ::onBackClicked,
                )
            )
        }

    private fun onNoteSelected(noteId: String) {
        navigation.push(Config.Note(noteId))
    }

    private fun onBackClicked() {
        navigation.pop()
    }

    private fun onShareNoteClicked(noteId: String) {
        navigation.push(Config.ShareNote(noteId))
    }

    private fun onAddNoteClicked() {
        val noteId = uuid4().toString()
        val userId = model.value.userId
        val note = Note(id = noteId, userId = model.value.userId)
        scope.launch {
            sendMessageFlow.emit(
                json.encodeToString(
                    NoteCreateRequest(
                        event = RequestType.noteCreateRequest.name,
                        data = NoteCreateRequestData(
                            noteId,
                            noteId,
                            userId,
                        )
                    )
                )
            )
        }
        model.update {
            it.copy(
                notes = it.notes + note
            )
        }
        navigation.push(Config.Note(noteId))
    }

    private sealed interface Config : Parcelable {
        @Parcelize
        object NoteList : Config

        @Parcelize
        data class Note(val noteId: String) : Config

        @Parcelize
        data class ShareNote(val noteId: String) : Config
    }

}
