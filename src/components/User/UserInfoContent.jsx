import { Skeleton, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { User } from '../../api';

/**
 * 氣泡卡片內容
 *
 * @returns {React.ReactElement}
 */
export default function UserInfoContent({ userId, usersState }) {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = usersState;

  const setUserInfo = async (id) => {
    if (users[id]) {
      return;
    }

    const { result } = await User.show({ id });

    setUsers((pre) => ({
      [id]: result,
      ...pre,
    }));
  };

  useEffect(() => {
    setUserInfo(userId)
      .then(() => setLoading(false))
      .catch((e) => message.error(e.message));
  }, []);

  return (
    <Skeleton loading={loading}>
      {!loading && (
        <p>{`聯絡信箱: ${users[userId].email}`}</p>
      )}
    </Skeleton>
  );
}
