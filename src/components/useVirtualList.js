import { message } from 'antd';
import { useEffect, useReducer } from 'react';

/**
 * 虛擬列表分頁器
 *
 * @param {state.set} set id 收集器
 * @param {state.renderData} renderData 渲染資料
 * @param {action.type} type 動作類型
 * @param {action.data} data 資料
 * @returns
 */
function reducer(state, { type, data }) {
  const { currentPage, renderData, set } = state;

  switch (type) {
    case 'next': {
      return {
        ...state,
        currentPage: currentPage + 1,
      };
    }
    case 'add': {
      renderData.unshift(data);

      return {
        ...state,
        set: set.add(data.id),
      };
    }
    case 'delete': {
      return {
        ...state,
        renderData: renderData.filter((item) => (data.id !== item.id)),
        set: set.delete(data.id),
      };
    }
    case 'update': {
      return {
        ...state,
        renderData: renderData.map(
          (item) => (data.id === item.id ? { ...item, ...data } : item),
        ),
      };
    }
    case 'load': {
      const appendData = data.filter(
        (item) => !set.has(item.id),
      );

      appendData.forEach((item) => set.add(item.id));

      return {
        ...state,
        renderData: renderData.concat(appendData),
      };
    }
    default: {
      throw new Error();
    }
  }
}

/**
 * 虛擬列表 Hook
 *
 * @param {Object} result 請求結果
 * @param {Number} itemPercent 項目百分比
 * @param {Object} callbackApi api函式
 * @returns
 */
export default function useVirtualList(
  { data, paginator },
  itemPercent,
  callbackApi,
) {
  const [state, dispatch] = useReducer(reducer, {
    renderData: [...data],
    set: new Set(data.map((item) => item.id)),
    currentPage: paginator.current_page,
  });

  const containerHeight = window.innerHeight - 65;
  const itemHeight = window.innerHeight * itemPercent;

  const onScroll = (e) => {
    if (state.currentPage === paginator.last_page) {
      return;
    }

    if (containerHeight === (e.currentTarget.scrollHeight - e.currentTarget.scrollTop)) {
      dispatch({ type: 'next' });
    }
  };

  /** 載入分頁資料 */
  useEffect(() => {
    if (state.currentPage !== 1) {
      callbackApi({ page: state.currentPage })
        .then((res) => dispatch({ type: 'load', data: res.data }))
        .catch((e) => message.error(e));
    }
  }, [state.currentPage]);

  return {
    state,
    dispatch,
    onScroll,
    containerHeight,
    itemHeight,
  };
}
