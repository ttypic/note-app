import React from 'react';
import { SimpleRouter } from 'pages/SimpleRouter';
import { AppLayout, GlobalStyles } from './App.styled';

export const App = () => (
  <>
    <GlobalStyles />
    <AppLayout>
      <SimpleRouter />
    </AppLayout>
  </>
);
