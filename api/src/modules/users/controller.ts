import { Request, Response } from 'express';
import { compare, hash } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { prismaClient } from '../../prisma';

import { createTransport } from 'nodemailer';

const transporter = createTransport({
  service: 'Hotmail',
  auth: {
    user: 'pocsandretrevizan@hotmail.com',
    pass: 'Al154263789@'
  }
});

export const handleSignUp = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  const valid_email = await prismaClient.user.findFirst({
    where: {
      email
    }
  });

  if (valid_email) throw new Error('Email is being used');

  const hashed_password = await hash(password, 8);

  const user = await prismaClient.user.create({
    data: {
      name,
      email,
      password: hashed_password
    },
    select: {
      id: true,
      name: true,
      email: true
    }
  });

  return res.json(user);
};

export const handleSignIn = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const exists_account = await prismaClient.user.findFirst({
    where: {
      email,
    }
  });

  if (!exists_account) throw new Error('Invalid Email or Password');

  const password_matches = await compare(password, exists_account.password);

  if (!password_matches) throw new Error('Invalid Email or Password');

  const payload = {
    id: exists_account.id,
    name: exists_account.name,
    email: exists_account.email
  };

  const token = sign(payload, String(process.env.JWT_SECRET));

  return res.json({
    ...payload,
    token
  });
};

export const handleGetUserDetails = async (req: Request, res: Response) => {
  const user = await prismaClient.user.findFirst({
    where: {
      id: req.user.id
    },
    select: {
      id: true,
      name: true,
      email: true
    }
  });

  return res.json(user);
};

export const handleSendVerificationCode = async (req: Request, res: Response) => {
  const { email } = req.body;

  const valid_account = await prismaClient.user.findFirst({ where: { email } });

  if (!valid_account) throw new Error('There is no account with the email inserted');

  let code = '';

  for (let cont = 0; cont < 6; cont++) {
    const digit = Math.floor(Math.random() * 10);
    code = code + digit;
  }

  const already_have_code = await prismaClient.code.findFirst({
    where: {
      status: false,
      user_id: valid_account.id,
    }
  });

  if (already_have_code) throw new Error('Check your email, we already sent a verification code for you');

  await prismaClient.code.create({
    data: {
      code,
      user_id: valid_account.id,
    }
  });

  transporter.sendMail({
    from: 'pocsandretrevizan@hotmail.com',
    to: email,
    subject: 'Password Recovery - To do App',
    text: 'Here is your verification code',
    html: `<span>This is your verification code ${code}</span>`
  }, (err, info) => {
    if (err) throw new Error('Error trying to send the verification code');

    res.json({ msg: 'Code sent, check your email' });
  });
};

export const handleCheckCode = async (req: Request, res: Response) => {
  const { code } = req.body;

  const has_code = await prismaClient.code.findFirst({
    where: {
      code,
      status: false,
    }
  });

  if (!has_code) throw new Error('Invalid verification code');

  await prismaClient.code.update({
    where: {
      id: has_code.id,
    },
    data: {
      status: true,
    }
  });

  return res.json({ msg: 'Code validated' });
};

export const handleUpdatePassword = async (req: Request, res: Response) => {
  const { code } = req.query;
  const { password } = req.body;

  const has_code = await prismaClient.code.findFirst({
    where: {
      code: String(code)
    }
  });

  if (!has_code) throw new Error('Error on trying to find the verification code');

  const account = await prismaClient.user.findFirst({
    where: {
      id: has_code.user_id
    }
  });

  if (!account) throw new Error('There is no account associated at this verification code');

  const new_password = await hash(password, 8);

  await prismaClient.user.update({
    where: {
      id: account.id
    },
    data: {
      password: new_password
    }
  });

  return res.json({ msg: 'Password updated' });
};
