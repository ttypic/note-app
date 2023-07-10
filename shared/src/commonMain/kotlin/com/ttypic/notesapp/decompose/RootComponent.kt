package com.ttypic.notesapp.decompose

import com.arkivanov.decompose.ComponentContext
import com.arkivanov.decompose.router.stack.ChildStack
import com.arkivanov.decompose.router.stack.StackNavigation
import com.arkivanov.decompose.router.stack.childStack
import com.arkivanov.decompose.router.stack.replaceCurrent
import com.arkivanov.decompose.value.Value
import com.arkivanov.essenty.parcelable.Parcelable
import com.arkivanov.essenty.parcelable.Parcelize
import com.ttypic.notesapp.decompose.home.DefaultHomeComponent
import com.ttypic.notesapp.decompose.home.HomeComponent
import com.ttypic.notesapp.decompose.signin.DefaultSignInComponent
import com.ttypic.notesapp.decompose.signin.SignInComponent
import com.ttypic.notesapp.decompose.signup.DefaultSignUpComponent
import com.ttypic.notesapp.decompose.signup.SignUpComponent

interface RootComponent {

    val childStack: Value<ChildStack<*, Child>>

    fun onAuthorized(accessToken: String)

    fun onNeedSignInClicked()
    fun onNeedSignUpClicked()
    fun onLogoutClicked()

    sealed class Child {
        class SignInChild(val component: SignInComponent) : Child()
        class SignUpChild(val component: SignUpComponent) : Child()
        class HomeChild(val component: HomeComponent) : Child()
    }
}

class DefaultRootComponent(
    componentContext: ComponentContext,
) : RootComponent, ComponentContext by componentContext {

    private val navigation = StackNavigation<Config>()

    private val stack =
        childStack(
            source = navigation,
            initialConfiguration = Config.SignIn,
            childFactory = ::child,
        )

    override val childStack: Value<ChildStack<*, RootComponent.Child>> = stack

    override fun onAuthorized(accessToken: String) {
        navigation.replaceCurrent(Config.Home(accessToken))
    }

    override fun onNeedSignInClicked() {
        navigation.replaceCurrent(Config.SignIn)
    }

    override fun onNeedSignUpClicked() {
        navigation.replaceCurrent(Config.SignUp)
    }

    override fun onLogoutClicked() {
        navigation.replaceCurrent(Config.SignIn)
    }

    private fun child(config: Config, componentContext: ComponentContext): RootComponent.Child =
        when (config) {
            is Config.SignIn -> RootComponent.Child.SignInChild(
                DefaultSignInComponent(
                    componentContext,
                    ::onAuthorized,
                    ::onNeedSignUpClicked
                )
            )
            is Config.SignUp -> RootComponent.Child.SignUpChild(
                DefaultSignUpComponent(
                    componentContext,
                    ::onAuthorized,
                    ::onNeedSignInClicked
                )
            )
            is Config.Home -> RootComponent.Child.HomeChild(
                DefaultHomeComponent(
                    componentContext,
                    config.accessToken,
                    ::onLogoutClicked
                )
            )
        }

    private sealed interface Config : Parcelable {
        @Parcelize
        object SignIn : Config

        @Parcelize
        object SignUp : Config

        @Parcelize
        data class Home(val accessToken: String) : Config
    }
}
