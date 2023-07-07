import React, { useCallback, useState } from 'react';
import { Route } from 'global/types';
import { SignIn } from '../SignIn';
import { SignUp } from '../SignUp';
import { Home } from '../Home';

export const SimpleRouter: React.FC = () => {
  const [route, setRoute] = useState(Route.signIn);
  const [accessToken, setAccessToken] = useState('');

  const authorize = useCallback(async (accessToken: string) => {
    setAccessToken(accessToken);
    setRoute(Route.home);
  }, []);

  const logout = useCallback(() => {
    setAccessToken('');
    setRoute(Route.signIn);
  }, []);

  const gotoSignIn = useCallback(() => {
    setRoute(Route.signIn);
  }, []);

  const gotoSignUp = useCallback(() => {
    setRoute(Route.signUp);
  }, []);

  switch (route) {
    case Route.home:
      return <Home accessToken={accessToken} logout={logout} />;
    case Route.signIn:
      return <SignIn onSignIn={authorize} gotoSignUp={gotoSignUp} />;
    case Route.signUp:
      return <SignUp onSignUp={authorize} gotoSignIn={gotoSignIn} />;
  }
};
