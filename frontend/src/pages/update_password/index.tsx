import Head from 'next/head';
import React, { useState } from 'react';
import { FiLock } from 'react-icons/fi';
import { canSSRGuest } from '../../utils/canSSRGuests';
import styles from './styles.module.scss';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form'; 
import { UpdatePasswordFormData } from '../../types';
import { ErrorHandling } from '../../services/errors/ErrorHandling';
import { api } from '../../services/apiClient';
import { toast } from 'react-toastify';
import Router, { useRouter } from 'next/router';

export default function Code() {
  const [loading, setLoading] = useState(false);

  const { query } = useRouter();

  const schema = yup.object().shape({
    password: yup.string()
      .required('Password is a required field')
      .min(8, 'Password is too short'),
    confirm_password: yup.string()
      .required('Password is a required field')
      .min(8, 'Password is too short')
      .oneOf([yup.ref('password'), null], 'Passwords must match')
  });

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors }
  } = useForm<UpdatePasswordFormData>({
    resolver: yupResolver(schema),
  });

  const handleUpdatePassword = async (data: UpdatePasswordFormData) => {
    try {
      setLoading(true);

      const response = await api.patch('/users/password', data, { params: { code: query.code } });

      toast.success(response.data.msg);
      Router.push('/');
      setLoading(true);
    } catch (error) {
      setLoading(false);
      new ErrorHandling(error);
    }
  };

  return (
    <>
      <Head>
        <title>Updating Password - To do App</title>
      </Head>

      <div className={styles.centeredContainer}>
        <div className={styles.formContainer}>
          <h1
            style={{
              paddingBottom: '1rem',
              borderBottom: '1px solid #EBEBEB',
              width: '100%',
              textAlign: 'center'
            }}>To do App</h1>
          <small className={styles.text}>Type the verification code that you received in your email here</small>
          <form className={styles.form} onSubmit={handleSubmit(handleUpdatePassword)}>
            <div className={styles.inputWrapper}>
              <FiLock className={styles.icon} color='#323232' />
              <input
                type='password'
                placeholder='Type your password here'
                className={errors.password ? styles.invalidInput : styles.input}
                {...register('password')}
              />
              {errors.password && <div>
                <small>{errors.password.message}</small>
              </div>}
            </div>
            <div className={styles.inputWrapper}>
              <FiLock className={styles.icon} color='#323232' />
              <input
                type='password'
                placeholder='Type your password here'
                className={errors.confirm_password ? styles.invalidInput : styles.input}
                {...register('confirm_password')}
              />
              {errors.confirm_password && <div>
                <small>{errors.confirm_password.message}</small>
              </div>}
            </div>
            <button>{loading ? 'Loading...' : 'Update Password'}</button>
          </form>
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
