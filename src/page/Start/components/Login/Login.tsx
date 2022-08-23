import { ReactElement, useContext } from 'react';
import { Button, Checkbox, Form, Input } from 'antd';
import { LoginForm } from '../../../../interface/User';
import { GlobalContext } from '../../../../state/context';
import styled from 'styled-components';

const Container = styled.div`
 width: 40%;
        height: 100vh;
        display: flex;
        align-items: center;
        margin: 0 auto;

 .login {
    &__form {
        width: 100%
    }
}
`;

const Login = (): ReactElement => {
    const {loginHandler} = useContext(GlobalContext)

    const onFinish = (values: LoginForm) => {
        loginHandler({
            identityString: values.identityString,
            password: values.password
        });
      };
    
      const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
      };

    return <Container>
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
                name="identityString"
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
    </Container>
};

export default Login;