import CustomDrawerContent from '@/components/CustomDrawerContent';
import { Drawer } from 'expo-router/drawer';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function Layout() {
  return (
    <GestureHandlerRootView style={{flex:1}}>
        <Drawer 
        drawerContent={CustomDrawerContent}>
            <Drawer.Screen
            name='(home)'
            options={{
                drawerLabel: 'Home',
                title: 'Home',
                headerShown: false
            }}
            />
            {/* <Drawer.Screen
            name='profile'
            options={{
                drawerLabel: 'Perfil',
                title: 'Seu Perfil'
            }}
            />
            <Drawer.Screen
            name='(family)'
            options={{
                drawerLabel:"Família",
                title: 'Seus Familiares'
            }}
            />
            <Drawer.Screen
            name='settings'
            options={{
                drawerLabel:"Configurações",
                title: 'Configurações'
            }}
            />
             */}
            
        </Drawer>
    </GestureHandlerRootView>
  )
}