/*
==================== Next.js 基礎概念 ====================

Next.js 是一個基於 React 的全端框架，提供許多開箱即用的功能：

1. 檔案系統路由（File-system Routing）
   - 在 app 目錄下的 page.js 文件會自動成為路由頁面
   - 例如：app/page.js 對應 "/"，app/about/page.js 對應 "/about"
   更多資訊：https://nextjs.org/docs/app/building-your-application/routing

2. 客戶端與伺服器端組件
   - 默認所有組件都是伺服器端組件（Server Component）
   - 使用 'use client' 指令將組件標記為客戶端組件（Client Component）
   更多資訊：https://nextjs.org/docs/app/building-your-application/rendering/client-components

==================== React 基礎概念 ====================

React 是一個用於構建用戶界面的 JavaScript 庫：

1. 組件（Components）
   - React 應用程序由組件構建而成
   - 組件可以是函數或類，返回 JSX
   更多資訊：https://react.dev/learn/your-first-component

2. Hooks
   - useState: 用於管理組件狀態
   - useEffect: 處理副作用
   - useContext: 跨組件共享數據
   更多資訊：https://react.dev/reference/react/hooks

3. 單向數據流
   - 數據總是從父組件流向子組件
   - 通過 props 傳遞數據和回調函數
   更多資訊：https://react.dev/learn/sharing-state-between-components

==================== 代碼解析 ====================
*/

// 聲明這是客戶端組件
// 這允許我們使用瀏覽器 API 和 React hooks
'use client';

// 導入必要的模組
import Link from "next/link";

// useState 是 React 最基本的 Hook
// 用於在函數組件中管理狀態
import { useState, useEffect } from "react";

// 導入自定義組件
// 這展示了 React 的組件化特性
import TaskList from "../components/TaskList";

// 定義首頁組件
// 在 Next.js 中，這個組件會自動成為根路由 ("/") 的頁面
export default function Home() {
  // 使用 useState Hook
  // 語法：const [狀態值, 設置狀態的函數] = useState(初始值)
  
  // tasks 數組用於存儲所有任務
  // setTasks 函數用於更新 tasks 狀態
  const [tasks, setTasks] = useState([]);
  
  // newTask 存儲輸入框的當前值
  // setNewTask 用於更新輸入框的值
  const [newTask, setNewTask] = useState('');

  const [nextId, setNextId] = useState(1);

  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    setTasks(savedTasks);
    const maxId = savedTasks.reduce((max, task) => Math.max(max, task.id), 0);
    setNextId(maxId + 1);
  }, []);

  // 添加任務的函數
  // 在 React 中，我們通常將事件處理函數定義在組件內部
  const addTask = () => {
    // 除錯信息
    console.log("Before:", tasks);
    console.log("NewTask:", newTask);
    
    // 使用展開運算符創建新數組
    // 這是 React 中確保狀態不可變性的重要概念
    // 直接修改狀態（如 tasks.push()）是不好的做法
    const newTaskObj = {
      id: nextId,
      title: newTask,
      description: '',
    };
    const updatedTasks = [...tasks, newTaskObj];
    
    // 使用 setState 更新狀態
    // 這會觸發 React 的重新渲染機制
    setTasks(updatedTasks);
    
    console.log("After:", updatedTasks);
    
    // 清空輸入框
    setNewTask('');

    setNextId(nextId + 1);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
  };

  const handleDelete = (index) => {
    const newTasks = tasks.filter((_, i) => i !== index);
    setTasks(newTasks);
    localStorage.setItem('tasks', JSON.stringify(newTasks));
  }

  // 返回 JSX
  // JSX 是 JavaScript 的語法擴展，允許在 JS 中編寫類似 HTML 的代碼
  return (
    // 使用 Tailwind CSS 進行樣式設置
    // Tailwind 是一個實用優先的 CSS 框架
    // 更多資訊：https://tailwindcss.com/docs
    <main className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold">Task Board</h1>

      {/* 輸入區域 */}
      {/* flex 布局使元素並排排列 */}
      <div className="flex gap-2 mb-4">
        {/*
          受控組件（Controlled Component）
          - value 綁定到 state
          - onChange 處理用戶輸入
          更多資訊：https://react.dev/reference/react-dom/components/input
        */}
        <input
          className="border p-2 flex-1"
          placeholder="Enter a task"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        
        {/*
          事件處理
          - onClick 綁定點擊事件處理函數
          - 使用箭頭函數或 .bind() 確保正確的 this 上下文
        */}
        <button
          className="bg-blue-500 text-white px-4"
          onClick={addTask}
        >
          Add
        </button>
      </div>

      {/*
        組件組合（Component Composition）
        - 將數據通過 props 傳遞給子組件
        - 這實現了關注點分離和代碼重用
        更多資訊：https://react.dev/learn/passing-props-to-a-component
      */}
      <TaskList tasks={tasks} onDelete={handleDelete} />
    </main>
  );
}

/*
==================== 推薦學習資源 ====================

1. React 官方文檔
   - https://react.dev/learn
   - 包含互動式教程和完整的 API 參考

2. Next.js 學習資源
   - 官方文檔：https://nextjs.org/docs
   - 學習平台：https://nextjs.org/learn

3. JavaScript 基礎
   - MDN Web Docs：https://developer.mozilla.org/zh-TW/docs/Web/JavaScript
   - 現代 JavaScript 教程：https://javascript.info/

4. 開發工具
   - React Developer Tools 瀏覽器擴展
   - VS Code 的 ES7+ React/Redux/React-Native snippets 插件

5. 狀態管理進階學習
   - Redux：https://redux.js.org/
   - Zustand：https://github.com/pmndrs/zustand

6. 樣式解決方案
   - Tailwind CSS：https://tailwindcss.com/
   - Styled Components：https://styled-components.com/

學習建議：
1. 先掌握 JavaScript 基礎
2. 學習 React 核心概念（組件、props、state）
3. 理解 React Hooks 的使用
4. 學習 Next.js 特有功能
5. 實踐！建立小項目來鞏固所學
*/