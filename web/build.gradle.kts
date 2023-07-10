import com.github.gradle.node.npm.task.NpmTask

plugins {
    id("com.github.node-gradle.node")
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

tasks.register<NpmTask>("start") {
    dependsOn(tasks.npmInstall)
    args.set(listOf("start"))
}
