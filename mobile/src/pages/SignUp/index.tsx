import React, { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { Text } from 'react-native';
import { TextInput } from 'react-native';
import { Image } from 'react-native';
import {
  View,
  KeyboardAvoidingView,
  StyleSheet
} from 'react-native';

import Feather from '@expo/vector-icons/Feather';

import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StackProps } from '../../routes/auth.routes';
import { useAuthContext } from '../../contexts/AuthContext';

export default function SignUp() {
  const { navigate } = useNavigation<NativeStackNavigationProp<StackProps>>();

  const { handleSignUp } = useAuthContext();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUpAction = async () => {
    if (name === '' || email === '' || password === '') {
      return;
    }

    await handleSignUp({ name, email, password });
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
      <View style={styles.form}>
        <Image style={styles.logo} source={require('../../assets/logo.png')} />
        <Text style={styles.title}>To do App</Text>
        <View style={styles.inputWrapper}>
          <Feather color={'grey'} style={styles.icon} name='user' size={20} />
          <TextInput
            placeholder='Type your name'
            style={styles.input}
            value={name}
            onChangeText={(text) => setName(text)}
          />
        </View>
        <View style={styles.inputWrapper}>
          <Feather color={'grey'} style={styles.icon} name='mail' size={20} />
          <TextInput
            placeholder='Type your email'
            autoCapitalize='none'
            style={styles.input}
            value={email}
            onChangeText={(text) => setEmail(text)}
          />
        </View>
        <View style={styles.inputWrapper}>
          <Feather color={'grey'} style={styles.icon} name='lock' size={20} />
          <TextInput
            placeholder='Type your password'
            secureTextEntry={true}
            style={styles.input}
            value={password}
            onChangeText={(text) => setPassword(text)}
          />
        </View>
        <TouchableOpacity style={styles.button} onPress={handleSignUpAction}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.links} onPress={() => navigate('SignIn')}>
          <Text>Do you have an account? Sign In</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EBEBEB',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15
  },
  form: {
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
    width: '100%',
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center'
  },
  logo: {
    width: 70,
    height: 70,
    marginBottom: 15
  },
  title: {
    fontSize: 20,
    color: '#323232',
    marginBottom: 15
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
    borderTopColor: '#EBEBEB'
  },
  links: {
    paddingVertical: 15,
  }
});
