import React, { useCallback } from 'react';
import { Anchor, Error, Message, UserPasswordForm } from 'components/UserPasswordForm';
import { useHttpCall } from 'utils/useHttpCall';

interface SignUpProps {
  onSignUp(accessToken: string): void;

  gotoSignIn(): void;
}

interface SignUpRequest {
  username: string;
  password: string;
}

interface SignUpResponse {
  accessToken: string;
}

export const SignUp: React.FC<SignUpProps> = ({ gotoSignIn, onSignUp }) => {
  const { loading, error, makeCall } = useHttpCall<SignUpResponse, SignUpRequest>({
    method: 'POST',
    path: 'auth/signup',
  });

  const signUp = useCallback((username: string, password: string) => {
    return makeCall({
      body: { username, password },
      onSuccess: ({ accessToken }) => onSignUp(accessToken),
    });
  }, [onSignUp, makeCall]);

  return (
    <UserPasswordForm submitButtonText='Sign Up' loading={loading} onSubmit={signUp}>
      <Message>Already registered? <Anchor onClick={gotoSignIn}>Sign In</Anchor></Message>
      {error && <Error>User with the same username already exists</Error>}
    </UserPasswordForm>
  );
};
