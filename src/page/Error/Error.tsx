import { ReactElement } from 'react';
import { Page } from '../../components/Page';
import { Button } from 'antd';
import { Helmet } from 'react-helmet-async';
import styled from 'styled-components';

export type Props = {
    helmetTitle: string;
    backButtonHandler: () => void
};

 const Container = styled.div``;

const Error = ({ helmetTitle, backButtonHandler }: Props): ReactElement => {

    return <Container>
            <Helmet>
                <title>{helmetTitle}</title>
            </Helmet>
            <Button onClick={backButtonHandler}>Back to application</Button>
        </Container>
};


const ErrorPage = (props: Props):ReactElement => <Page><Error {...props}/></Page>

export default ErrorPage;