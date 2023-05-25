import { Popover } from 'antd';
import React from 'react';
import UserInfoContent from './UserInfoContent';

/**
 * 使用者訊息氣泡卡片
 *
 * @returns {React.ReactElement}
 */
export default function UserInfoPopover({ userId, children, usersState }) {
  return (
    <Popover
      title={children}
      content={<UserInfoContent userId={userId} usersState={usersState} />}
    >
      {children}
    </Popover>
  );
}
