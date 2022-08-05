import './style.scss';
import { ReactElement, useContext, useEffect } from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import { Page } from '../../components/Page';
import { Header } from '../../components/Header';
import { ViewSwitch } from './components/ViewSwitch';
import routes, { Route } from '../../router';
import { Login } from './components/Login';
import { Signup } from './components/Signup';
import { Button } from 'antd';
import { GlobalContext } from '../../state/context';



const StartPage = (): ReactElement => {
    const location = useLocation();
    const navigate = useNavigate();
    const {user} = useContext(GlobalContext);

    const currentLocation = (Object.keys(routes) as Route[]).find((route: Route) => routes[route] === location.pathname);

    const onNavigate = (path: string) => () => {
        navigate(path)
    };

    useEffect(() => {
        if(user){
            navigate(routes.main)
        }
    }, [user, navigate]);

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