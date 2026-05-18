import { View, Text, Pressable,StyleSheet, FlatList } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Image } from 'expo-image'
export const ONBOARDING_DATA = [
  {
    id: '1',
    title: 'Browse Near You',
    description: 'Discover the best restaurants, cafes, and local eateries in your area with live menus and reviews.',
    image: require('../../assets/images/onboarding-browse.png'),
    backgroundColor: '#FFFFFF',
    btntext:"next"
  },
  {
    id: '2',
    title: 'Fast & Fresh Delivery',
    description: 'Your favorite meals prepared with care and delivered hot to your doorstep by our dedicated fleet.',
    image: require('../../assets/images/onboarding-delivery.png'),
    backgroundColor: '#FFF9F5',
    btntext:"next"
  },
  {
    id: '3',
    title: 'Track Your Order',
    description: 'Follow your food journey in real-time, from the restaurant kitchen straight to your front door.',
    image: require('../../assets/images/onboarding-track.png'),
    backgroundColor: '#FFEFEA',
    btntext:"Get Started"
  },
];
const GetStarted = () => {
   
  return (
    <SafeAreaView>
      <FlatList keyExtractor={item=>item.id} data={ONBOARDING_DATA} 
      renderItem={({item})=><><Image source={item.image}/>
      <Text>{item.title}</Text>
      <Text>{item.description}</Text>
      <Pressable style={style.nextBtn}><Text>{item.btntext}</Text></Pressable></>}
      pagingEnabled
      />
      
    </SafeAreaView>
  )
}

export default GetStarted

const style = StyleSheet.create(
{    nextBtn:{
            width:"100%",
            height:20,
            backgroundColor:"green",
            color:"white"
    },
    page:{
        flex:1,
        alignItems:"center"
    }
}
)
