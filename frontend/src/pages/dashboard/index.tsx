import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import Header from '../../components/Header';
import canSSRAuth from '../../utils/canSSRAuth';
import styles from './styles.module.scss';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import {
  FiPlus,
  FiX
} from 'react-icons/fi';
import { toast } from 'react-toastify';
import { setupApiClient } from '../../services/api';
import { DashboardProps, TodoData, TodoFormData } from '../../types';
import { ErrorHandling } from '../../services/errors/ErrorHandling';
import { api } from '../../services/apiClient';
import Todo from '../../components/Todo';
import { useAuthContext } from '../../contexts/AuthContext';
import { Oval } from 'react-loader-spinner';

export default function Dashboard({
  todo_list
}: DashboardProps) {
  const [todos, setTodos] = useState<TodoData[] | []>(todo_list);
  const [selectedTodo, setSelectedTodo] = useState<TodoData | null>(null);
  const [date, setDate] = useState(Date.now());
  const [status, setStatus] = useState('false');
  const [updating, setUpdating] = useState(false);
  const [loading, setLoading] = useState(false);

  const { handleSignOut } = useAuthContext();

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);

        console.log(`/todo?status=${status}&date=${date}`);

        const response = await api.get('/todo', { params: { status, date } });
        
        setTodos(response.data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        new ErrorHandling(error);
      }
    }

    loadData();
  }, [ status, date ]);

  const schema = yup.object().shape({
    description: yup.string().required('Description is a required field')
  });

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm<TodoFormData>({
    resolver: yupResolver(schema),
  });

  const handleCreateTodo = async (data: TodoFormData) => {
    try {
      setLoading(true);

      const response = await api.post('/todo', data);

      setTodos(oldTodos => [ response.data, ...oldTodos ]);
      toast.success('To do created');
      reset();
      setLoading(false);
    } catch (error) {
      setLoading(false);
      new ErrorHandling(error);
    }
  };

  const handleDeleteTodo = async (todo: TodoData) => {
    try {
      setLoading(true);

      await api.delete('/todo', { params: { todo_id: todo.id } });

      let list = todos.filter((item: TodoData) => item.id !== todo.id);

      setTodos(list);
      toast.success('To do removed');
      setLoading(false);
    } catch (error) {
      setLoading(false);
      new ErrorHandling(error);
    }
  };

  const handleFinishTodo = async (todo: TodoData) => {
    try {
      setLoading(true);

      await api.patch('/todo/finish', {}, { params: { todo_id: todo.id } });

      let list = todos.filter((item: TodoData) => item.id !== todo.id);

      setTodos(list);
      toast.success('To do done');
      setLoading(false);
    } catch (error) {
      setLoading(false);
      new ErrorHandling(error);
    }
  };

  const handleChooseEditTodo = async (todo: TodoData) => {
    setValue('description', todo.description);
    setSelectedTodo(todo);
    setUpdating(true);
  };

  const handleEditTodo = async (data: TodoFormData) => {
    try {
      setLoading(true);

      const response = await api.patch('/todo', data, { params: { todo_id: selectedTodo.id } });

      let todo_index = todos.findIndex(item => item === selectedTodo);

      const todo_list = todos;

      todo_list[todo_index] = response.data;

      setTodos(todo_list);
      toast.success('To do updated');
      reset();
      setLoading(false);
      setUpdating(false);
    } catch (error) {
      setLoading(false);
      new ErrorHandling(error);
    }
  };

  const changeStatus = () => {
    console.log(status);
    if (status === 'false') {
      setStatus('true');
    } else {
      setStatus('false');
    }
  };

  const handleIncreaseDate = () => {
    setDate(date + 60 * 60 * 1000 * 24);
  };

  const handleDecreaseDate = () => {
    setDate(date - 60 * 60 * 1000 * 24);
  };

  return (
    <>
      <Head>
        <title>Dashboard - To do App</title>
      </Head>

      <div
        style={{ width: '100%', height: '100vh' }}
      >
        <div className={styles.centeredContainer}>
          <div className={styles.formContainer}>
            <div className={styles.header}>
              <h2>To Do Form</h2>
              <button onClick={() => handleSignOut()}>Sign Out</button>
            </div>
            <form className={styles.form} onSubmit={handleSubmit(updating ? handleEditTodo : handleCreateTodo)}>
              <div className={styles.inputWrapper}>
                <FiPlus className={styles.icon} />
                <input
                  type='text'
                  className={errors.description ? styles.invalidInput : styles.input}
                  placeholder='Type your to do here'
                  autoComplete='off'
                  {...register('description')}
                />
                {errors.description && <div>
                <small>{errors.description.message}</small>
              </div>}
              </div>
              <div className={styles.formButtons}>
                {updating && <button type='button' className={styles.cancelButton} onClick={() => {
                  setUpdating(false);
                  reset();
                }}>
                  <FiX color='#FFFFFF' />
                </button>}
                <button type='submit' className={styles.editButton}>
                  {updating ? 'Update To Do' : 'Create To Do'}
                </button>
              </div>
            </form>
            <div className={styles.dateFilter}>
              <button onClick={handleDecreaseDate}>&lt;</button>
              {new Date(date).toLocaleDateString()}
              <button onClick={handleIncreaseDate}>&gt;</button>
            </div>
            <div className={styles.filter}>
              <div>
                <input
                  name='filter'
                  type='radio'
                  id='in_progress'
                  checked={status === 'false'}
                  onChange={changeStatus}
                />
                <label htmlFor='in_progress'>In progress</label>
              </div>
              <div>
                <input
                  name='filter'
                  type='radio'
                  id='done'
                  onChange={changeStatus}
                />
                <label htmlFor='done'>Done</label>
              </div>
            </div>
            <div className={styles.list}>
              {!loading && (
                <>
                  {(todos.length === 0 && status === 'false') && (
                    <h3 style={{ textAlign: 'center', marginTop: '1rem' }}>You don't have any todo yet</h3>
                  )}
                  {(todos.length === 0 && status === 'true') && (
                    <h3 style={{ textAlign: 'center', marginTop: '1rem' }}>You didn't complete any todo yet</h3>
                  )}
                  {todos.map((todo: TodoData) => (
                      <Todo
                        key={todo.id}
                        data={todo}
                        handleFinish={handleFinishTodo}
                        handleEdit={handleChooseEditTodo}
                        handleDelete={handleDeleteTodo}
                      />
                    ))
                  }
                </>
              )}
              {loading && (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <Oval color='#04B3CB' secondaryColor='#EBEBEB' width={40} height={40} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
  const api = setupApiClient(ctx);

  const response = await api.get('/todo');

  return {
    props: {
      todo_list: response.data,
    }
  }
});
