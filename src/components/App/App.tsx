import './App.scss';
import { StrictMode } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { StartPage } from '../../page/Start';
import { TagsPage } from '../../page/Tags';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Provider as ReduxProvider } from 'react-redux'
import { ToastContainer } from 'react-toastify';
import ErrorBoundary from '../../partials/ErrorBoundary';
import { Provider as ContextProvider } from '../../state/context';
import { Provider as NotesPageProvider } from '../../state/notePageContext';
import { Provider as ContextLoaderProvider } from '../../state/loaderContext';
import { Loader } from '../Loader';

import 'react-toastify/dist/ReactToastify.css';
import routes from '../../router';
import { NotesPage } from '../../page/Notes';
import { MainPage } from '../../page/Main';
import { IdeasPage } from '../../page/Ideas';
import { CalendarPage } from '../../page/Calendar';
import { store } from '../../store';
import CommonLogicComponent from '../../store/common/LogicComponent';

function App() {

  return (
    <BrowserRouter>
      <HelmetProvider>
        <ReduxProvider store={store}>
          <ContextProvider>
            <ContextLoaderProvider>
              <ErrorBoundary>
                <>
                  <Loader />
                  <ToastContainer />
                  <CommonLogicComponent/>
                  <Routes>
                    <Route path={routes.start} element={<StartPage />} />
                    <Route path={routes.signup} element={<StartPage />} />
                    <Route path={routes.login} element={<StartPage />} />
                    <Route path={routes.ideas} element={<IdeasPage />} />
                    <Route path={routes.calendar} element={<CalendarPage />} />
                    <Route path={routes.tags} element={<TagsPage />} />
                    <Route path={routes.main} element={<MainPage />} />
                    <Route path={routes.notes} element={
                      <NotesPageProvider><NotesPage /></NotesPageProvider>}
                    />
                  </Routes>
                </>
              </ErrorBoundary>
            </ContextLoaderProvider>
          </ContextProvider>
        </ReduxProvider>
      </HelmetProvider>
    </BrowserRouter>
  );
}

export default App;
