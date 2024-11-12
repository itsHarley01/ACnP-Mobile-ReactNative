import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { UserProvider } from './src/Services/UserContext'; // Adjust the path as necessary
import Splash from './src/views/Splash';
import Login from './src/views/Login'; 
import Home from './src/views/Home';
import Glass from './src/views/Glass'; 
import Frame from './src/views/Frame';
import CompleteUnit from './src/views/CompleteUnit'; 
import Profile from './src/views/Profile';
import About from './src/components/About';
import Contact from './src/components/Contact';
import SignUp from './src/views/SignUp';
import ForgotPass from './src/views/ForgotPass';
import WebInfo from './src/views/WebInfo';
import Feedbacks from './src/views/Feedbacks';

const Stack = createStackNavigator();

export default function App() {
  return (
    <UserProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Splash" component={Splash} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="SignUp" component={SignUp} />
          <Stack.Screen name="ForgotPass" component={ForgotPass} />

          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Glass" component={Glass} />
          <Stack.Screen name="Frame" component={Frame} />

          <Stack.Screen name="CompleteUnit" component={CompleteUnit} />
          <Stack.Screen name="Profile" component={Profile} />
          <Stack.Screen name="WebInfo" component={WebInfo} />
          <Stack.Screen name="Feedbacks" component={Feedbacks} />

        </Stack.Navigator>
      </NavigationContainer>
    </UserProvider>
  );
}
