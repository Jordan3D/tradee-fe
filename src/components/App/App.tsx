import { HelmetProvider } from 'react-helmet-async';
import { StartPage } from '../../page/Start';
import { TagsPage } from '../../page/Tags';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Provider as ReduxProvider } from 'react-redux'
import { ToastContainer } from 'react-toastify';
import ErrorBoundary from '../../partials/ErrorBoundary';
import { Provider as ContextProvider } from '../../state/context';
import { Provider as NotesPageProvider } from '../../state/notePageContext';
import { Provider as JournalProvider } from '../../state/journalContext';
import { Provider as ContextLoaderProvider } from '../../state/loaderContext';
import { Loader } from '../Loader';

import 'react-toastify/dist/ReactToastify.css';
import routes from '../../router';
import { NotesPage } from '../../page/Notes';
import { MainPage } from '../../page/Main';
import { IdeasPage } from '../../page/Ideas';
import { JouranlPage } from '../../page/Journal';
import { store } from '../../store';
import CommonLogicComponent from '../../store/common/LogicComponent';
import { TradesPage } from '../../page/Trades';
import { TradePage } from '../../page/Trade';
import { ThemeProvider } from 'styled-components';
import { ReactElement } from 'react';
import { useSelector } from 'react-redux';
import { selectTheme } from '../../store/common/meta';

import { dark, light, TThemes } from '../../theme'
import { Error } from '../../page/Error';
import { ProfilePage } from '../../page/Profile';
import JournalItemPage from '../../page/JournalItem/JournalItem';
import { TransactionsPage } from '../../page/Transactions';

const themes: TThemes = {
  dark,
  light
}

const CustomThemeProvider = (props: any): ReactElement => {
  const themeColor: keyof TThemes = useSelector(selectTheme);
  return <ThemeProvider theme={themes[themeColor]} {...props} />
}

function App() {

  const backOnError = () => {
    window.location.replace(routes.main);
  };

  return (
    <BrowserRouter>
      <HelmetProvider>
        <ReduxProvider store={store}>
          <ContextProvider>
            <CustomThemeProvider>
              <NotesPageProvider>
                <JournalProvider>
                  <ContextLoaderProvider>
                    <ErrorBoundary>
                      <>
                        <Loader />
                        <ToastContainer />
                        <CommonLogicComponent />
                        <Routes>
                          <Route path={routes.start} element={<StartPage />} />
                          <Route path={routes.signup} element={<StartPage />} />
                          <Route path={routes.login} element={<StartPage />} />
                          <Route path={routes.ideas} element={<IdeasPage />} />
                          <Route path={routes.journal} element={<JouranlPage />} />
                          <Route path={routes.journalItemNew()} element={<JournalItemPage />} />
                          <Route path={routes.journalItem()} element={<JournalItemPage />} />
                          <Route path={routes.tags} element={<TagsPage />} />
                          <Route path={routes.trades} element={<TradesPage />} />
                          <Route path={routes.trade()} element={<TradePage />} />
                          <Route path={routes.transactions} element={<TransactionsPage />} />
                          <Route path={routes.main} element={<MainPage />} />
                          <Route path={routes.profile} element={<ProfilePage />} />
                          <Route path={routes.notes} element={
                            <NotesPage />}
                          />
                          <Route path='*' element={<Error helmetTitle='Not found' backButtonHandler={backOnError} />} />
                        </Routes>
                      </>
                    </ErrorBoundary>
                  </ContextLoaderProvider>
                </JournalProvider>
              </NotesPageProvider>
            </CustomThemeProvider>
          </ContextProvider>
        </ReduxProvider>
      </HelmetProvider>
    </BrowserRouter>
  );
}

export default App;