import Ionicons from "@expo/vector-icons/Ionicons";
import { Link } from "@react-navigation/native";
import { useState } from "react";
import { FlatList, Image, Linking, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const [passVisible,setpassVisible]=useState(false)
  const socialIcons: Array<{
    id: string;
    name: string;
    logo: React.ComponentProps<typeof Ionicons>["name"];
    url: string;
  }> = [
    { id:"1",
      name: "facebook",
      logo: "logo-facebook", // Ionicons name
      url: "https://www.facebook.com/"
    },
    { id:"2",
      name: "instagram",
      logo: "logo-instagram", // Ionicons name
      url: "https://www.instagram.com/"
    },
    { id:"3",
      name: "google",
      logo: "logo-google", // Ionicons name
      url: "https://www.google.com/"
    }
  ];
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, alignItems: "center",paddingHorizontal: 24, }}>
        <Image
          source={require("@/assets/images/icon.png")}
          style={{ width: 100, height: 100, marginTop: 100 }}
        />
        <Text style={{ fontSize: 40, fontWeight: 600, marginTop: 20,}}>Sign In</Text>
        <Text style={{marginTop:20}}>Lets experience the joy of learning react native</Text>

        <View
          style={{
            alignSelf: "stretch",
            flexDirection: "column",
            
            gap: 8,
            marginTop: 20,
          }}
        >
          <Text style={styles.label}>Email Address</Text>
          <View style={styles.inputShell}>
            <Ionicons name="mail-outline" size={22} color="#1a1a1a" style={styles.inputIcon} />
            <TextInput
              placeholder="you@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              style={styles.input}
            />
          </View>
        </View>
        <View
          style={{
            alignSelf: "stretch",
            flexDirection: "column",
           
            gap: 8,
            marginTop: 20,
          }}
        >
          <Text style={styles.label}>Password</Text>
          <View style={styles.inputShell}>
            <Ionicons name="lock-open" size={22} color="#1a1a1a" style={styles.inputIcon} />
            <TextInput
              placeholder="......."
              keyboardType="default"
              autoCapitalize="none"
              secureTextEntry={passVisible}
              style={styles.input}
            />
            <Pressable onPress={(e)=>{setpassVisible(!passVisible)}}>{passVisible?<Ionicons name="eye-off" size={22} color="#1a1a1a"/>:<Ionicons name="eye" size={22} color="#1a1a1a"/>}</Pressable>
          </View>
        </View>

        <Pressable style={{backgroundColor: "#8BC34A",
      height: 52, 
      borderRadius: 20, 
      alignSelf: "stretch", 
      justifyContent: "center", 
      alignItems: "center",
      marginTop: 24 }}><Text style={{color:"white"}}>Sign in <Ionicons name="arrow-forward"/> </Text></Pressable>
        <FlatList
         data={socialIcons}
         horizontal
         style={{flexGrow:0, marginTop:20}}
         keyExtractor={(item)=> item.id}
         contentContainerStyle={{gap:20}}
         renderItem={({item})=>(
          <Pressable style={{marginTop:20, borderWidth:1,padding:10, borderColor:"black", borderRadius:10}}  onPress={() => Linking.openURL(item.url)}>
      <Ionicons name={item.logo} size={24} color="black" />
    </Pressable>
         )}

         />
         <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 20 }}><Text>Don't have an account?</Text><Link action={null} href="#"><Text style={{textDecorationLine:"underline", color:"#8BC34A"}}>Sign Up</Text></Link></View>
         <Text style={{textDecorationLine:"underline",marginTop:20,color:"#8BC34A"}}>Forgot your password?</Text>
      </View>
     
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    fontWeight:"bold",
    color: "#333",
  },
  inputShell: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1.5,
    borderColor: "#8BC34A",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 4,
    minHeight: 52,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#111",
    paddingVertical: 12,
    paddingHorizontal: 0,
  },
});
