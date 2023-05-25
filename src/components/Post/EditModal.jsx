import { message, Modal } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import React, { useEffect, useState } from 'react';
import { Post } from '../../api';

/**
 * 編輯對話框
 *
 * @param {boolean} open
 * @returns {React.ReactElement}
 */
export default function EditModal({ open, setOpen, targetId, dispatch }) {
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');

  const handleOk = async () => {
    try {
      setConfirmLoading(true);
      const params = { id: targetId, content };

      await Post.update(params);

      dispatch({ type: 'update', data: params });
    } catch (error) {
      message.error(error.message);
    } finally {
      setConfirmLoading(false);
      setOpen(false);
    }
  };

  /**
   * 取得目標文章資訊
   */
  useEffect(() => {
    if (open && targetId) {
      Post.show({ id: targetId })
        .then(({ result }) => {
          setContent(() => result.content);
          setTitle(() => result.title);
        });
    }
  }, [targetId]);

  return (
    <Modal
      title={title}
      open={open}
      onOk={handleOk}
      confirmLoading={confirmLoading}
      onCancel={() => setOpen(false)}
    >
      <TextArea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        autoSize={{ minRows: 3, maxRows: 5 }}
        showCount
        maxLength={500}
        style={{ marginBottom: '20px' }}
      />
    </Modal>
  );
}
