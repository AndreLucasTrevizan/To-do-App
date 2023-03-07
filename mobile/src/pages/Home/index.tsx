import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  ActivityIndicator
} from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import DatePicker from '../../components/DatePicker';
import StatusPicker from '../../components/StatusPicker';
import { TodoData } from '../../types';
import { ErrorHandling } from '../../utils/ErrorHandling';
import { api } from '../../services/api';
import Todo from '../../components/Todo';
import { useAuthContext } from '../../contexts/AuthContext';
import Toast from 'react-native-toast-message';

export default function Home() {
  const [todos, setTodos] = useState<TodoData[] | []>([]);
  const [selectedTodo, setSelectedTodo] = useState<TodoData | null>(null);
  const [updating, setUpdating] = useState(false);
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(Date.now());
  const [status, setStatus] = useState('false');
  const [loading, setLoading] = useState(false);

  const { handleSignOut } = useAuthContext();

  useEffect(() => {
    async function loadTodos() {
      try {
        setLoading(true);
        
        const response = await api.get('/todo', {
          params: {
            status,
            date
          }
        });
        
        setTodos(response.data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        new ErrorHandling(error);
      }
    }

    loadTodos();
  }, [ date, status ]);

  const handleChangeDate = (data: number) => {
    setDate(data);
  };

  const handleChangeStatus = (status: string) => {
    setStatus(status);
  };

  const handleCreateTodo = async () => {
    try {
      if (description === '') return;
      
      setLoading(true);

      const response = await api.post('/todo', { description });

      setTodos(oldTodos => [ response.data, ...oldTodos ]);
      Toast.show({
        type: 'success',
        text1: 'To do created',
      });
      setDescription('');
      setLoading(false);
    } catch (error) {
      setLoading(false);
      new ErrorHandling(error);
    }
  };

  const handleSelectTodo = (todo: TodoData) => {
    setSelectedTodo(todo);
    setDescription(todo.description);
    setUpdating(true);
  };

  const handleCancelUpdate = () => {
    setDescription('');
    setUpdating(false);
  };

  const handleEditTodo = async () => {
    try {
      if (description === '') return;
      
      setLoading(true);

      const response = await api.patch('/todo', { description }, {
        params: {
          todo_id: selectedTodo?.id
        }
      });

      let list = todos;

      const todoIndex = todos.findIndex((todo) => todo.id === selectedTodo?.id);

      list[todoIndex] = response.data;

      setTodos(list);
      Toast.show({
        type: 'success',
        text1: 'To do updated',
      });
      setDescription('');
      setUpdating(false);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      new ErrorHandling(error);
    }
  };

  const handleDeleteTodo = async (data: TodoData) => {
    try {
      setLoading(true);

      await api.delete('/todo', {
        params: {
          todo_id: data.id
        }
      });

      let list = todos.filter(item => item.id !== data?.id);

      setTodos(list);
      Toast.show({
        type: 'success',
        text1: 'To do deleted',
      });
      setLoading(false);
    } catch (error) {
      setLoading(false);
      new ErrorHandling(error);
    }
  };

  const handleFinishTodo = async (data: TodoData) => {
    try {
      setLoading(true);

      await api.patch('/todo/finish', {}, {
        params: {
          todo_id: data.id
        }
      });

      let list = todos.filter(item => item.id !== data?.id);

      setTodos(list);
      Toast.show({
        type: 'success',
        text1: 'To do finished',
      });
      setLoading(false);
    } catch (error) {
      setLoading(false);
      new ErrorHandling(error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <View style={styles.formContainerHeader}>
          <Text style={styles.title}>To Do Form</Text>
          <TouchableOpacity style={styles.buttonSignOut} onPress={handleSignOut}>
            <Text style={styles.buttonSignOutText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.inputWrapper}>
          <Feather color={'grey'} style={styles.icon} name='plus' size={20} />
          <TextInput
            style={styles.input}
            placeholder='Type your to do here'
            value={description}
            onChangeText={(text) => setDescription(text)}
          />
        </View>
        {updating && <View style={styles.updateView}>
          <TouchableOpacity style={styles.cancelButton} onPress={handleCancelUpdate}>
            <Feather name='x' size={20} color='#FFFFFF' />
          </TouchableOpacity>
          <TouchableOpacity style={styles.updateButton} onPress={handleEditTodo}>
            <Text style={styles.buttonText}>Update To Do</Text>
          </TouchableOpacity>
        </View>}
        {!updating && <TouchableOpacity style={styles.button} onPress={handleCreateTodo}>
          <Text style={styles.buttonText}>Create To Do</Text>
        </TouchableOpacity>}
        <View style={styles.divider}></View>
        <DatePicker handleChangeDate={handleChangeDate} />
        <StatusPicker handleChangeStatus={handleChangeStatus} />
        {loading && <View style={styles.loading}>
          <ActivityIndicator size={60} color='#04B3CB' />
        </View>}
        {!loading && <FlatList
          style={styles.list}
          data={todos}
          keyExtractor={(item) => item.id}
          renderItem={({item}) => (
            <Todo
              data={item}
              handleGetTodo={handleSelectTodo}
              handleDeleteTodo={handleDeleteTodo}
              handleFinishTodo={handleFinishTodo}
            />
          )}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={(
            status === 'false' ? (
              <Text style={styles.text}>You don't have any to do</Text>
            ) : (
              <Text style={styles.text}>You didn't complete any to do</Text>
            )
          )}
        />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EBEBEB',
    padding: 15
  },
  formContainer: {
    flex: 1,
    width: '100%',
    padding: 15,
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
  },
  formContainerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15
  },
  title: {
    fontSize: 25,
    color: '#323232'
  },
  buttonSignOut: {},
  buttonSignOutText: {
    fontSize: 18,
    color: '#FF5A5A'
  },
  inputWrapper: {
    width: '100%',
  },
  icon: {
    position: 'absolute',
    top: 15,
    left: 10
  },
  input: {
    height: 50,
    width: '100%',
    paddingLeft: 40,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#EBEBEB',
    fontSize: 18,
    color: '#323232',
    marginBottom: 15,
  },
  cancelButton: {
    width: '30%',
    height: 50,
    backgroundColor: '#FF5A5A',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5
  },
  updateView: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  updateButton: {
    width: '65%',
    height: 50,
    backgroundColor: '#04B3CB',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#04B3CB',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF'
  },
  divider: {
    width: '100%',
    borderTopWidth: 1,
    borderTopColor: '#EBEBEB',
    marginVertical: 15
  },
  loading: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15
  },
  text: {
    textAlign: 'center',
    marginTop: 15,
    fontSize: 18,
  },
  list: {
    paddingTop: 15
  }
});
