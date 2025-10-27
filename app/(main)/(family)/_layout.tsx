import { Stack } from 'expo-router'

export default function Layout() {
  return (
    <Stack>
        <Stack.Screen name='index' options={{headerShown: false}}/>
        <Stack.Screen name='modal' options={{
            presentation: 'modal',
            title: 'Novo Membro'
        }}/>
        <Stack.Screen name='familyMemberInfo' />
    </Stack>
  )
}