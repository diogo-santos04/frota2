import { useState, useEffect } from "react";
import { Platform, Text, View, StyleSheet, ActivityIndicator } from "react-native";

import * as Device from "expo-device";
import * as Location from "expo-location";

export default function Geolocalizacao() {
    const [location, setLocation] = useState<Location.LocationObject | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const [endereco, setEndereco] = useState({
        cep: "",
        numero: "",
        bairro: "",
        endereco: "",
    });

    useEffect(() => {
        async function getCurrentLocationAndAddress() {
            if (Platform.OS === "android" && !Device.isDevice) {
                setErrorMsg("Oops, this will not work on Snack in an Android Emulator. Try it on your device!");
                setIsLoading(false);
                return;
            }

            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                setErrorMsg("Permission to access location was denied");
                setIsLoading(false);
                return;
            }

            try {
                const location = await Location.getCurrentPositionAsync({
                    accuracy: Location.Accuracy.Highest,
                });
                setLocation(location);
                const { latitude, longitude } = location.coords;

                const reverseGeocode = await Location.reverseGeocodeAsync({
                    latitude: latitude,
                    longitude: longitude,
                });

                if (reverseGeocode && reverseGeocode.length > 0) {
                    const address = reverseGeocode[0];

                    let cep = address.postalCode;
                    if (cep) {
                        setEndereco((prev) => ({
                            ...prev,
                            cep: cep,
                        }));
                    }

                    let endereco = "";
                    if (address.street) {
                        endereco = address.street;
                    } else if (address.name) {
                        endereco = address.name;
                    }

                    if (endereco) {
                        setEndereco((prev) => ({
                            ...prev,
                            endereco: endereco,
                        }));
                    }

                    if (address.streetNumber) {
                        let numero = address.streetNumber;
                        setEndereco((prev) => ({
                            ...prev,
                            numero: numero,
                        }));
                    }

                    if (address.district) {
                        let bairro = address.district;
                        setEndereco((prev) => ({
                            ...prev,
                            bairro: bairro,
                        }));
                    } else if (address.subregion) {
                        let bairro = address.subregion;
                        setEndereco((prev) => ({
                            ...prev,
                            bairro: bairro,
                        }));
                    }

                    console.log("=== ENDERECO COMPLETO ===");
                    console.log(endereco);
                    console.log("===========================");
                }
            } catch (error: any) {
                console.error("Error getting location or address:", error);
            } finally {
                setIsLoading(false);
            }
        }

        getCurrentLocationAndAddress();
    }, []);

    let displayContent;
    if (isLoading) {
        displayContent = <ActivityIndicator size="large" color="#0000ff" />;
    } else if (errorMsg) {
        displayContent = <Text style={styles.paragraph}>{errorMsg}</Text>;
    } else if (location && endereco) {
        displayContent = (
            <View>
                <Text style={styles.paragraph}>coordenadas:</Text>
                <Text style={styles.coordinates}>
                    Latitude: {location.coords.latitude.toFixed(6)}
                    {"\n"}
                    Longitude: {location.coords.longitude.toFixed(6)}
                </Text>
                <Text style={styles.paragraph}>
                    <Text style={{ fontWeight: "bold" }}>localizacao agora:</Text>
                </Text>
                <Text style={styles.address}>Rua: {endereco.endereco}</Text>
                <Text style={styles.address}>CEP: {endereco.cep}</Text>
                <Text style={styles.address}>Bairro: {endereco.bairro}</Text>
                <Text style={styles.address}>Numero: {endereco.numero}</Text>
            </View>
        );
    } else {
        displayContent = <Text style={styles.paragraph}>Waiting for location...</Text>;
    }

    return <View style={styles.container}>{displayContent}</View>;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        backgroundColor: "#f0f0f0",
    },
    paragraph: {
        fontSize: 18,
        textAlign: "center",
        marginBottom: 10,
        color: "#333",
    },
    coordinates: {
        fontSize: 16,
        textAlign: "center",
        marginBottom: 20,
        color: "#555",
    },
    address: {
        fontSize: 20,
        fontWeight: "bold",
        textAlign: "center",
        color: "#007bff",
    },
});
