import './style.scss';
import { ReactElement, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Page } from '../../components/Page';
import { Header } from '../../components/Header';
import { ViewSwitch } from './components/ViewSwitch';
import routes, { Route } from '../../router';
import { Login } from './components/Login';
import { Signup } from './components/Signup';
import { selectUser } from '../../store/common/meta';
import { useSelector } from 'react-redux';



const Start = (): ReactElement => {
    const location = useLocation();
    const navigate = useNavigate();
    const user = useSelector(selectUser);

    const currentLocation = (Object.keys(routes) as Route[]).find((route: Route) => routes[route] === location.pathname);

    useEffect(() => {
        if (user) {
            navigate(routes.main)
        }
    }, [user, navigate]);

    return <div className="start_page__root">
        {
            currentLocation === 'login' && <Login />
        }
        {
            currentLocation === 'signup' && <Signup />
        }
    </div>
};

const StartPage = (): ReactElement => <Page><Start /></Page>

export default StartPage;