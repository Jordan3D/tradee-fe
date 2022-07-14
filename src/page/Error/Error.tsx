import './style.scss';
import { ReactElement } from 'react';
import { Page } from '../../components/Page';
import { Button } from 'antd';
import { Helmet } from 'react-helmet-async';

export type Props = {
    helmetTitle: string;
    backButtonHandler: () => void
};

const Error = ({ helmetTitle, backButtonHandler }: Props): ReactElement => {

    return <Page>
        <div className='error_page__root'>
            <Helmet>
                <title>{helmetTitle}</title>
            </Helmet>
            <Button onClick={backButtonHandler}>Back to application</Button>
        </div>
    </Page>
};

export default Error;