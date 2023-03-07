import Head from 'next/head';
import React from 'react';
import styles from '../../styles/home.module.scss';
import {
  FiMail,
  FiLock
} from 'react-icons/fi';

import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { SignInFormData } from '../types';
import { useAuthContext } from '../contexts/AuthContext';
import Link from 'next/link';
import { canSSRGuest } from '../utils/canSSRGuests';

export default function Home() {
  const {
    handleSignIn,
    loading
  } = useAuthContext();
  
  const schema = yup.object().shape({
    email: yup.string().required('Email is required').email('Invalid email'),
    password: yup.string().required('Password is required').min(8, 'Password is too short')
  });

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors }
  } = useForm<SignInFormData>({
    resolver: yupResolver(schema)
  });

  const handleSignInAction = async (data: SignInFormData) => {
    await handleSignIn(data);
  };
    
  return (
    <>
      <Head>
        <title>To do App - Sign In</title>
      </Head>

      <div className={styles.centeredContainer}>
        <div className={styles.formContainer}>
          <h1>To do App</h1>
          <form className={styles.form} onSubmit={handleSubmit(handleSignInAction)}>
            <div className={styles.inputWrapper}>
              <FiMail className={styles.icon} />
              <input
                type='text'
                placeholder='Type your email'
                autoComplete='off'
                className={errors.email ? styles.invalidInput : styles.input}
                {...register('email')}
              />
              {errors.email && <div>
                <small>{errors.email.message}</small>
              </div>}
            </div>
            <div className={styles.inputWrapper}>
              <FiLock className={styles.icon} />
              <input
                type='password'
                placeholder='Type your password'
                className={errors.password ? styles.invalidInput : styles.input }
                {...register('password')}
              />
              {errors.password && <div>
                <small>{errors.password.message}</small>
              </div>}
            </div>
            <button>{
              loading ? 'Loading...' : 'Sign In'
            }</button>
          </form>
          <Link className={styles.link} href='/forgot_password'>Forgot your password?</Link>
          <div className={styles.divider}></div>
          <Link className={styles.link} href='/sign_up'>Don't have an account? Sign Up</Link>
        </div>
      </div>
    </>
  );
}

export const getServerSideProps = canSSRGuest(async (ctx) => {
  return {
    props: {}
  }
});
