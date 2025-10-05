import Button from '@/components/Button';
import ScreenWrapper from '@/components/ScreenWrapper';
import { supabase } from '@/lib/supabase';
import React from 'react';
import { Alert, Text } from 'react-native';

export default function Profile() {
  const onLogout = async () => {     
    const { error } = await supabase.auth.signOut();
    if(error) {
        Alert.alert('Logout', error.message)
    }
  }
  
    return (
      <ScreenWrapper>
        
        <Text>Profile Info</Text>
        <Button title='Sair' onPress={onLogout} />
      </ScreenWrapper>
      
    )
}