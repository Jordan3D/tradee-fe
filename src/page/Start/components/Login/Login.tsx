import './style.scss';
import { ReactElement } from 'react';
import { Button, Checkbox, Form, Input } from 'antd';
import { LoginForm } from '../../../../interface/User';


const Login = (): ReactElement => {

    const onFinish = (values: LoginForm) => {
        console.log('Success:', values);
      };
    
      const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
      };

    return <div className="login__root">
        <Form
            name="loginForm"
            className='login__form'
            layout='vertical'
            initialValues={{
                remember: true,
            }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
        >
            <Form.Item
                label="Username or email"
                name="identity"
                rules={[
                    {
                        required: true,
                        message: 'Please input your username or email',
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

            <Form.Item
                name="remember"
                valuePropName="checked"
            >
                <Checkbox>Remember me</Checkbox>
            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit">
                    Submit
                </Button>
            </Form.Item>
        </Form>
    </div>
};

export default Login;