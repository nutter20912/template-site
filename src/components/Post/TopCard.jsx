import { UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Card, Form, Input, message, Modal } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import React, { useState } from 'react';
import styled from 'styled-components';
import { Post } from '../../api';
import { useUserContext } from '../../UserContext';

const PostButton = styled(Button)`
background: #e7e7e7;
color: #555555;
width: calc(100% - 80px);
border-radius: 10px;
margin-left: 10px;
&:hover {
  background: LightGray;
}
`;

/**
 * 頂層卡片元件
 *
 * @returns {React.ReactElement}
 */
export default function TopCard({ dispatch }) {
  const user = useUserContext();
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const onCancel = () => {
    setOpen(false);
    form.resetFields();
  };

  const onFinish = async () => {
    setConfirmLoading(true);

    try {
      const { title, content } = form.getFieldsValue(true);
      const { result } = await Post.store({ title, content });

      message.success('post success');
      dispatch({ type: 'add', data: result });
      setOpen(false);
      form.resetFields();
    } catch ({ response: { data } }) {
      message.error(data.message);
    } finally {
      setConfirmLoading(false);
    }
  };

  const getTitle = () => (
    <>
      <Avatar>
        {user?.name.substring(0, 1).toUpperCase()}
      </Avatar>
      <PostButton
        type="text"
        onClick={() => setOpen(true)}
      >
        想要說什麼？
      </PostButton>
    </>
  );

  return (
    <Card
      style={{ borderRadius: '10px', margin: '10px' }}
      title={getTitle()}
    >
      <Modal
        title="建立貼文"
        open={open}
        confirmLoading={confirmLoading}
        onCancel={onCancel}
        footer={null}
        bodyStyle={{}}
      >
        <Form
          id="post"
          form={form}
          onFinish={onFinish}
        >

          <Form.Item
            name="title"
            rules={[
              {
                required: true,
                message: 'Please input your title',
              },
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="主題"
              bordered={false}
            />
          </Form.Item>

          <Form.Item
            name="content"
            rules={[
              {
                required: true,
                message: 'Please input your content',
              },
            ]}
          >
            <TextArea
              placeholder="想要說什麼？"
              bordered={false}
              autoSize={{ minRows: 3, maxRows: 5 }}
              showCount
              maxLength={500}
            />
          </Form.Item>

          <Form.Item style={{ margin: 0 }}>
            <Button type="primary" htmlType="submit" block>
              發佈
            </Button>
          </Form.Item>

        </Form>
      </Modal>

    </Card>
  );
}
