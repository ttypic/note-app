import React from 'react';
import { Loader } from 'components/Loader';
import { ConnectionStatus, useAppData } from 'providers/DataProvider';
import { HomeConnected } from '../HomeConnected/HomeConnected';
import { HomeDisconnected } from '../HomeDisconnected/HomeDisconnected';

export const HomeContent: React.FC = () => {
  const { connectionStatus } = useAppData();

  switch (connectionStatus) {
    case ConnectionStatus.idle:
    case ConnectionStatus.connecting:
      return <Loader />;
    case ConnectionStatus.connected:
      return <HomeConnected />;
    case ConnectionStatus.disconnected:
      return <HomeDisconnected />;
  }
};
