import React, { useState } from 'react';

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet
} from 'react-native';

import Feather from '@expo/vector-icons/Feather';
import { DatePickerProps } from '../../types';

export default function DatePicker({
  handleChangeDate
}: DatePickerProps) {
  const [date, setDate] = useState(Date.now());

  const handleIncreaseDateAction = () => {
    setDate(date + 60 * 60 * 1000 * 24);
    handleChangeDate(date + 60 * 60 * 1000 * 24);
  };

  const handleDecreaseDateAction = () => {
    setDate(date - 60 * 60 * 1000 * 24);
    handleChangeDate(date - 60 * 60 * 1000 * 24);
  };

  return (
    <View style={styles.container}>
      <View style={styles.picker}>
        <TouchableOpacity style={styles.pickerButton} onPress={handleDecreaseDateAction}>
          <Feather color='grey' name='chevron-left' size={25} />
        </TouchableOpacity>
        <Text style={styles.pickerText}>{new Date(date).toLocaleDateString()}</Text>
        <TouchableOpacity style={styles.pickerButton} onPress={handleIncreaseDateAction}>
          <Feather color='grey' name='chevron-right' size={25} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
  },
  picker: {
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row'
  },
  pickerText: {
    fontSize: 18,
    color: '#323232'
  },
  pickerButton: {
    padding: 15,
    borderRadius: 5,
    backgroundColor: '#EBEBEB',
  }
});
