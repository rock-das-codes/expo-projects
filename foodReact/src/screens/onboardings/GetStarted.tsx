import { Image } from 'react-native';
import React from 'react';
import {useRef} from 'react';
import { Dimensions, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
// Updated data matching the content and yellow/black theme of the reference image
export const ONBOARDING_DATA = [
  {
    id: '1',
    title: 'Welcome to the\nmost tastiest app',
    description: 'You know, this app is edible meaning\nyou can eat it!',
    image: "https://placeholder.com/illustration1.png", // Replace with your assets
    backgroundColor: '#FFFDF6', 
    btntext: "Next"
  },
  {
    id: '2',
    title: 'We use nitro on\nBicycles for delivery!',
    description: 'For very fast delivery we use nitro on\nbicycles, kidding, but we\'re very fast.',
    image: "https://placeholder.com/illustration2.png", 
    backgroundColor: '#FFFDF6',
    btntext: "Next"
  },
  {
    id: '3',
    title: 'We\'re the besties of\nBirthday peoples',
    description: 'We send cakes to our plus members,\n(only one cake per person)',
    image: "https://placeholder.com/illustration3.png", 
    backgroundColor: '#FFFDF6',
    btntext: "Next"
  },
];

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const GetStarted = () => {
    const navigation = useNavigation();
    const flatListRef = useRef<any>(null);
    const [currentIndex, setCurrentIndex] = React.useState(0);
    const handleNext = (index: number) => {
        if( index< ONBOARDING_DATA.length - 1) {
            flatListRef.current.scrollToIndex({ index: index + 1, animated: true });
            setCurrentIndex(index + 1);
        } else {
            // Handle "Get Started" action, e.g., navigate to home screen
            navigation.replace('BottomTabs'); // Assuming you have a 'Home' screen in your navigation stack
        }
    }
    const onMomentumScrollEnd = (event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / SCREEN_WIDTH);
    setCurrentIndex(index);
  };
  return (
    <SafeAreaView style={style.safeArea}>
      <FlatList 
        ref={flatListRef}
        keyExtractor={item => item.id} 
        data={ONBOARDING_DATA}
        onMomentumScrollEnd={onMomentumScrollEnd}
        renderItem={({ item, index }) => (
          <View style={[style.pageContainer, { backgroundColor: item.backgroundColor }]}>
            
            {/* Top Section: Mascot / Illustration */}
            <View style={style.imageContainer}>
              <Image 
                source={{ uri: item.image }} 
                style={style.image}
                resizeMode="contain"
              />
            </View>

            {/* Middle Section: Text Content */}
            <View style={style.contentContainer}>
              <Text style={style.title}>{item.title}</Text>
              <Text style={style.description}>{item.description}</Text>
              
              {/* Pagination Dots Indicator */}
              <View style={style.dotsContainer}>
                {ONBOARDING_DATA.map((_, i) => (
                  <View 
                    key={i} 
                    style={[style.dot, index === i ? style.activeDot : style.inactiveDot]} 
                  />
                ))}
              </View>
            </View>

            {/* Bottom Section: Footer Action Buttons */}
            <View style={style.footer}>
              <Pressable style={style.skipBtn}>
                <Text style={style.skipBtnText}>Skip</Text>
              </Pressable>
              <Pressable onPress={() => handleNext(currentIndex)} style={style.nextBtn}>
                <Text style={style.nextBtnText}>{item.btntext}</Text>
              </Pressable>
            </View>

          </View>
        )}
        pagingEnabled
        horizontal
        showsHorizontalScrollIndicator={false}
      />
    </SafeAreaView>
  )
}

export default GetStarted

const style = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFDF6',
  },
  pageContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 40,
  },
  imageContainer: {
    flex: 1.2,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  image: {
    width: SCREEN_WIDTH * 0.8,
    height: '100%',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 30,
    justifyContent: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1C1C1E',
    textAlign: 'center',
    lineHeight: 34,
    marginBottom: 15,
    fontFamily: 'System', // Use custom font if available for the script accent style
  },
  description: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 30,
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#EAB308', // Yellow accent from design
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  inactiveDot: {
    backgroundColor: '#E5E5EA',
  },
  footer: {
    flexDirection: 'row',
    width: '100%',
    paddingHorizontal: 24,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 40, // Adjusts position relative to screen bottom
  },
  skipBtn: {
    flex: 1,
    height: 54,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    backgroundColor: '#FFFFFF',
  },
  skipBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  nextBtn: {
    flex: 1,
    height: 54,
    backgroundColor: '#212121', // Dark grey/black button from UI
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
    borderRadius: 14,
  },
  nextBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});