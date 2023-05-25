import { ExclamationCircleOutlined, LogoutOutlined } from '@ant-design/icons';
import { Avatar, Button, Layout, Menu, Modal } from 'antd';
import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import styled from 'styled-components';
import logo from '../images/logo.png';
import { useAuthContext, useUserContext } from '../UserContext';

const { Content, Header, Sider } = Layout;

const TopHeader = styled(Header)`
  text-align: right;
  width: 100%;
  height: 70px;
  line-height: center;
  border-bottom: solid LightGray;
  padding: 0;
`;
const HeaderText = styled.span`
  margin-right: 10px;
`;
const MenuLogo = styled(Avatar)`
  src: ${(props) => props.src};
  height: 32px;
  margin: 16px;
`;
const LeftSider = styled(Sider)`
  border-right: 3px LightGray solid;
`;

/**
 * 基本佈局
 *
 * @returns {React.ReactElement}
 */
export default function BaseLayout({ menuComponents }) {
  const user = useUserContext();
  const { doLogout } = useAuthContext();

  const items = menuComponents?.map(({
    path, description, key, icon,
  }) => ({
    label: <Link to={path}>{description}</Link>,
    icon,
    key,
  }));

  const onLogout = () => {
    Modal.confirm({
      icon: <ExclamationCircleOutlined />,
      content: '確定退出嗎?',
      onOk: () => doLogout(),
    });
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>

      <LeftSider breakpoint="md">
        <MenuLogo src={logo} size="large" />
        <Menu items={items} />
      </LeftSider>

      <Layout>
        <TopHeader>
          <HeaderText>{`welcome, ${user.name}`}</HeaderText>
          <Button
            icon={<LogoutOutlined />}
            type="link"
            size="large"
            onClick={onLogout}
          />
        </TopHeader>

        <Content>
          <Outlet />
        </Content>
      </Layout>

    </Layout>
  );
}
