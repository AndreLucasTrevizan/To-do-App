import { AxiosError } from 'axios';
import { toast } from 'react-toastify';

export class ErrorHandling extends Error {
  constructor(error: unknown) {
    super();

    if (error instanceof AxiosError) {
      console.log(error.response.data.error);
      toast.error(error.response.data.error);
      return;
    }

    if (error instanceof Error) {
      console.log(error.message);
      toast.error(error.message);
      return;
    }

    console.log(error);
    toast.error('Something wrong happened');
    return;
  }
}