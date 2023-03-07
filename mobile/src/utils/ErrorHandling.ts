import { AxiosError } from 'axios';
import Toast from 'react-native-toast-message';

export class ErrorHandling extends Error {
  constructor(err: unknown) {
    super();

    if (err instanceof AxiosError) {
      console.log(err.response?.data.error);
      Toast.show({
        type: 'error',
        text1: err.response?.data.error
      });
      return;
    }

    if (err instanceof Error) {
      console.log(err.message);
      Toast.show({
        type: 'error',
        text1: err.message
      });
      return;
    }

    console.log(err);
  }
}