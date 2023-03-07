import React, { useState } from 'react';
import { TodoProps } from '../../types';
import styles from './styles.module.scss';

import {
  FiCheck,
  FiEdit,
  FiX
} from 'react-icons/fi';

export default function Todo({
  data,
  handleEdit,
  handleDelete,
  handleFinish
}: TodoProps) {
  return (
    <div className={styles.todo}>
      <div className={styles.todoInfo}>
        <small>{data.date} as {data.time}</small>
        <h4>{data.description}</h4>
      </div>
      {(
        data.status === false &&
        data.date === new Date().toLocaleDateString()
      ) &&
        <div className={styles.actions}>
          <button onClick={() => handleFinish(data)}><FiCheck size={25} color='#323232' /></button>
          <button onClick={() => handleEdit(data)}><FiEdit style={{ margin: '0 1rem' }} size={25} color='#323232' /></button>
          <button onClick={() => handleDelete(data)}><FiX size={25} color='#323232' /></button>
        </div>
      }
    </div>
  );
};
