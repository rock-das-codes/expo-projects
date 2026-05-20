import { createNativeStackNavigator } from "@react-navigation/native-stack";
import GetStarted from "../screens/onboardings/GetStarted";

const OnBoardingStack = createNativeStackNavigator();

function OnBoardingNavigation() {
  return (
    <OnBoardingStack.Navigator>
        <OnBoardingStack.Screen options={{headerShown:false}} name="GetStarted" component={GetStarted} />
    </OnBoardingStack.Navigator>
    )
}

export default OnBoardingNavigation