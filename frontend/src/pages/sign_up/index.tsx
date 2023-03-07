import Head from 'next/head';
import React from 'react';
import styles from './styles.module.scss';
import {
  FiUser,
  FiMail,
  FiLock,
  FiArrowLeft
} from 'react-icons/fi';

import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { SignUpFormData } from '../../types';
import { useAuthContext } from '../../contexts/AuthContext';
import Link from 'next/link';
import { canSSRGuest } from '../../utils/canSSRGuests';

export default function Home() {
  const {
    handleSignUp,
    loading
  } = useAuthContext();
  
  const schema = yup.object().shape({
    name: yup.string().required('Name is required').min(3, 'Name is too short'),
    email: yup.string().required('Email is required').email('Invalid email'),
    password: yup.string().required('Password is required').min(8, 'Password is too short')
  });

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors }
  } = useForm<SignUpFormData>({
    resolver: yupResolver(schema)
  });

  const handleSignUpAction = async (data: SignUpFormData) => {
    await handleSignUp(data);
  };
    
  return (
    <>
      <Head>
        <title>To do App - Sign Up</title>
      </Head>

      <div className={styles.centeredContainer}>
        <div className={styles.formContainer}>
          <div className={styles.formHeader}>
            <Link href='/'><FiArrowLeft className={styles.back} color='#323232' size={25} /></Link>
            <h1>To do App</h1>
          </div>
          <form className={styles.form} onSubmit={handleSubmit(handleSignUpAction)}>
            <div className={styles.inputWrapper}>
              <FiUser className={styles.icon} color='#323232' />
              <input
                type='text'
                placeholder='Type your name'
                autoComplete='off'
                className={errors.name ? styles.invalidInput : styles.input}
                {...register('name')}
              />
              {errors.name && <div>
                <small>{errors.name.message}</small>
              </div>}
            </div>
            <div className={styles.inputWrapper}>
              <FiMail className={styles.icon} color='#323232' />
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
              <FiLock className={styles.icon} color='#323232' />
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
              loading ? 'Loading...' : 'Sign Up'
            }</button>
          </form>
          <Link className={styles.link} href='/'>Do you have an account? Sign In</Link>
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
