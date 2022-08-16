import './style.scss';
import { ReactElement, useContext, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Page } from '../../components/Page';
import { Header } from '../../components/Header';
import { ViewSwitch } from './components/ViewSwitch';
import routes, { Route } from '../../router';
import { Login } from './components/Login';
import { Signup } from './components/Signup';
import { selectUser, selectUserStatus } from '../../store/common/meta';
import { useSelector } from 'react-redux';
import { GlobalContext } from '../../state/context';



const Start = (): ReactElement => {
    const location = useLocation();
    const navigate = useNavigate();
    const { selfCheck } = useContext(GlobalContext);
    const user = useSelector(selectUser);
    const status = useSelector(selectUserStatus);

    const currentLocation = (Object.keys(routes) as Route[]).find((route: Route) => routes[route] === location.pathname);

    useEffect(() => {
        selfCheck();
    }, [selfCheck]);

    useEffect(() => {
        if (user) {
            navigate(routes.main)
        }
    }, [user, navigate]);

    return status === 'succeeded'  ? <div className="start_page__root">
        {
            currentLocation === 'login' && <Login />
        }
        {
            currentLocation === 'signup' && <Signup />
        }
    </div> : <></>
};

const StartPage = (): ReactElement => <Page><Start /></Page>

export default StartPage;