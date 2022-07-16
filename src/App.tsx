/* eslint-disable import/no-unresolved */
import 'antd/dist/antd.css';
import { ConfigProvider } from 'antd';
import ptBR from 'antd/lib/locale/pt_BR';
import { BrowserRouter } from 'react-router-dom';
import AppProvider from './hooks';
import Routes from './routes';

function App(): JSX.Element {
  return (
    <ConfigProvider locale={ptBR}>
      <AppProvider>
        <BrowserRouter>
          <Routes />
        </BrowserRouter>
      </AppProvider>
    </ConfigProvider>
  );
}

export default App;
