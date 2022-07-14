import './style.scss';
import { ReactElement } from 'react';
import {useLocation} from 'react-router-dom';
import { Page } from '../../components/Page';
import { Header } from '../../components/Header';
import { ViewSwitch } from './components/ViewSwitch';
import routes, { Routes } from '../../router';
import { Login } from './components/Login';
import { Signup } from './components/Signup';



const StartPage = (): ReactElement => {
    const location = useLocation();

    const currentLocation = (Object.keys(routes) as Routes[]).find((route: Routes) => routes[route] === location.pathname)

    return <Page>
        <>
            <Header>
                <div className='start_page_header_content'>
                    <ViewSwitch />
                </div>
            </Header>
            <div className="start_page__root">
                {
                    currentLocation === 'login' && <Login/>
                }
                {
                    currentLocation === 'signup' && <Signup/>
                }
            </div>
        </>
    </Page>
};

export default StartPage;