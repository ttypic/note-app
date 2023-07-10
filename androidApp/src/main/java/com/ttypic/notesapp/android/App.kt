package com.ttypic.notesapp.android

import android.app.Application
import com.ttypic.notesapp.di.initKoin
import org.koin.android.ext.koin.androidContext
import org.koin.android.ext.koin.androidLogger
import org.koin.core.logger.Level

class App : Application() {
    override fun onCreate() {
        super.onCreate()
        // Start Koin
        initKoin {
            androidLogger(Level.ERROR)
            androidContext(this@App)
        }
    }
}