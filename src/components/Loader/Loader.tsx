import './style.scss';
import { ReactElement, useContext } from 'react';

import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

import { Oval } from  'react-loader-spinner'
import { LoaderContext } from '../../state/loaderContext';

const Loader = (): ReactElement => {
    const {isLoading} = useContext(LoaderContext);

    return <div className="loader__root">
        <Oval 
         visible={isLoading}
         height="50"
         width="50"
         strokeWidth={4}
        />
    </div>
};

export default Loader;