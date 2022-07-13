import './style.scss';
import { ReactElement } from 'react';

export type Props = {
    children: ReactElement
}

const Header = ({ children }: Props): ReactElement => {
    return <div className="header__root">
        <div className="header__content">
            {children}
        </div>
    </div>
};

export default Header;