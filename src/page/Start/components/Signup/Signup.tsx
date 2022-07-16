import './style.scss';
import { Button, Form, Input } from 'antd';
import { ReactElement, useContext } from 'react';
import { SignupForm } from '../../../../interface/User';
import { GlobalContext } from '../../../../state/context';


const Signup = (): ReactElement => {
    const {signupHandler} = useContext(GlobalContext)
    
      const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
      };

    return <div className="signup__root">
        <Form
            name="signupForm"
            className='signup__form'
            layout='vertical'
            onFinish={signupHandler}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
        >
            <Form.Item
                label="Username"
                name="username"
                rules={[
                    {
                        required: true,
                        message: 'Please input your username',
                    },
                ]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                label="Email"
                name="email"
                rules={[
                    {
                        required: true,
                        message: 'Please input your email',
                    },
                ]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                label="Password"
                name="password"
                rules={[
                    {
                        required: true,
                        message: 'Please input your password',
                    },
                ]}
            >
                <Input.Password />
            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit">
                    Submit
                </Button>
            </Form.Item>
        </Form>
    </div>
};

export default Signup;