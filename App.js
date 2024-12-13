import { View, Text } from 'react-native'
import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import './gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { NavigationContainer } from '@react-navigation/native';

import FormBuilder from './screens/FormEditor';
import FormPreview from './screens/FormPreview';

const Stack = createStackNavigator();

const App = () => {
  return (
    <SafeAreaProvider>
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="FormBuilder" component={FormBuilder} options={{ headerShown: false }} />
        <Stack.Screen name="FormPreview" component={FormPreview} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default App;