import './style.scss';
import { ReactElement, memo, useContext, useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { GlobalContext } from '../../state/context';
import { Header } from '../Header';
import { Sidebar } from '../Sidebar';

export type Props = {
    children: ReactElement,
    isSecure?: boolean
}

const Page = memo(({ children, isSecure = false }: Props): ReactElement => {
    const navigate = useNavigate();
    const { selfCheck } = useContext(GlobalContext);
    const [contentReady, setContentReady] = useState(false);
    const headerRef = useRef<HTMLDivElement>(null);
    const [paddingTop, setPaddingTop] = useState(0);

    const [ready, setReady] = useState(!isSecure);

    useEffect(() => {
        (async () => {
            await selfCheck();
            setReady(true);
        })()
    }, [navigate, selfCheck, isSecure]);

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