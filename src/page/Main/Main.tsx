import { ReactElement } from 'react';
import { Header } from '../../components/Header';
import { Page } from '../../components/Page';
import './style.scss';

const MainPage = (): ReactElement => {
    
    return <Page>
        <>
            <Header>
                <>Header</>
            </Header>
            <div className="main_page__root">
             
            </div>
        </>
    </Page>
}

export default MainPage;