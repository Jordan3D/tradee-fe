import { ReactElement, useContext } from 'react';

import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

import { Oval } from  'react-loader-spinner'
import { LoaderContext } from '../../state/loaderContext';
import styled from 'styled-components';

const Container = styled.div`
     position: absolute;
     bottom: 15px;
     right: 15px;
`;

const Loader = (): ReactElement => {
    const {isLoading} = useContext(LoaderContext);

    return <Container>
        <Oval 
         visible={isLoading}
         height="50"
         width="50"
         strokeWidth={4}
        />
    </Container>
};

export default Loader;