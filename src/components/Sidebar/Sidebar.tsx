import './style.scss';
import { forwardRef, ReactElement, RefObject, useCallback, useContext, useState } from 'react';
import { Button } from 'antd';
import routes, { Route } from '../../router';
import { useLocation, useNavigate } from 'react-router-dom';
import { LeftOutlined } from '@ant-design/icons';

export type Props = {
    className?: string
}

const list: Route[] = ['main', 'calendar', 'ideas', 'notes', 'tags'];

const Sidebar = forwardRef(({ className: classNameArg }: Props, ref: any): ReactElement => {
    const navigate = useNavigate();
    const { pathname } = useLocation();

    const [isHidden, setIsHidden] = useState(false);

    const className = `${classNameArg ?? ''} sidebar__root ${isHidden ? 'hidden' : ''}`;
    const iconClass = `sidebar__icon`
    const itemClass = useCallback((path: string) => `sidebar__item ${path === pathname ? 'chosen' : ''}`, [pathname]);

    const toggleHide = () => setIsHidden(!isHidden);
    const onClickHandler = useCallback((path: Route) => () => {
        navigate(routes[path])
    }, [])

    return <div className={className}>
        <LeftOutlined className={iconClass} onClick={toggleHide} />
        <nav className='sidebar__nav'>
            <ul className='sidebar__list'>
                {
                    list.map(item => <Button className={itemClass(item)} onClick={onClickHandler(item)}>{item}</Button>)
                }
            </ul>
        </nav>
    </div>
});

export default Sidebar;