import { ReactElement, useContext, useEffect, useMemo, useState } from 'react';
import { Page } from '../../components/Page';
import { Table } from './component/Table';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import qs from 'qs';
import { AppDispatch } from '../../store';
import { fetchPairsData } from '../../store/common/pairs';
import { GlobalContext } from '../../state/context';
import styled from 'styled-components';
import { TTransactionsGetProps } from '../../api/transaction';

const defaultParams = {
    limit: 25,
    offset: 0,
    orderBy: ['trade_time'],
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

const Transactions = (): ReactElement => {
    const dispatch = useDispatch<AppDispatch>();
    const location = useLocation();
    const navigate = useNavigate();
    const { getTransactions } = useContext(GlobalContext);
    const { search, pathname } = location;
    const params : TTransactionsGetProps = useMemo(() => qs.parse(search.substring(1)), [search]);
    const [ready, setReady] = useState(false);
    const summParams = useMemo(() => ({
        ...defaultParams,
        ...params
    }), [params]);

    const onSetParams = (argParams: TTransactionsGetProps) => {
        navigate(`${pathname}?${qs.stringify({...summParams, ...argParams})}`)
    }

    useEffect(() => {
        navigate(`${pathname}?${qs.stringify(summParams)}`)
        setReady(true);
    }, [pathname, navigate, summParams, setReady, dispatch])

    useEffect(() => {
      
        if(ready){
            getTransactions(params);
        }
    }, [dispatch, params, ready, getTransactions])

    useEffect(() => {
        dispatch(fetchPairsData());
    }, [dispatch])

    return <Container>
       { !ready ? null :<Table onSetParams={onSetParams}/>}
    </Container>
};

const TransactionsPage = ():ReactElement => <Page isSecure><Transactions/></Page>

export default TransactionsPage;