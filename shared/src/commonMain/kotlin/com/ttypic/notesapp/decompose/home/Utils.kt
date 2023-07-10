package com.ttypic.notesapp.decompose.home

import com.benasher44.uuid.uuid4

fun applyUpdate(text: String, startSelection: Int, endSelection: Int, replacement: String) =
    text.substring(0, startSelection) + replacement + text.substring(endSelection)

data class SelectionRange(val start: Int, val end: Int)
data class Diff(val start: Int, val end: Int, val replacement: String)

fun calculateDiff(
    value: String,
    nextValue: String,
    position: SelectionRange,
    nextPosition: SelectionRange,
): Diff {
    val startPrev = position.start
    val endNext = nextPosition.start
    val unchangedEnd = nextValue.length - endNext
    val endPrev = value.length - unchangedEnd

    return if (startPrev > endNext) {
        Diff(endNext, endPrev, "")
    } else {
        Diff(startPrev, endPrev, nextValue.substring(startPrev, endNext))
    }
}

fun applyOpTransform(localChange: LocalNoteChange, externalChange: NoteUpdatedEventData) {
    if (localChange.noteId !== externalChange.noteId) return
    val shift =
        externalChange.replacement.length - (externalChange.endSelection - externalChange.startSelection)
    if (externalChange.endSelection <= localChange.startSelection) {
        localChange.id = uuid4().toString()
        localChange.startSelection = localChange.startSelection + shift
        localChange.endSelection = localChange.endSelection + shift
    }
}
