import './style.scss';
import { ReactElement, memo, useContext, useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {useSelector} from 'react-redux';
import { GlobalContext } from '../../state/context';
import { Sidebar } from '../Sidebar';
import { selectUser } from '../../store/common/meta';

export type Props = {
    children: ReactElement,
    isSecure?: boolean
}

const Page = memo(({ children, isSecure = false }: Props): ReactElement => {
    const navigate = useNavigate();
    const user = useSelector(selectUser);
    const { selfCheck } = useContext(GlobalContext);
    const [contentReady, setContentReady] = useState(false);
    const headerRef = useRef<HTMLDivElement>(null);
    const [paddingTop, setPaddingTop] = useState(0);

    const [ready, setReady] = useState(!isSecure);

    useEffect(() => {
        if(isSecure){
            (async () => {
                if(!user){
                    await selfCheck();
                }
                setReady(true);
            })()
        }
    }, [navigate, selfCheck, isSecure, user]);

    useEffect(() => {
        setContentReady(true);
        setPaddingTop(headerRef.current?.clientHeight || 0);
    }, [])

    return ready ? <div className="page__root" style={{paddingTop}}>
        <Sidebar/>
        <div className='page__content'>
            {contentReady && children}
        </div>

    </div> : <></>;
});

export default Page;