import React, { FormEventHandler, useState } from 'react';
import { Form } from './UserPasswordForm.styled';
import { Button } from '../Button';
import { Input } from '../Input';
import { useInputChange } from '../../utils/useElementChange';

interface UserPasswordFormProps {
  loading: boolean;
  formIsForLogin?: boolean;
  children?: React.ReactNode;

  onSubmit(username: string, password: string): void;
}

export const UserPasswordForm: React.FC<UserPasswordFormProps> = (props) => {
  const {
    formIsForLogin,
    loading,
    onSubmit,
    children,
  } = props;

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleUsernameChange = useInputChange(setUsername);
  const handlePasswordChange = useInputChange(setPassword);

  const handleFormSubmit: FormEventHandler<HTMLFormElement> = event => {
    event.preventDefault();
    onSubmit(username, password);
  };

  return (
    <Form onSubmit={handleFormSubmit}>
      <Input type='text'
             placeholder='Username'
             autoComplete='username'
             value={username}
             onChange={handleUsernameChange} />
      <Input type='password'
             placeholder='Password'
             autoComplete={formIsForLogin ? 'new-password' : 'current-password'}
             value={password}
             onChange={handlePasswordChange} />
      <Button disabled={!username || !password}
              loading={loading}
              type='submit'>
        {formIsForLogin ? 'Login' : 'Sign Up'}
      </Button>
      {children}
    </Form>
  );
};
