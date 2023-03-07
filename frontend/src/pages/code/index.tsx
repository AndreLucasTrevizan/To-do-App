import Head from 'next/head';
import React, { useState } from 'react';
import { canSSRGuest } from '../../utils/canSSRGuests';
import styles from './styles.module.scss';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form'; 
import { CodeFormData } from '../../types';
import { ErrorHandling } from '../../services/errors/ErrorHandling';
import { api } from '../../services/apiClient';
import { toast } from 'react-toastify';
import Router from 'next/router';

export default function Code() {
  const [loading, setLoading] = useState(false);

  const schema = yup.object().shape({
    code: yup.string()
      .required('Code is a required field')
      .min(6, 'Code has to be 6 digits')
      .max(6, 'Code has to be 6 digits'),
  });

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors }
  } = useForm<CodeFormData>({
    resolver: yupResolver(schema),
  });

  const handleSendCode = async (data: CodeFormData) => {
    try {
      setLoading(true);

      const response = await api.patch('/users/code', data);

      toast.success(response.data.msg);
      Router.push({
        pathname: '/update_password',
        query: { code: data.code }
      }, '/update_password');
      setLoading(true);
    } catch (error) {
      setLoading(false);
      new ErrorHandling(error);
    }
  };

  return (
    <>
      <Head>
        <title>Verification Code - To do App</title>
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
          <small className={styles.text}>Type the verification code that you received in your email</small>
          <form className={styles.form} onSubmit={handleSubmit(handleSendCode)}>
            <div className={styles.inputWrapper}>
              <input
                type="text"
                pattern="\d*"
                maxLength={6}
                placeholder='Type your code here'
                className={errors.code ? styles.invalidInput : styles.code_input}
                {...register('code')}
              />
              {errors.code && <div>
                <small>{errors.code.message}</small>
              </div>}
            </div>
            <button>{loading ? 'Loading...' : 'Check Code'}</button>
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
