
import { forwardRef, ReactElement, useCallback, useContext } from 'react';
import { Button } from 'antd';
import routes, { Route } from '../../router';
import { useNavigate } from 'react-router-dom';
import { GlobalContext } from '../../state/context';
import { useSelector } from 'react-redux';
import { selectUser } from '../../store/common/meta';
import styled from 'styled-components';

export type Props = {
    children: ReactElement
}

const Container = styled.header`
.header {
    &__root {
        position: fixed;
        width: 100%;
        height: 5rem;
        top: 0;
        left: 0;
        z-index: 1;
        padding: 4px 6px;

        background: rgba(0, 0, 0, 0.1);
    }

    &__content {
        height: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    &__routes {
        display: flex;
    }

    &__route {
        text-transform: capitalize;
    }
}
`;

const Header = forwardRef(({ children }: Props, ref: any): ReactElement => {
    const navigate = useNavigate();
    const { logoutHandler } = useContext(GlobalContext);
    const user = useSelector(selectUser);
    const isAuth = !!user;

    const onRoute = useCallback((path: string) => () => {
        navigate(path);
    }, [navigate]);

    const onLogoutHandler = () => {
        logoutHandler();
    }

    const onLoginHandler = () => {
        navigate(routes.login())
    }

    const onSignUpHandler = () => {
        navigate(routes.signup())
    }

    const renderRoutes = useCallback(() => {
        const excludeRoutes = ['login', 'signup'] as Route[];
        return Object.entries(routes).map(([key, value]) =>
            !excludeRoutes.includes(key as Route) ?
                <Button key={key} className="header__route" onClick={onRoute(value())}>{key}</Button> :
                <></>
        )
    }, [onRoute]);

    return <Container className="header__root" ref={ref}>
        <div className="header__content">
            {
                isAuth ? <div className="header__routes">
                    {renderRoutes()}
                </div> : <></>
            }
            <div className="header__children">
                {children}
            </div>
            <div className="header__right">
                {
                    isAuth ? <div>
                        <div>{user.username}</div>
                        <Button onClick={onLogoutHandler}>Logout</Button>
                    </div> : <div className="buttons">
                        <Button onClick={onLoginHandler}>Login</Button>
                        <Button onClick={onSignUpHandler}>Sign Up</Button>
                    </div>
                }
            </div>
        </div>
    </Container>
});

export default Header;