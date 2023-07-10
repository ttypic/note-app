package com.ttypic.notesapp.decompose.home

fun applyUpdate(text: String, startSelection: Int, endSelection: Int, replacement: String) =
    text.substring(0, startSelection) + replacement + text.substring(endSelection)