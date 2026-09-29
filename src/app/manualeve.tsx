import { StyleSheet, Text, View } from 'react-native';

export default function ManuaLeve() {
  return (
    <View style={styles.container}>
      <Text style={styles.texto}>ManuaLeve (em construção)</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  texto: {
    fontSize: 18,
    color: '#999',
  },
});