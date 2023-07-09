import React, { useCallback } from 'react';
import { Anchor, Error, Message, UserPasswordForm } from 'components/UserPasswordForm';
import { useHttpCall } from 'utils/useHttpCall';

interface SignInProps {
  onSignIn(accessToken: string): void;

  gotoSignUp(): void;
}

interface LoginRequest {
  username: string;
  password: string;
}

interface LoginResponse {
  accessToken: string;
}

export const SignIn: React.FC<SignInProps> = ({ gotoSignUp, onSignIn }) => {
  const { loading, error, makeCall } = useHttpCall<LoginResponse, LoginRequest>({ method: 'POST', path: 'auth/login' });

  const signIn = useCallback((username: string, password: string) => {
    return makeCall({
      body: { username, password },
      onSuccess: ({ accessToken }) => onSignIn(accessToken),
    });
  }, [onSignIn, makeCall]);

  return (
    <UserPasswordForm formIsForLogin loading={loading} onSubmit={signIn}>
      <Message>Not registered? <Anchor onClick={gotoSignUp}>Create an account</Anchor></Message>
      {error && <Error>Wrong password</Error>}
    </UserPasswordForm>
  );
};
