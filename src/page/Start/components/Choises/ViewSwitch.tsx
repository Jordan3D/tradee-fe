import './style.scss';
import { ReactElement, useCallback } from 'react';
import { Button } from 'antd';

export enum eViews  {
    Signup = 1,
    Login
}

const ViewSwitch = ():ReactElement => {

    const switchTo = useCallback((view: eViews) => () => {

    }, [])

    return <div className="view_switch__root">
        <Button onClick={switchTo(1)}>Login</Button>
        <Button onClick={switchTo(2)}>Signup</Button>
    </div>
};

export default ViewSwitch;