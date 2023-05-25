import React, { createContext, useContext, useMemo, useReducer } from 'react';
import { storage } from './lib';

/**
 * 使用者資料處理器
 *
 * @param {state} 使用者資料
 * @param {action.type} 類型
 * @param {action.payload} 資料
 * @returns {object} 使用者資料
 */
const userReducer = (state, { type, payload }) => {
  switch (type) {
    case 'login': {
      storage.set('user', payload.user);
      storage.set('token', payload.token);

      return {
        ...state,
        ...payload.user,
      };
    }
    case 'logout': {
      storage.reset('user');

      return {};
    }
    default: {
      throw new Error('Action type is not exist.');
    }
  }
};

const UserContext = createContext();
const AuthContext = createContext();
const useUserContext = () => useContext(UserContext);
const useAuthContext = () => useContext(AuthContext);

/**
 * 使用者提供元件
 *
 * @param {props.children}
 * @returns {React.ReactElement}
 */
function UserProvider({ children }) {
  const user = storage.get('user') || {};
  const [state, dispatch] = useReducer(userReducer, user);

  const auth = useMemo(() => ({
    doLogin: (data) => dispatch({ type: 'login', payload: data }),
    doLogout: () => dispatch({ type: 'logout' }),
  }), []);

  return (
    <AuthContext.Provider value={auth}>
      <UserContext.Provider value={state}>
        {children}
      </UserContext.Provider>
    </AuthContext.Provider>
  );
}

/**
 * 是否已驗證
 *
 * @returns {boolean}
 */
function useAuthenticate() {
  const user = useUserContext();

  return user && Object.keys(user).length !== 0;
}

export {
  UserProvider,
  UserContext,
  useUserContext,
  useAuthContext,
  useAuthenticate,
};
