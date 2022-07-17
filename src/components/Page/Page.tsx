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
    const {accessCheck} = useContext(GlobalContext);

    const [ready, setReady] = useState(!isSecure);

    useEffect(() => {
        if(isSecure){
            (async() => {
                const result = await accessCheck();

                if(result){
                    setReady(result);
                } else {
                    navigate(routes.login);
                }
            })()
        }
    }, [navigate, accessCheck, isSecure]);

    return ready ? <div className="page__root">
        {children}
    </div> : <></>;
});

export default Page;