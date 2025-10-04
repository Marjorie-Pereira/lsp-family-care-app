import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { theme } from '../constants/theme';

const Input = ( {...props}) => {
  return (
    <View style={[styles.container, props.containerStyles && props.containerStyles]}>
      
      <TextInput 
      style={{flex: 1}}
      placeholderTextColor={theme.colors.text}
      ref={props.inputRef && props.inputRef}
      {...props} />

      {props.type === 'password' ? (
        <Pressable onPress={props.togglePassword && props.togglePassword} >
          {props.icon && props.icon}
        </Pressable>
      ): (
        props.icon && props.icon
      )}
    </View>
  )
}

export default Input

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 50,
        borderWidth: 0.4,
        borderColor: theme.colors.text,
        borderRadius: theme.radius.xxl,
        borderCurve: 'continuous',
        paddingHorizontal: 18,
        gap: 12
    }
})