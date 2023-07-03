package com.ttypic.notesapp

interface Platform {
    val name: String
}

expect fun getPlatform(): Platform