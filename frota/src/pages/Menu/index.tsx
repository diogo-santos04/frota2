import React, { useContext } from "react";
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, SafeAreaView, Image } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { Feather, MaterialIcons, FontAwesome5, MaterialCommunityIcons, FontAwesome6 } from "@expo/vector-icons";
import { AuthContext } from "../../contexts/AuthContext";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackParamsList } from "../../routes/app.routes";
import { useNavigation } from "@react-navigation/native";

const Menu = () => {
    const { user, signOut, profissional, motorista } = useContext(AuthContext);
    const navigation = useNavigation<NativeStackNavigationProp<StackParamsList>>();

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
                        <View style={{ flex: 1}}>
                            <Text style={styles.userName}>{user.nome}</Text>
                            <Text style={styles.userRole}>MOTORISTA</Text>
                        </View>
                        <TouchableOpacity style={styles.logoutButton} onPress={() => {signOut()}}>
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
                <View style={[{ flex: 1}]}>
                    <View style={styles.cardRow}>
                        <TouchableOpacity style={[styles.card, { backgroundColor: "#E3F2FD" }]} onPress={() => { navigation.navigate("RegistrarViagem")}}>
                            <Icon name="add-road" size={40} color="#2196F3" />
                            <Text style={styles.cardText}>Registrar{"\n"}Viagem</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.card, { backgroundColor: "#E8F5E8" }]} onPress={() => {navigation.navigate("ViagensEmAndamento")}}>
                            <Icon name="directions-car" size={40} color="#4CAF50" />
                            <Text style={styles.cardText}>Viagens em{"\n"}Andamento</Text>  
                        </TouchableOpacity>
                    </View>

                    <View style={styles.cardRow}>
                        <TouchableOpacity style={[styles.card, { backgroundColor: "#FFF3E0" }]} onPress={() => {navigation.navigate("RegistrarAbastecimento")}}>
                            <Icon name="local-gas-station" size={40} color="#FF9800" />
                            <Text style={styles.cardText}>Solicitar{"\n"}Abastecimento</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.card, { backgroundColor: "#FFEBEE" }]} onPress={() => {navigation.navigate("RegistrarVistoria")}}>
                            <MaterialIcons name="car-repair" size={40} color="#F44336" />
                            <Text style={styles.cardText}>Solicitar {"\n"} Vistoria</Text>
                        </TouchableOpacity>

                        {/* <TouchableOpacity style={[styles.card, { backgroundColor: "#FFEBEE" }]} onPress={() => {navigation.navigate("GerarQrCode")}}>
                            <MaterialCommunityIcons name="qrcode" size={40} color="#F44336" />
                            <Text style={styles.cardText}>Gerar{"\n"}QR Code</Text>
                        </TouchableOpacity> */}
                    </View>

                    <View style={styles.cardRow}>
                        <TouchableOpacity style={[styles.card, { backgroundColor: "#F3E5F5" }]} onPress={() => {navigation.navigate("Historico")}}>
                            <Icon name="history" size={40} color="#9C27B0" />
                            <Text style={styles.cardText}>Histórico</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.card, { backgroundColor: "#E3F2FD" }]} onPress={() => {navigation.navigate("RegistrarManutencao")}}>
                            <MaterialCommunityIcons name="car-wrench" size={40} color="#2196F3" />
                            <Text style={styles.cardText}>Solicitar{"\n"}Manutenção</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#0B7EC8",
    },
    header: {
        backgroundColor: "#0B7EC8",
        paddingBottom: 25,
        paddingTop: 20,
    },
    headerContent: {
        paddingHorizontal: 25,
        paddingTop: 15,
    },
    headerTop: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 25,
        position: "relative",
    },
    logoContainer: {
        position: "absolute",
        left: 0,
        right: 0,
        alignItems: "center",
        zIndex: 1,
        paddingTop: 20
    },
    logoText: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#FFFFFF",
        letterSpacing: 2,
    },
    logoutButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(255, 255, 255, 0.15)",
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.3)",
        zIndex: 2,
    },
    logoutText: {
        fontSize: 12,
        color: "#FFFFFF",
        fontWeight: "600",
        marginLeft: 6,
        letterSpacing: 0.5,
    },
    userInfo: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
    },
    userAvatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: "#FFFFFF",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 18,
    },
    userName: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#FFFFFF",
        marginBottom: 4,
    },
    userRole: {
        fontSize: 14,
        color: "#E3F2FD",
        letterSpacing: 0.5,
    },
    userIdContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 25,
    },
    userIdLabel: {
        fontSize: 12,
        color: "#E3F2FD",
        marginLeft: 6,
        marginRight: 10,
    },
    userId: {
        fontSize: 14,
        color: "#FFFFFF",
        fontWeight: "500",
        flex: 1,
    },
    mainContent: {
        flex: 1,
        padding: 25,
        backgroundColor: "#F5F5F5",
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        marginTop: -15,
    },
    cardRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 25,
    },
    cardRowCenter: {
        flexDirection: "row",
        justifyContent: "center",
        marginBottom: 25,
    },
    card: {
        flex: 1,
        aspectRatio: 1,
        borderRadius: 16,
        padding: 25,
        alignItems: "center",
        justifyContent: "center",
        marginHorizontal: 10,
        elevation: 6,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.12,
        shadowRadius: 4.5,
    },
    cardText: {
        fontSize: 14,
        fontWeight: "600",
        color: "#333",
        textAlign: "center",
        marginTop: 12,
        lineHeight: 18,
    },
});

export default Menu;