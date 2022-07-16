import './App.scss';
import { StrictMode } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import StartPage from '../../page/Start/Start';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import ErrorBoundary from '../../partials/ErrorBoundary';
import { Provider as ContextProvider } from '../../state/context';
import { Provider as ContextLoaderProvider } from '../../state/loaderContext';
import { Loader } from '../Loader';

import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <StrictMode>
      <BrowserRouter>
        <HelmetProvider>
          <ContextProvider>
            <ContextLoaderProvider>
              <ErrorBoundary>
                <>
                  <Loader/>
                  <ToastContainer />
                  <StartPage />
                </>
              </ErrorBoundary>
            </ContextLoaderProvider>
          </ContextProvider>
        </HelmetProvider>
      </BrowserRouter>
    </StrictMode>
  );
}

export default App;
