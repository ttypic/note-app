import React from 'react';
import { DataProvider } from 'providers/DataProvider';
import { HomeContent } from './HomeContent/HomeContent';

interface HomeProps {
  accessToken: string;

  logout(): void;
}

export const Home: React.FC<HomeProps> = ({ accessToken, logout }) => {
  return (
    <DataProvider accessToken={accessToken} logout={logout}>
      <HomeContent />
    </DataProvider>
  );
};
