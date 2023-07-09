import React from 'react';
import { ButtonLayout, Placeholder } from './Button.styled';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ loading = false, children, ...restProps }) => {
  return (
    <ButtonLayout {...restProps}>
      {loading ? <Placeholder /> : children}
    </ButtonLayout>
  );
};
