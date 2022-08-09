import './style.scss';
import { forwardRef, ReactElement, RefObject, useCallback, useContext, useState } from 'react';
import { Button } from 'antd';
import routes, { Route } from '../../router';
import { useLocation, useNavigate } from 'react-router-dom';
import { LeftOutlined } from '@ant-design/icons';
import { GlobalContext } from '../../state/context';
import { useSelector } from 'react-redux';
import { selectUser } from '../../store/common/meta';

export type Props = {
    className?: string
}

const list: Route[] = ['main', 'calendar', 'ideas', 'notes', 'tags'];

const Sidebar = forwardRef(({ className: classNameArg }: Props, ref: any): ReactElement => {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const user = useSelector(selectUser);
    const { logoutHandler } = useContext(GlobalContext);

    const [isHidden, setIsHidden] = useState(false);

    const className = `${classNameArg ?? ''} sidebar__root ${isHidden ? 'hidden' : ''}`;
    const iconClass = `sidebar__icon`
    const itemClass = useCallback((path: string) => `sidebar__item ${path === pathname ? 'chosen' : ''}`, [pathname]);

    const toggleHide = () => setIsHidden(!isHidden);
    const onClickHandler = useCallback((path: Route) => () => {
        navigate(routes[path])
    }, [navigate])

    return <div className={className}>
        <LeftOutlined className={iconClass} onClick={toggleHide} />
        {
            user && <nav className='sidebar__nav'>
            <Button className='sidebar__logout' onClick={logoutHandler}>Logout</Button>
            <ul className='sidebar__list'>
                {
                    list.map(item => <Button className={itemClass(item)} onClick={onClickHandler(item)}>{item}</Button>)
                }
            </ul>
        </nav>
        }
    </div>
});

export default Sidebar;