import React, { useState } from 'react';

import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet
} from 'react-native';
import { StatusPickerProps } from '../../types';

export default function StatusPicker({
  handleChangeStatus
}: StatusPickerProps) {
  const [status, setStatus] = useState('false');

  const handleTrueStatusAction = () => {
    setStatus('true');
    handleChangeStatus('true');
  };

  const handleFalseStatusAction = () => {
    setStatus('false');
    handleChangeStatus('false');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleFalseStatusAction} style={status === 'false' ? styles.selected : styles.button}>
        <Text>In progress</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleTrueStatusAction} style={status === 'true' ? styles.selected : styles.button}>
        <Text>Done</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15
  },
  button: {
    width: '47%',
    padding: 15,
    borderRadius: 5,
    backgroundColor: '#EBEBEB',
    alignItems: 'center',
    justifyContent: 'center'
  },
  selected: {
    width: '47%',
    padding: 15,
    borderRadius: 5,
    backgroundColor: 'rgba(71, 209, 71, 0.2)',
    alignItems: 'center',
    justifyContent: 'center'
  },
});
