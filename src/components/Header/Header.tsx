import './style.scss';
import { forwardRef, ReactElement, RefObject, useCallback, useContext } from 'react';
import { Button } from 'antd';
import routes, { Routes } from '../../router';
import { useNavigate } from 'react-router-dom';
import { GlobalContext } from '../../state/context';

export type Props = {
    children: ReactElement
}

const Header = forwardRef(({ children }: Props, ref: any): ReactElement => {
    const navigate = useNavigate();
    const { user, logoutHandler } = useContext(GlobalContext);
    const isAuth = !!user;

    const onRoute = useCallback((path: string) => () => {
        navigate(path);
    }, [navigate]);

    const onLogoutHandler = () => {
        logoutHandler();
    }

    const onLoginHandler = () => {
        navigate(routes.login)
    }

    const onSignUpHandler = () => {
        navigate(routes.signup)
    }

    const renderRoutes = useCallback(() => {
        const excludeRoutes = ['login', 'signup'] as Routes[];
        return Object.entries(routes).map(([key, value]) =>
            !excludeRoutes.includes(key as Routes) ?
                <Button key={key} className="header__route" onClick={onRoute(value)}>{key}</Button> :
                <></>
        )
    }, [onRoute]);

    return <header className="header__root" ref={ref}>
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
    </header>
});

export default Header;