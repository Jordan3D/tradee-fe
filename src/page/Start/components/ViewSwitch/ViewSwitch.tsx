import { useLocation, useNavigate } from 'react-router-dom';
import { ReactElement, useCallback } from 'react';
import { Button } from 'antd';
import routes, { Route } from '../../../../router';
import styled from 'styled-components';

const Container = styled.div`
    position: relative;

    .view_switch {
        &__button {
        padding: 0 40px;
        margin: 0 10px;
        border: 1px solid transparent;

        &.active {
            border-color: white;
        }
    }
    }
`;

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

    return <Container>
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
    </Container>
};

export default ViewSwitch;