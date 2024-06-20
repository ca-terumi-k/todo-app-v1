import { useState } from 'react'
import './App.css'
  
import {
  FormControl,
  Select,
  Button,
  Switch, 
  CheckboxGroup,
  Input,
} from '@chakra-ui/react'

type Todo = {
  // プロパティ value は文字列型
  value: string;
  readonly id: number;
  checked: boolean;
  removed: boolean;
};

type Filter = 'all' | 'checked' | 'unchecked' | 'removed';

function App() {
  const [text, setText] = useState('今日の用事');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<Filter>('all');

  const filteredTodos = todos.filter((todo) => {
    // filter ステートの値に応じて異なる内容の配列を返す
    switch (filter) {
      case 'all':
        // 削除されていないもの
        return !todo.removed;
      case 'checked':
        // 完了済 **かつ** 削除されていないもの
        return todo.checked && !todo.removed;
      case 'unchecked':
        // 未完了 **かつ** 削除されていないもの
        return !todo.checked && !todo.removed;
      case 'removed':
        // 削除済みのもの
        return todo.removed;
      default:
        return todo;
    }
  });

  // todos ステートを更新する関数
  const handleSubmit = () => {
    if (!text) return;
    const newTodo: Todo = {
      value: text,
      id: new Date().getTime(),
      checked: false,
      removed: false,
    };
    setTodos((todos) => [newTodo, ...todos]);
    setText('');
  };

  // 入力値を更新する関数
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };
  
  // 編集処理
  const handleEdit = (id: number, value: string) => {
    setTodos((todos) => {
      const newTodos = todos.map((todo) => {
        if (todo.id === id) {
          return { ...todo, value};
        }
        return todo;
      });
      
      return newTodos;
    });
  };

  // checked の更新処理
  const handleCheck = (id: number, checked: boolean) => {
    setTodos((todos) => {
      const newTodos = todos.map((todo) => {
        if (todo.id === id) {
          return { ...todo, checked };
        }
        return todo;
      });

      return newTodos;
    });
  };
  // 削除処理
  const handleRemove = (id: number, removed: boolean) => {
    setTodos((todos) => {
      const newTodos = todos.map((todo) => {
        if (todo.id === id) {
          return { ...todo, removed };
        }
        return todo;
      });

      return newTodos;
    });
  };

  // フィルタリング処理
  const handleFilter = (filter: Filter) => {
    setFilter(filter);
  };

  // ゴミ箱を空にする処理
  const handleEmpty = () => {
    // シャローコピーで事足りる
    setTodos((todos) => todos.filter((todo) => !todo.removed));
  };


  return (
    <>
      <div>
      <Select
        defaultValue="all"
        onChange={(e) => handleFilter(e.target.value as Filter)}>
        <option value="all">すべてのタスク</option>
        <option value="checked">完了したタスク</option>
        <option value="unchecked">現在のタスク</option>
        <option value="removed">ごみ箱</option>
      </Select>
      {/* フィルターが `removed` のときは「ごみ箱を空にする」ボタンを表示 */}
    {filter === 'removed' ? (
      <button 
        onClick={handleEmpty}
        disabled={todos.filter((todo) => todo.removed).length === 0}
      >
        ごみ箱を空にする
      </button>
    ) : ( filter !== 'checked' && (
      <form onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}>
        <FormControl>
          {/* <FormLabel>やること, やらなければならないこと</FormLabel> */}
          <div className='todo_input_box'>
            <Input type="text" value={text} onChange={(e) => handleChange(e)} />
            <Button
              mt={4}
              colorScheme='teal'
              type='submit'
            >
              追加
            </Button>
          </div>
        </FormControl>
      </form>
    )
    )}
    <CheckboxGroup>
      {filteredTodos.map((todo) => {
        return (
          <li key={todo.id}>
            <Switch
              size='lg'
              isDisabled={todo.removed}
              isChecked={todo.checked}
              onChange={() => handleCheck(todo.id, !todo.checked)}
            />
            <Input
              isDisabled={todo.checked || todo.removed}
              value={todo.value}
              onChange={(e) => handleEdit(todo.id, e.target.value)}
            />
            <Button onClick={() => handleRemove(todo.id, !todo.removed)}>
              {todo.removed ? '復元' : '削除'}
            </Button>
          </li>
        );
      })}
    </CheckboxGroup>
      </div>
    </>
  )
}

export default App
