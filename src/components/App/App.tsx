import './App.scss';
import { StrictMode } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import {StartPage} from '../../page/Start';
import {TagsPage} from '../../page/Tags';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import ErrorBoundary from '../../partials/ErrorBoundary';
import { Provider as ContextProvider } from '../../state/context';
import { Provider as ContextLoaderProvider } from '../../state/loaderContext';
import { Loader } from '../Loader';

import 'react-toastify/dist/ReactToastify.css';
import routes from '../../router';

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
                  <Routes>
                    <Route path={routes.signup} element={<StartPage/>}/>
                    <Route path={routes.login} element={<StartPage/>}/>
                    <Route path={routes.tags} element={<TagsPage/>}/>
                  </Routes>
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
