import { ReactElement } from 'react';
import {Container} from './style';

const NoData = ({text}: {text: string}): ReactElement => {
    return <Container>{text}</Container>;
};

export default NoData;