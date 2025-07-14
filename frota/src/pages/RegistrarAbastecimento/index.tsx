import React, { useState } from "react";
import { SafeAreaView, View, Text, TouchableOpacity, ScrollView, StyleSheet, TextInput, ActivityIndicator } from "react-native";
import { Feather } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackParamsList } from "../../routes/app.routes";
import { useNavigation } from "@react-navigation/native";
import { api } from "../../services/api";

export default function RegistrarAbastecimento() {
    const navigation = useNavigation<NativeStackNavigationProp<StackParamsList>>();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        id: "",
        veiculo_id: "",
        motorista_id: "",
        data_abastecimento: "",
        km: "",
        litros: "",
        tipo: "",
    });

    async function handleSubmit(){
        setLoading(true);
        try {
            const response = await api.post("/abastecimento", formData);
            console.log(response.data);
        } catch (error) {
            console.log(error);
        }finally{
            setLoading(false);
        }
    }

    const updateFormData = (field: string, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <View style={styles.headerContent}>
                    <TouchableOpacity
                        style={styles.homeButton}
                        onPress={() => {
                            navigation.navigate("Menu");
                        }}
                    >
                        <Feather name="home" size={20} color="#0B7EC8" />
                    </TouchableOpacity>
                    <View style={styles.logoContainer}>
                        <Text style={styles.logoText}>FROTA</Text>
                    </View>
                </View>
            </View>

            <ScrollView style={styles.mainContent} showsVerticalScrollIndicator={false}>
                <Text style={styles.formTitle}>Solicitação de Abastecimento</Text>

                <View style={styles.fieldContainer}>
                    <Text style={styles.label}>Data da solicitação(DATE)</Text>
                    <TextInput
                        placeholder="Data da solicitação"
                        style={styles.input}
                        placeholderTextColor="grey"
                        value={formData.data_abastecimento}
                        onChangeText={(text) => updateFormData("data_abastecimento", text)}
                        keyboardType="default"
                    />
                </View>

                <View style={styles.fieldContainer}>
                    <Text style={styles.label}>Quilometragem</Text>
                    <TextInput
                        placeholder="Quilometragem"
                        style={styles.input}
                        placeholderTextColor="grey"
                        value={formData.km}
                        onChangeText={(text) => updateFormData("km", text)}
                        keyboardType="numeric"
                    />
                </View>

                <View style={styles.fieldContainer}>
                    <Text style={styles.label}>Litros</Text>
                    <TextInput placeholder="Litros" style={styles.input} placeholderTextColor="grey" value={formData.litros} onChangeText={(text) => updateFormData("litros", text)} keyboardType="numeric" />
                </View>

                <View style={styles.fieldContainer}>
                    <Text style={styles.label}>Tipo(Alcool, gasolina...)</Text>
                    <TextInput
                        placeholder="Ex: alcool,gasolina..."
                        style={styles.input}
                        placeholderTextColor="grey"
                        value={formData.tipo}
                        onChangeText={(text) => updateFormData("tipo", text)}
                        keyboardType="numeric"
                    />
                </View>

                <TouchableOpacity style={[styles.button, styles.submitButton, loading && styles.buttonDisabled]} onPress={handleSubmit} disabled={loading}>
                    {loading ? <ActivityIndicator size={25} color="#FFF" /> : <Text style={styles.buttonText}>Registrar</Text>}
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

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
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 25,
        paddingTop: 15,
        position: "relative",
    },
    homeButton: {
        backgroundColor: "#FFFFFF",
        borderRadius: 25,
        padding: 8,
        position: "absolute",
        left: 25,
        top: 15,
        zIndex: 1,
        alignItems: "center",
        justifyContent: "center",
        width: 45,
        height: 45,
    },
    logoContainer: {
        alignItems: "center",
        marginBottom: 25,
        flex: 1,
    },
    headerTitleContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        marginLeft: 40,
        marginRight: 40,
    },
    logoText: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#FFFFFF",
        letterSpacing: 2,
    },
    mainContent: {
        flex: 1,
        padding: 25,
        backgroundColor: "#F5F5F5",
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        marginTop: -15,
    },
    formTitle: {
        fontSize: 20,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 20,
        color: "#333",
    },
    fieldContainer: {
        width: "100%",
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: "500",
        color: "#333",
        marginBottom: 8,
    },
    input: {
        width: "100%",
        height: 50,
        backgroundColor: "white",
        borderRadius: 8,
        paddingHorizontal: 16,
        color: "#000",
        fontSize: 16,
        borderWidth: 2,
        borderColor: "#3A3F5A",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
    },
    textArea: {
        height: 80,
        textAlignVertical: "top",
        paddingTop: 12,
    },
    button: {
        width: "100%",
        height: 50,
        backgroundColor: "#0B7EC8",
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#2952CC",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
        marginBottom: 20,
    },
    submitButton: {
        backgroundColor: "#28a745",
        marginTop: 10,
        marginBottom: 30,
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: "600",
        color: "white",
        textTransform: "uppercase",
        letterSpacing: 0.5,
    },
});
