import { Input, message } from 'antd';
import React, { useState } from 'react';
import * as api from '../../api';
import { useUserContext } from '../../UserContext';

/**
 * 評論輸入框元件
 *
 * @returns {React.ReactElement}
 */
export default function CommentInput({
  targetId,
  value = '',
  dispatch,
  action,
  setSpinning,
  onFinish,
}) {
  const user = useUserContext();
  const [inputValue, setInputValue] = useState(value);

  const handleComments = async ({ id, content }) => {
    if (action === 'store') {
      const { result } = await api.Comment.store({
        postId: id,
        content,
      });

      dispatch({
        type: 'add',
        data: {
          ...result,
          user: {
            id: user.id,
            name: user.name,
          },
        },
      });
      setInputValue('');
    }

    if (action === 'update') {
      const { result } = await api.Comment.update({ id, content });

      dispatch({
        type: 'update',
        data: {
          id,
          content: result.content,
          updated_at: result.updated_at,
        },
      });
    }
  };

  const onPressEnter = async (e) => {
    if (e.target.value) {
      try {
        setSpinning(true);
        await handleComments({
          id: targetId,
          content: e.target.value,
        });
      } catch (error) {
        message.error(error.message);
      } finally {
        onFinish?.();
        setSpinning(false);
      }
    }
  };

  return (
    <Input
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
      onPressEnter={onPressEnter}
      style={{ borderRadius: '10px', width: 'calc(43vw - 100px)' }}
    />
  );
}
