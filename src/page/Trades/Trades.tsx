import './style.scss';
import { ReactElement, useContext, useEffect, useMemo, useState } from 'react';
import { Page } from '../../components/Page';
import { Table } from './component/Table';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import qs from 'qs';
import { fetchTradeData } from '../../store/trades';
import { AppDispatch } from '../../store';
import { fetchPairsData } from '../../store/common/pairs';
import { TTradesGetProps } from '../../api/trade';
import { GlobalContext } from '../../state/context';
import { NotesContext } from '../../state/notePageContext';

const defaultParams = {
    limit: 25,
    offset: 0
};

const Trades = (): ReactElement => {
    const dispatch = useDispatch<AppDispatch>();
    const location = useLocation();
    const navigate = useNavigate();
    const { tagsListHandler } = useContext(GlobalContext);
    const { noteListHandler } = useContext(NotesContext);
    const { search, pathname } = location;
    const params : TTradesGetProps = useMemo(() => qs.parse(search.substring(1)), [search]);
    const [ready, setReady] = useState(false);
    useEffect(() => {
        const summParams = {
            ...defaultParams,
            ...params
        };
        navigate(`${pathname}?${qs.stringify(summParams)}`)
        setReady(true);
    }, [pathname, navigate, params, setReady, dispatch])

    useEffect(() => {
        if(ready){
            dispatch(fetchTradeData(params));
        }
    }, [dispatch, params, ready])

    useEffect(() => {
        dispatch(fetchPairsData());
        tagsListHandler();
        noteListHandler({});
    }, [dispatch, noteListHandler, tagsListHandler])

    return <div className="notes_page__root">
       { !ready ? null :<Table/>}
    </div>
};

const TradesPage = ():ReactElement => <Page isSecure><Trades/></Page>

export default TradesPage;