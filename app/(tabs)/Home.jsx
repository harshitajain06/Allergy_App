import AllergenDisplay from '@/components/AllergenDisplay';
import ScanCard from '@/components/ScanCard';
import { Button, StyleSheet, Text, View } from "react-native";

export default function Home({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hey John</Text>
      <ScanCard onPress={() => navigation.navigate("Scan")}/>
      <Button
        title="Go to Details"
        onPress={() => navigation.navigate("Details")}
      />
      <AllergenDisplay onManagePress={() => navigation.navigate("Profile")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 40
  },
});
