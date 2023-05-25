import { CheckOutlined, KeyOutlined, MailOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input, Modal, message } from 'antd';
import React, { useState } from 'react';
import { User } from '../api';

/**
 * 註冊元件
 *
 * @returns {React.ReactElement}
 */
export default function Register({ setModalOpen, modalOpen }) {
  const [form] = Form.useForm();
  const [confirmLoading, setConfirmLoading] = useState(false);

  const handleCancel = () => {
    form.resetFields();
    setModalOpen(false);
  };

  const onFinish = async () => {
    setConfirmLoading(true);

    try {
      const { name, email, password } = form.getFieldsValue(true);
      const { result: user } = await User.store({ name, email, password });

      setModalOpen(false);
      form.resetFields();
      Modal.success({ content: `${user.email} register success.` });
    } catch ({ response: { data } }) {
      message.error(data.message);
    } finally {
      setConfirmLoading(false);
    }
  };

  return (
    <Modal
      title="建立你的帳戶"
      open={modalOpen}
      confirmLoading={confirmLoading}
      onCancel={handleCancel}
      footer={null}
    >

      <Form
        id="register"
        form={form}
        onFinish={onFinish}
      >

        <Form.Item
          name="name"
          rules={[
            {
              required: true,
              message: 'Please input your nickname!',
            },
          ]}
        >
          <Input prefix={<UserOutlined />} placeholder="Name" />
        </Form.Item>

        <Form.Item
          name="email"
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
          name="password"
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

        <Form.Item
          name="confirm"
          dependencies={['password']}
          hasFeedback
          rules={[
            {
              required: true,
              message: 'Please confirm your password!',
            },
            ({ getFieldValue }) => ({
              validator: async (_, value) => {
                if (getFieldValue('password') !== value) {
                  throw new Error('The two passwords that you entered do not match!');
                }
              },
            }),
          ]}
        >
          <Input.Password prefix={<CheckOutlined />} placeholder="Confirm Password" />
        </Form.Item>

        <Form.Item style={{ margin: 0 }}>
          <Button type="primary" htmlType="submit" block>
            建立
          </Button>
        </Form.Item>

      </Form>
    </Modal>
  );
}
