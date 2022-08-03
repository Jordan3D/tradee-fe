import './style.scss';
import { ReactElement, memo, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import routes from '../../router';
import { GlobalContext } from '../../state/context';

export type Props = {
    children: ReactElement,
    isSecure?: boolean
}

const Page = memo(({children, isSecure = false}: Props):ReactElement => {
    const navigate = useNavigate();
    const {selfCheck} = useContext(GlobalContext);

    const [ready, setReady] = useState(!isSecure);

    useEffect(() => {
        (async() => {
            await selfCheck();
            setReady(true);
        })()
    }, [navigate, selfCheck, isSecure]);

    return ready ? <div className="page__root">
        {children}
    </div> : <></>;
});

export default Page;