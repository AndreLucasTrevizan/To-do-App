import React from 'react';

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity
} from 'react-native';

import { TodoProps } from '../../types';

import Feather from '@expo/vector-icons/Feather';

export default function Todo({
  data,
  handleGetTodo,
  handleDeleteTodo,
  handleFinishTodo
}: TodoProps) {

  const handleUpdateTodoAction = () => {
    handleGetTodo(data);
  };

  const handleDeleteTodoAction = () => {
    handleDeleteTodo(data);
  };

  const handleFinishTodoAction = () => {
    handleFinishTodo(data);
  }

  return (
    <View style={styles.container}>
      <View>
        <Text>{data.date} as {data.time}</Text>
        <Text style={styles.description}>{data.description}</Text>
      </View>
      {(
        data.status === false &&
        data.date === new Date().toLocaleDateString('pt-br')
        ) && <View style={styles.actions}>
        <TouchableOpacity style={styles.button} onPress={handleFinishTodoAction}>
          <Feather name='check' size={25} color='grey' />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleUpdateTodoAction}>
          <Feather name='edit' size={25} color='grey' />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleDeleteTodoAction}>
          <Feather name='x' size={25} color='grey' />
        </TouchableOpacity>
      </View>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 15,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#EBEBEB',
    marginBottom: 15
  },
  button: {
    paddingHorizontal: 15
  },
  description: {
    fontSize: 18,
    marginTop: 5,
    paddingTop: 15
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingTop: 15
  }
});
