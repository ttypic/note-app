plugins {
    kotlin("multiplatform")
    kotlin("plugin.serialization")
    id("com.android.library")
    id("kotlin-parcelize")
}

kotlin {
    android {
        compilations.all {
            kotlinOptions {
                jvmTarget = "1.8"
            }
        }
    }

    listOf(
        iosX64(),
        iosArm64(),
        iosSimulatorArm64()
    ).forEach {
        it.binaries.framework {
            baseName = "shared"
            isStatic = true
            export(libs.essenty.lifecycle)
            export(libs.decompose)

        }
    }

    sourceSets {
        val commonMain by getting {
            dependencies {
                implementation(libs.coroutines.core)
                implementation(libs.bundles.common.ktor)
                implementation(libs.koin.core)
                implementation(libs.ktor.cio)
                implementation(libs.ktor.websockets)
                implementation(libs.kermit)
                implementation(libs.uuid)
                api(libs.essenty.lifecycle)
                api(libs.decompose)
            }
        }
        val commonTest by getting {
            dependencies {
                implementation(kotlin("test"))
            }
        }
        @Suppress("UNUSED_VARIABLE")
        val androidMain by getting {
        }
        val iosX64Main by getting
        val iosArm64Main by getting
        val iosSimulatorArm64Main by getting
        @Suppress("UNUSED_VARIABLE")
        val iosMain by creating {
            dependsOn(commonMain)
            iosX64Main.dependsOn(this)
            iosArm64Main.dependsOn(this)
            iosSimulatorArm64Main.dependsOn(this)
        }
        val iosX64Test by getting
        val iosArm64Test by getting
        val iosSimulatorArm64Test by getting
        @Suppress("UNUSED_VARIABLE")
        val iosTest by creating {
            dependsOn(commonTest)
            iosX64Test.dependsOn(this)
            iosArm64Test.dependsOn(this)
            iosSimulatorArm64Test.dependsOn(this)
        }
    }
}

@Suppress("UnstableApiUsage")
android {
    namespace = "com.ttypic.notesapp"
    compileSdk = 33
    defaultConfig {
        minSdk = 28
    }
}
