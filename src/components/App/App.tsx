import './App.scss';
import { StrictMode } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import StartPage from '../../page/Start/Start';
import { BrowserRouter } from 'react-router-dom';
import ErrorBoundary from '../../partials/ErrorBoundary';
import { Provider as ContextProvider } from '../../state/context';

function App() {
  return (
    <StrictMode>
      <BrowserRouter>
        <HelmetProvider>
          <ContextProvider>
            <ErrorBoundary>
              <StartPage />
            </ErrorBoundary>
          </ContextProvider>
        </HelmetProvider>
      </BrowserRouter>
    </StrictMode>
  );
}

export default App;
