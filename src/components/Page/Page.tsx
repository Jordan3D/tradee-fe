import './style.scss';
import { ReactElement } from 'react';

export type Props = {
    children: ReactElement
}

const Page = ({children}: Props):ReactElement => {
    return <div className="page__root">
        {children}
    </div>
};

export default Page;