package com.ttypic.notesapp.di

import io.ktor.client.*
import io.ktor.client.engine.cio.*
import io.ktor.client.plugins.contentnegotiation.*
import io.ktor.client.plugins.logging.*
import io.ktor.serialization.kotlinx.json.*
import kotlinx.serialization.json.Json
import org.koin.core.context.startKoin
import org.koin.dsl.KoinAppDeclaration
import org.koin.dsl.module

fun initKoin(appDeclaration: KoinAppDeclaration = {}) =
    startKoin {
        appDeclaration()
        modules(commonModule())
    }

/**
 * @suppress because it used in iOS part
 */
@Suppress("unused")
fun initKoin() = initKoin {}

fun commonModule() = module {
    single { createJsonSerializer() }
    single { createHttpClient(get(), enableNetworkLogs = false) }
}

fun createJsonSerializer() =
    Json { isLenient = true; ignoreUnknownKeys = true; useAlternativeNames = false }

fun createHttpClient(jsonSerializer: Json, enableNetworkLogs: Boolean) = HttpClient(CIO) {
    install(ContentNegotiation) {
        json(jsonSerializer)
    }

    if (enableNetworkLogs) {
        install(Logging) {
            logger = Logger.DEFAULT
            level = LogLevel.INFO
        }
    }
}
