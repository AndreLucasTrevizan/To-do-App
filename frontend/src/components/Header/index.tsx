import React from 'react';
import { useAuthContext } from '../../contexts/AuthContext';
import styles from './styles.module.scss';

export default function Header() {
  const { handleSignOut } = useAuthContext();

  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <h1>To do App</h1>
        <button onClick={handleSignOut}>Sign Out</button>
      </div>
    </header>
  );
}
