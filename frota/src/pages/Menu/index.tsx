import React, { useContext, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, SafeAreaView, Image, Alert } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { Feather, MaterialIcons, FontAwesome5, MaterialCommunityIcons, FontAwesome6 } from "@expo/vector-icons";
import { AuthContext } from "../../contexts/AuthContext";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackParamsList } from "../../routes/app.routes";
import { useNavigation } from "@react-navigation/native";
import * as Location from "expo-location";
import Toast from "react-native-toast-message";
import { styles } from "./styles";

const Menu = () => {
    const { user, signOut, profissional, motorista } = useContext(AuthContext);
    const navigation = useNavigation<NativeStackNavigationProp<StackParamsList>>();

    useEffect(() => {
        async function checkLocationStatus() {
            const isEnabled = await Location.hasServicesEnabledAsync();
            if (!isEnabled) {
                Alert.alert("Localização Desativada", "Por favor, ative os serviços de localização do seu celular para registrar as viagens corretamente.", [{ text: "OK" }]);
                return;
            }

            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                Toast.show({
                    type: "error",
                    text1: "Permissão de localização negada",
                    text2: "Não será possível registrar a localização da saída da viagem.",
                });
                return;
            }
        }

        checkLocationStatus();
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor="#0B7EC8" barStyle="light-content" />

            <View style={styles.header}>
                <View style={styles.headerContent}>
                    <View style={styles.headerTop}>
                        <View style={styles.logoContainer}>
                            <Text style={styles.logoText}>FROTA</Text>
                        </View>
                    </View>

                    <View style={styles.userInfo}>
                        <View style={styles.userAvatar}>
                            <Icon name="person" size={36} color="#0B7EC8" />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.userName}>{user.nome}</Text>
                            <Text style={styles.userRole}>MOTORISTA</Text>
                        </View>
                        <TouchableOpacity
                            style={styles.logoutButton}
                            onPress={() => {
                                signOut();
                            }}
                        >
                            <Icon name="logout" size={20} color="#FFFFFF" />
                            <Text style={styles.logoutText}>SAIR</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.userIdContainer}>
                        <Icon name="badge" size={18} color="white" />
                        <Text style={styles.userIdLabel}>MATRÍCULA</Text>
                        <Text style={styles.userId}>{profissional.matricula}</Text>
                    </View>
                </View>
            </View>

            <View style={styles.mainContent}>
                <View style={[{ flex: 1 }]}>
                    <View style={styles.cardRow}>
                        <TouchableOpacity
                            style={[styles.card, { backgroundColor: "#E3F2FD" }]}
                            onPress={() => {
                                navigation.navigate("RegistrarViagem");
                            }}
                        >
                            <Icon name="add-road" size={40} color="#2196F3" />
                            <Text style={styles.cardText}>Registrar{"\n"}Viagem</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.card, { backgroundColor: "#E8F5E8" }]}
                            onPress={() => {
                                navigation.navigate("ViagensEmAndamento");
                            }}
                        >
                            <Icon name="directions-car" size={40} color="#4CAF50" />
                            <Text style={styles.cardText}>Viagem em{"\n"}Andamento</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.cardRow}>
                        <TouchableOpacity
                            style={[styles.card, { backgroundColor: "#FFF3E0" }]}
                            onPress={() => {
                                navigation.navigate("RegistrarAbastecimento");
                            }}
                        >
                            <Icon name="local-gas-station" size={40} color="#FF9800" />
                            <Text style={styles.cardText}>Solicitar{"\n"}Abastecimento</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.card, { backgroundColor: "#FFEBEE" }]}
                            onPress={() => {
                                navigation.navigate("RegistrarVistoria");
                            }}
                        >
                            <MaterialIcons name="car-repair" size={40} color="#F44336" />
                            <Text style={styles.cardText}>Solicitar {"\n"} Vistoria</Text>
                        </TouchableOpacity>

                        {/* <TouchableOpacity style={[styles.card, { backgroundColor: "#FFEBEE" }]} onPress={() => {navigation.navigate("GerarQrCode")}}>
                            <MaterialCommunityIcons name="qrcode" size={40} color="#F44336" />
                            <Text style={styles.cardText}>Gerar{"\n"}QR Code</Text>
                        </TouchableOpacity> */}
                    </View>

                    <View style={styles.cardRow}>
                        <TouchableOpacity
                            style={[styles.card, { backgroundColor: "#F3E5F5" }]}
                            onPress={() => {
                                navigation.navigate("Historico");
                            }}
                        >
                            <Icon name="history" size={40} color="#9C27B0" />
                            <Text style={styles.cardText}>Histórico</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.card, { backgroundColor: "#E3F2FD" }]}
                            onPress={() => {
                                navigation.navigate("RegistrarManutencao");
                            }}
                        >
                            <MaterialCommunityIcons name="car-wrench" size={40} color="#2196F3" />
                            <Text style={styles.cardText}>Solicitar{"\n"}Manutenção</Text>
                        </TouchableOpacity>
                    </View>

                    {/* <View style={styles.cardRow}>
                        <TouchableOpacity style={[styles.card, { backgroundColor: "#F3E5F5" }]} onPress={() => {navigation.navigate("Geolocalizacao")}}>
                            <Icon name="history" size={40} color="#9C27B0" />
                            <Text style={styles.cardText}>Teste geolocalizacao</Text>
                        </TouchableOpacity>
                    </View> */}
                </View>
            </View>
        </SafeAreaView>
    );
};

export default Menu;
