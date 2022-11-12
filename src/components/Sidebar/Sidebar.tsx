import { ReactElement, useCallback, useContext } from 'react';
import { Button, Popover } from 'antd';
import routes, { Route } from '../../router';
import { useLocation, useNavigate } from 'react-router-dom';
import { MenuOutlined, UserOutlined } from '@ant-design/icons';
import { GlobalContext } from '../../state/context';
import { useSelector } from 'react-redux';
import { selectUser } from '../../store/common/meta';
import {Container, List, ItemButton} from './styles'

export type Props = {
    className?: string
}

const list: Route[] = ['main', 'diary', 'journal', 'ideas', 'notes', 'tags', 'trades', 'transactions', 'images'];

const Sidebar = ({ className = '' }: Props): ReactElement => {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const user = useSelector(selectUser);
    const { logoutHandler } = useContext(GlobalContext);

    const itemClass = useCallback((path: string) => `sidebar__item ${path === pathname ? 'chosen' : ''}`, [pathname]);

    const onClickHandler = useCallback((path: Route) => () => {
        navigate(routes[path]());
    }, [navigate]);

    const profilePopoverContent = useCallback(() => <List>
        <div className='userCircle'/>
        <List>
            {
                 user ?<>
                <ItemButton key="profile" onClick={onClickHandler('profile')}>Profile</ItemButton>
                <ItemButton key="logout" onClick={logoutHandler}>Logout</ItemButton>
                </> : <>
                <ItemButton key="login" onClick={onClickHandler('login')}>Login</ItemButton>
                <ItemButton key="signup" onClick={onClickHandler('signup')}>Signup</ItemButton>
                </>
            }
        </List>
    </List>, [onClickHandler, user, logoutHandler])

    const menuPopoverContent = useCallback(() => <List> {
            list.map(item => <ItemButton key={item} className={itemClass(item)} onClick={onClickHandler(item)}>{item}</ItemButton>)
        }</List>
        , [itemClass, onClickHandler])

    return <Container className={className}>
        <Popover key="user" content={profilePopoverContent} trigger="click">
            <Button type="primary" className="circle-btn"><UserOutlined /></Button>
        </Popover>
        {user ? <Popover key="menu" content={menuPopoverContent} trigger="click">
            <Button type="primary" className="circle-btn"><MenuOutlined /></Button>
        </Popover> : <></>} 
    </Container>
};

export default Sidebar;