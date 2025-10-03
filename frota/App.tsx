import { View, StatusBar } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import Routes from "./src/routes";
import { AuthProvider } from "./src/contexts/AuthContext";
import Toast, { BaseToast, ErrorToast } from "react-native-toast-message";

const toastConfig = {
    //@ts-expect-error
    success: (props) => (
        <BaseToast
            {...props}
            style={{ width: 250, borderLeftColor: "green" }}
            // contentContainerStyle={{ paddingHorizontal: 15 }}
            text1Style={{
                fontSize: 12,
            }}
        />
    ),
    //@ts-expect-error
    error: (props) => (
        <ErrorToast
            {...props}
            style={{ width: 250, borderLeftColor: "red"}}
            text1Style={{
                fontSize: 12,
            }}
            text2Style={{
                fontSize: 9,
            }}
        />
    ),
};

export default function App() {
    return (
        <>
            <NavigationContainer>
                <AuthProvider>
                    <StatusBar backgroundColor="#1d1d2e" barStyle="light-content" translucent={false} />
                    <Routes />
                </AuthProvider>
            </NavigationContainer>
            <Toast config={toastConfig} />
        </>
    );
}
