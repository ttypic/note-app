package com.ttypic.notesapp.decompose.signin

import com.arkivanov.decompose.ComponentContext
import com.arkivanov.decompose.value.MutableValue
import com.arkivanov.decompose.value.Value
import com.arkivanov.decompose.value.update
import com.ttypic.notesapp.decompose.coroutineScope
import io.ktor.client.*
import io.ktor.client.call.*
import io.ktor.client.request.*
import io.ktor.client.statement.*
import io.ktor.http.*
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.launch
import org.koin.core.component.KoinComponent
import org.koin.core.component.inject

interface SignInComponent {
    val model: Value<Model>
    val onNeedSignUpClicked: () -> Unit
    fun login(username: String, password: String)

    data class Model(
        val loading: Boolean = false,
        val error: Boolean = false,
    )
}

class DefaultSignInComponent(
    componentContext: ComponentContext,
    val onAuthorized: (accessToken: String) -> Unit,
    override val onNeedSignUpClicked: () -> Unit,
) : SignInComponent, ComponentContext by componentContext, KoinComponent {
    private val scope = coroutineScope(Dispatchers.Main + SupervisorJob())

    private val _model = MutableValue(initialValue = SignInComponent.Model())

    private val httpClient: HttpClient by inject()

    override val model: Value<SignInComponent.Model>
        get() = _model

    override fun login(username: String, password: String) {
        _model.update { it.copy(loading = true) }

        scope.launch {
            try {
                val response: HttpResponse = httpClient.post("http://10.0.2.2:8000/auth/login") {
                    contentType(ContentType.Application.Json)
                    setBody(SignInRequest(username, password))
                }
                if (!response.status.isSuccess()) {
                    _model.update { it.copy(loading = false, error = true) }
                } else {
                    _model.update { it.copy(loading = false, error = false) }
                    onAuthorized(response.body<SignInResponse>().accessToken)
                }
            } catch (_: Exception) {
                _model.update { it.copy(loading = false, error = true) }
            }
        }
    }
}

@kotlinx.serialization.Serializable
data class SignInRequest(val username: String, val password: String)

@kotlinx.serialization.Serializable
data class SignInResponse(val accessToken: String)