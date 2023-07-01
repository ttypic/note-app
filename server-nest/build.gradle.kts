import com.github.gradle.node.task.NodeTask

plugins {
    id("com.github.node-gradle.node") version "3.5.0"
}

node {
    npmInstallCommand.set("install")
    distBaseUrl.set("https://nodejs.org/dist")
    // version.set("16.19.0")
    // download.set(true)
}

tasks.npmInstall {
    nodeModulesOutputFilter {
        exclude("notExistingFile")
    }
}

tasks.register<NodeTask>("run") {
    dependsOn(tasks.npmInstall)
    script.set(file("src/index.js"))
    ignoreExitValue.set(false)
    workingDir.set(projectDir)
    execOverrides {
        standardOutput = System.out
    }
    inputs.dir("src")
    outputs.upToDateWhen {
        false
    }
}
