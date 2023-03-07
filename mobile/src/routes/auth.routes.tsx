import React from 'react';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';

export type StackProps = {
  SignIn: undefined,
  SignUp: undefined,
}

const Stack = createNativeStackNavigator<StackProps>();

export default function AuthRouter() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name='SignIn'
        component={SignIn}
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen
        name='SignUp'
        component={SignUp}
      />
    </Stack.Navigator>
  );
}
