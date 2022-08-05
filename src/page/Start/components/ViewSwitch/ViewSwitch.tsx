import './style.scss';
import { useLocation, useNavigate } from 'react-router-dom';
import { ReactElement, useCallback } from 'react';
import { Button } from 'antd';
import routes, { Route } from '../../../../router';


const ViewSwitch = ():ReactElement => {
    const navigate = useNavigate();
    const location = useLocation();

    const switchTo = useCallback((view: Route) => () => {
        if(view === 'signup'){
            navigate(routes.signup);
            return;
        } 
        navigate(routes.login);
    }, [navigate])

    const isActive = useCallback((view: Route) => location.pathname === routes[view] ? 'active' : '',[location])

    return <div className="view_switch__root">
        <Button 
          type='primary' 
          size='large' 
          className={`view_switch__button ${isActive('login')}`}
          onClick={switchTo('login')}
        >
            Login
        </Button>
        <Button 
          type='primary' 
          size='large' 
          className={`view_switch__button ${isActive('signup')}`}
          onClick={switchTo('signup')}
        >
            Signup
        </Button>
    </div>
};

export default ViewSwitch;