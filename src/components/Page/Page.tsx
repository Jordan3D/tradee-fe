import { ReactElement, memo, useContext, useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { GlobalContext } from '../../state/context';
import { Sidebar } from '../Sidebar';
import { selectUser } from '../../store/common/meta';
import styled from 'styled-components';

export type Props = {
    children: ReactElement,
    isSecure?: boolean
}

const Container = styled.div`
 position: relative;
 height: 100%;
 padding-left: 12rem;
 display: flex;
    .page {
      &__content {
        padding: ${props => props.theme.page.content.padding};
         flex-grow: 1;
         background-color: ${props => props.theme.page.bgColor};
      }
    }
    .page__sidebar {
        position: fixed;
        top: 0;
        left: 0;
        box-shadow: 0.2rem 0.2rem 2px 0px rgba(0, 0, 0, 0.144); 
    }
`

const Page = memo(({ children, isSecure = false }: Props): ReactElement => {
    const navigate = useNavigate();
    const user = useSelector(selectUser);
    const { selfCheck } = useContext(GlobalContext);
    const [contentReady, setContentReady] = useState(false);
    const headerRef = useRef<HTMLDivElement>(null);
    const [paddingTop, setPaddingTop] = useState(0);

    const [ready, setReady] = useState(!isSecure);

    useEffect(() => {
        if (isSecure) {
            (async () => {
                if (!user) {
                    await selfCheck();
                } else {
                    setReady(true);
                }
            })()
        }
    }, [navigate, selfCheck, isSecure, user]);

    useEffect(() => {
        if (isSecure && user) {
            setReady(true)
        }
    }, [user, isSecure]);

    useEffect(() => {
        setContentReady(true);
        setPaddingTop(headerRef.current?.clientHeight || 0);
    }, [])

    return ready ? <Container style={{ paddingTop }}>
        <Sidebar className='page__sidebar'/>
        <div className='page__content'>
            {contentReady && children}
        </div>

    </Container> : <></>;
});

export default Page;