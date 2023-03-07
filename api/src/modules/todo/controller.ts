import { Request, Response } from 'express';
import { prismaClient } from '../../prisma';

export const handleCreateTodo = async (req: Request, res: Response) => {
  const { description } = req.body;

  const todo = await prismaClient.todo.create({
    data: {
      description,
      date: new Date().toLocaleDateString('pt-br'),
      time: new Date().toLocaleTimeString('pt-br', { hour: '2-digit', minute: '2-digit' }),
      user_id: req.user.id
    },
    select: {
      id: true,
      description: true,
      date: true,
      time: true,
      status: true,
      user: {
        select: {
          id: true,
          name: true
        }
      }
    }
  });

  return res.json(todo);
};

export const handleListTodo = async (req: Request, res: Response) => {
  const {
    status = '',
    date = ''
  } = req.query;

  const todo_list = await prismaClient.todo.findMany({
    where: {
      status: status === 'true' ? true : false,
      date: date !== '' ? new Date(Number(date)).toLocaleDateString() : new Date().toLocaleDateString(),
      user_id: req.user.id
    },
    select: {
      id: true,
      description: true,
      date: true,
      time: true,
      status: true,
      user: {
        select: {
          id: true,
          name: true
        }
      }
    },
    orderBy: {
      created_at: 'desc'
    }
  });

  return res.json(todo_list);
};

export const handleUpdateTodo = async (req: Request, res: Response) => {
  const { todo_id } = req.query;
  const { description } = req.body;

  const valid_todo = await prismaClient.todo.findFirst({
    where: {
      id: String(todo_id),
      user_id: req.user.id
    }
  });
  
  if (!valid_todo) throw new Error('You cannot update this todo');

  const todo = await prismaClient.todo.update({
    where: {
      id: valid_todo.id,
    },
    data: {
      description
    },
    select: {
      id: true,
      description: true,
      date: true,
      time: true,
      status: true,
      user: {
        select: {
          id: true,
          name: true
        }
      }
    }
  });

  return res.json(todo);
};

export const handleFinishingTodo = async (req: Request, res: Response) => {
  const { todo_id } = req.query;

  const valid_todo = await prismaClient.todo.findFirst({
    where: {
      id: String(todo_id),
      user_id: req.user.id
    }
  });
  
  if (!valid_todo) throw new Error('You cannot update this todo');

  const todo = await prismaClient.todo.update({
    where: {
      id: valid_todo.id,
    },
    data: {
      status: true
    },
    select: {
      id: true,
      description: true,
      date: true,
      time: true,
      status: true,
      user: {
        select: {
          id: true,
          name: true
        }
      }
    }
  });

  return res.json(todo);
};

export const handleDeleteTodo = async (req: Request, res: Response) => {
  const { todo_id } = req.query;

  const valid_todo = await prismaClient.todo.findFirst({
    where: {
      id: String(todo_id),
      user_id: req.user.id
    }
  });
  
  if (!valid_todo) throw new Error('You cannot delete this todo');

  const todo = await prismaClient.todo.delete({
    where: {
      id: valid_todo.id
    },
    select: {
      id: true,
      description: true,
      date: true,
      time: true,
      status: true,
      user: {
        select: {
          id: true,
          name: true
        }
      }
    }
  });

  return res.json(todo);
};
