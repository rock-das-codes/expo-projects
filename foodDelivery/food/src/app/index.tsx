import { Text, View, StyleSheet } from "react-native";
import GetStarted from "./onboarding/GetStarted";

export default function Index() {
  return (
    <View style={styles.container}>
      <GetStarted/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
