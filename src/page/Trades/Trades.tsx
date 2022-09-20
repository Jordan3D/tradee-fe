import { ReactElement, useContext, useEffect, useMemo, useState } from 'react';
import { Page } from '../../components/Page';
import { Table } from './component/Table';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import qs from 'qs';
import { AppDispatch } from '../../store';
import { fetchPairsData } from '../../store/common/pairs';
import { TTradesGetProps } from '../../api/trade';
import { GlobalContext } from '../../state/context';
import styled from 'styled-components';
import { fetchNotesData } from '../../store/common/notes';

const defaultParams = {
    limit: 25,
    offset: 0,
    orderBy: ['openTradeTime'],
};


const Container = styled.div`
  position: relative;
        display: flex;
        height: 100%;
        margin: 0 auto;

        @media screen and (max-width: 1200px){
            flex-direction: column;
        }
    
        .trades_page {

&__list {
    display: flex;
    flex-shrink: 0;
    width: 18rem;
    border: 1px solid #00000099;
    background: white;
}

&__item {
    display: flex;
    border: 1px solid #00000099;
    background: white;
}
}
`;

const Trades = (): ReactElement => {
    const dispatch = useDispatch<AppDispatch>();
    const location = useLocation();
    const navigate = useNavigate();
    const { tagsListHandler, getTrades } = useContext(GlobalContext);
    const { search, pathname } = location;
    const params : TTradesGetProps = useMemo(() => qs.parse(search.substring(1)), [search]);
    const [ready, setReady] = useState(false);
    const summParams = useMemo(() => ({
        ...defaultParams,
        ...params
    }), [params]);

    const onSetParams = (argParams: TTradesGetProps) => {
        navigate(`${pathname}?${qs.stringify({...summParams, ...argParams})}`)
    }

    useEffect(() => {
        navigate(`${pathname}?${qs.stringify(summParams)}`)
        setReady(true);
    }, [pathname, navigate, summParams])

    useEffect(() => {
      
        if(ready){
            getTrades(params);
        }
    }, [dispatch, params, ready, getTrades])

    useEffect(() => {
        dispatch(fetchPairsData());
        tagsListHandler();
        dispatch(fetchNotesData({}));
    }, [dispatch, tagsListHandler])

    return <Container>
       { !ready ? null :<Table onSetParams={onSetParams}/>}
    </Container>
};

const TradesPage = ():ReactElement => <Page isSecure><Trades/></Page>

export default TradesPage;