import './style.scss';
import { ReactElement } from 'react';
import { Page } from '../../components/Page';
import { Header } from '../../components/Header';
import { ViewSwitch } from './components/Choises';


const StartPage = (): ReactElement => {
    return <Page>
        <>
            <Header>
                <ViewSwitch />
            </Header>
            <div className="start_page__root">
                <div className="test">Content</div>
            </div>
        </>
    </Page>
};

export default StartPage;