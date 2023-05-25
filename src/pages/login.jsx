import { KeyOutlined, MailOutlined } from '@ant-design/icons';
import { Button, Form, Input, message } from 'antd';
import React, { useState } from 'react';
import styled from 'styled-components';
import * as api from '../api';
import background from '../images/background.jpeg';
import logo from '../images/logo.png';
import { useAuthContext } from '../UserContext';
import Register from './register';

const LoginPage = styled.div`
  width: 100%;
  height: 100%;
  background-image: url(${background});
  background-size:cover;
`;

const Header = styled.header`
  align-items: center;
  display:flex;
  font-size: 20px;
`;

const LogoImage = styled.img`
  src: ${(props) => props.src};
  height: 50px;
  border-radius: 50%;
  margin: 20px;
`;

const Content = styled.section`
  width: 400px;
  height: 300px;
  background-color: #fff;
  margin: 50px auto;
  padding: 20px 40px;
`;

const ContentTitle = styled.h2`
  text-align: center;
  margin-bottom: 30px;
`;

/**
 * 登入頁
 *
 * @returns {React.ReactElement}
 */
export default function Login() {
  const [modalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm();
  const { doLogin } = useAuthContext();

  const onFinish = async () => {
    const { login_email: email, login_password: password } = form.getFieldsValue(true);

    try {
      const { result: user } = await api.userLogin({ email, password });

      doLogin(user);
      message.success('登入成功');
    } catch ({ response: { data } }) {
      message.error(data.message);
    }
  };

  const showModal = () => {
    form.resetFields();
    setModalOpen(true);
  };

  return (
    <LoginPage>
      <Header>
        <LogoImage src={logo} />
        <h1>留言板</h1>
      </Header>
      <Content>
        <ContentTitle>使用者登入</ContentTitle>
        <Form
          form={form}
          onFinish={onFinish}
        >
          <Form.Item
            name="login_email"
            rules={[
              {
                required: true,
                message: 'Please input your Email!',
              },
              {
                pattern: /^[\w-\\.]+@([\w-]+\.)+[\w-]{2,4}$/,
                message: 'not a email',
              },
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="Email" />
          </Form.Item>

          <Form.Item
            name="login_password"
            rules={[
              {
                required: true,
                message: 'Please input your password!',
              },
              {
                max: 8,
                message: 'max lengh 8 ',
              },
            ]}
          >
            <Input.Password prefix={<KeyOutlined />} placeholder="Password" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              login in
            </Button>
          </Form.Item>

        </Form>
        <Button
          type="primary"
          style={{ backgroundColor: 'forestgreen' }}
          onClick={showModal}
          block
        >
          register
        </Button>
        <Register
          setModalOpen={setModalOpen}
          modalOpen={modalOpen}
        />
      </Content>
    </LoginPage>
  );
}
