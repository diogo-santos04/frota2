import React, { useEffect, useState } from "react";
import { View, Text, SafeAreaView, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { api } from "../../services/api";
import { useRoute, RouteProp, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackParamsList } from "../../routes/app.routes";
import Toast from "react-native-toast-message";
import { Feather, MaterialIcons, FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";

interface ViagemDestino {
    viagem_id: number;
    data_saida: string | Date;
    km_saida: number;
    km_chegada: number;
    km_total: number;
    local_saida: string;
    local_destino: string;
    nota: string;
    status: string;
}

type RouteDetailParams = {
    FinalizarViagem: {
        viagem_id: number;
    };
};

type OrderRouteProps = RouteProp<RouteDetailParams, "FinalizarViagem">;

export default function FinalizarViagem() {
    const route = useRoute<OrderRouteProps>();
    const navigation = useNavigation<NativeStackNavigationProp<StackParamsList>>();

    const [submitting, setSubmitting] = useState(false);

    const [formData, setFormData] = useState<ViagemDestino>({
        viagem_id: route.params.viagem_id,
        data_saida: "",
        km_saida: 0,
        km_chegada: 0,
        km_total: 0,
        local_saida: "",
        local_destino: "",
        nota: "",
        status: "Finalizado",
    });

    const updateFormData = (field: keyof ViagemDestino, value: string | number) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    async function handleSubmit() {
        console.log(formData);
        setSubmitting(true);
        if (!formData.km_chegada) {
            Toast.show({
                type: "error",
                text1: "Preencha os campos obrigatórios",
            });
            setSubmitting(false);
            return;
        }

        if (formData.km_chegada < formData.km_saida) {
            Toast.show({
                type: "error",
                text1: "Valor para Km inválido",
                text2: "Chegada deve ser maior ou igual a saida !",
            });
            setSubmitting(false);
            return;
        }

        const kmSaida = formData.km_saida;
        const kmChegada = formData.km_chegada;

        const totalKm = kmChegada - kmSaida;
        
        const updatedFormData = {
            ...formData,
            km_total: totalKm,
        };
        try {
            const response = await api.post("viagem_destino", updatedFormData);
            console.log(response.data);
            Toast.show({
                type: "success",
                text1: "Viagem finalizada com sucesso",
            });
            navigation.navigate("ViagensEmAndamento");
        } catch (error) {
            console.log(error);
        } finally {
            setSubmitting(false);
        }
    }

    useEffect(() => {
        async function getViagem() {
            const response = await api.post("viagem/detalhes", {
                viagem_id: route.params.viagem_id,
            });

            setFormData((prev) => ({
                ...prev,
                data_saida: response.data.data_viagem,
                km_saida: parseFloat(response.data.km_inicial),
                local_saida: response.data.local_saida,
                local_destino: response.data.destino,
                nota: response.data.nota,
            }));
        }

        getViagem();
    }, []);

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
                <Text style={styles.formTitle}>Finalizar viagem</Text>

                <View style={styles.fieldContainer}>
                    <Text style={styles.label}>Km chegada *</Text>
                    <TextInput
                        keyboardType="numeric"
                        placeholder="Km chegada"
                        style={styles.input}
                        placeholderTextColor="grey"
                        value={formData.km_chegada.toString()}
                        onChangeText={(text) => updateFormData("km_chegada", text === "" ? 0 : parseFloat(text))}
                    />
                </View>

                <View style={styles.fieldContainer}>
                    <Text style={styles.label}>Observações (Nota)</Text>
                    <TextInput
                        placeholder="Adicione observações"
                        style={[styles.input, styles.textArea]}
                        placeholderTextColor="grey"
                        multiline
                        numberOfLines={4}
                        value={formData.nota ? formData.nota : ""}
                        onChangeText={(text) => updateFormData("nota", text)}
                    />
                </View>

                <TouchableOpacity style={[styles.button, styles.submitButton]} onPress={handleSubmit}>
                    {submitting ? <ActivityIndicator size={25} color="#FFF" /> : <Text style={{ color: "#FFF", fontSize: 18, fontWeight: "bold" }}>Finalizar Viagem</Text>}
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
        paddingHorizontal: 25,
        paddingTop: 15,
    },
    logoContainer: {
        alignItems: "center",
        marginBottom: 25,
    },
    logoText: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#FFFFFF",
        letterSpacing: 2,
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
    formTitle: {
        fontSize: 20,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 20,
        color: "#333",
    },
    mainContent: {
        flex: 1,
        padding: 25,
        backgroundColor: "#F5F5F5",
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        marginTop: -15,
    },
    label: {
        fontSize: 14,
        fontWeight: "500",
        color: "#333",
        marginBottom: 8,
    },
    fieldContainer: {
        width: "100%",
        marginBottom: 20,
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
});
