import Head from 'next/head';
import React, { useState } from 'react';
import { FiMail, FiArrowLeft } from 'react-icons/fi';
import { canSSRGuest } from '../../utils/canSSRGuests';
import styles from './styles.module.scss';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form'; 
import { EmailFormData } from '../../types';
import { ErrorHandling } from '../../services/errors/ErrorHandling';
import { api } from '../../services/apiClient';
import { toast } from 'react-toastify';
import Link from 'next/link';
import Router from 'next/router';

export default function ForgotPassword() {
  const [loading, setLoading] = useState(false);

  const schema = yup.object().shape({
    email: yup.string().required('Email is a required field').email('Invalid email'),
  });

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors }
  } = useForm<EmailFormData>({
    resolver: yupResolver(schema),
  });

  const handleCheckEmail = async (data: EmailFormData) => {
    try {
      setLoading(true);

      const response = await api.post('/users/verification_code', data);

      toast.success(response.data.msg);
      Router.push('/code');
      setLoading(true);
    } catch (error) {
      setLoading(false);
      new ErrorHandling(error);
    }
  };

  return (
    <>
      <Head>
        <title>Recover Password - To do App</title>
      </Head>

      <div className={styles.centeredContainer}>
        <div className={styles.formContainer}>
          <div className={styles.formHeader}>
            <Link href='/'><FiArrowLeft className={styles.back} color='#323232' size={25} /></Link>
            <h1>To do App</h1>
          </div>
          <small className={styles.text}>Type your email account and we're going to send a verification code</small>
          <form className={styles.form} onSubmit={handleSubmit(handleCheckEmail)}>
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
            <button>{loading ? 'Loading...' : 'Send Code'}</button>
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
