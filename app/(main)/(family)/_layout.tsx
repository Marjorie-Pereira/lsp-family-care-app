import { Stack } from 'expo-router'
import React from 'react'

export default function Layout() {
  return (
    <Stack>
        <Stack.Screen name='family' options={{headerShown: false}}/>
        <Stack.Screen name='modal' options={{
            presentation: 'modal',
            title: 'Novo Membro'
        }}/>
        <Stack.Screen name='familyMemberInfo' />
    </Stack>
  )
}