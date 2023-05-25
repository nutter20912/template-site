import { Button, Empty, message, Result } from 'antd';
import React, { useEffect } from 'react';
import { useAsyncError, useNavigate, useRouteError } from 'react-router-dom';
import { useAuthContext } from '../UserContext';

const handleErrorMessage = (error) => {
  switch (error.status) {
    case 403:
      return {
        status: 403,
        title: 403,
        subTitle: 'Sorry, you are not authorized to access this page.',
      };
    case 404:
      return {
        status: 404,
        title: 404,
        subTitle: 'Sorry, the page you visited does not exist.',
      };
    default:
      return {
        status: 500,
        title: 500,
        subTitle: 'Sorry, something went wrong.',
      };
  }
};

/* eslint-disable  */
const report = (from, error) => {
  if (process.env.REACT_APP_DEBUG === 'true') {
    console.log(`${from}: `, error);
  }
};
/* eslint-enable */

/**
 * 錯誤處理元件
 *
 * @returns {React.ReactElement}
 */
export function ErrorHandler() {
  const error = useAsyncError();
  const { doLogout } = useAuthContext();

  report('AsyncError', error);

  /** 全局提示 */
  useEffect(() => {
    const { response: { status, data } } = error;
    message.error(data?.message || error.message);

    if (status === 401) {
      doLogout();
      message.info('請重新登入');
    }
  }, []);

  return (
    <Empty description={false} />
  );
}

/**
 * 錯誤處理元件
 *
 * @returns {React.ReactElement}
 */
export function BaseErrorElement() {
  const navigate = useNavigate();
  const error = useRouteError();
  const res = handleErrorMessage(error);

  report('RouteError', error);

  return (
    <Result
      status={res.status}
      title={res.title}
      subTitle={res.subTitle}
      extra={<Button key="back" type="primary" onClick={() => navigate(-1)}>Back</Button>}
    />
  );
}
