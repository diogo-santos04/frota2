// services/locationService.ts
import { Platform } from "react-native";
import * as Device from "expo-device";
import * as Location from "expo-location";

interface EnderecoCompleto {
    cep: string;
    numero: string;
    bairro: string;
    endereco: string;
}

export const getLocalizacao = async (): Promise<EnderecoCompleto | null> => {
    if (Platform.OS === "android" && !Device.isDevice) {
        console.error("Oops, this will not work on Snack in an Android Emulator. Try it on your device!");
        return null;
    }

    // const { status } = await Location.requestForegroundPermissionsAsync();
    // if (status !== "granted") {
    //     console.error("Permission to access location was denied");
    //     return null;
    // }

    try {
        const location = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Highest,
        });
        const { latitude, longitude } = location.coords;

        const reverseGeocode = await Location.reverseGeocodeAsync({
            latitude: latitude,
            longitude: longitude,
        });

        if (reverseGeocode && reverseGeocode.length > 0) {
            const address = reverseGeocode[0];
            const endereco: EnderecoCompleto = {
                cep: address.postalCode || "",
                numero: address.streetNumber || "",
                bairro: address.district || address.subregion || "",
                endereco: address.street || address.name || "",
            };

            console.log("=== ENDERECO COMPLETO ===");
            console.log(endereco);
            console.log("===========================");

            return endereco;
        }
    } catch (error) {
        console.error("Error getting location or address:", error);
    }

    return null;
};
