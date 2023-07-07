import React from 'react';

interface HomeProps {
  accessToken: string;

  logout(): void;
}

export const Home: React.FC<HomeProps> = ({ accessToken }) => {
  return (
    <div>Home</div>
  );
};
