import React, { useEffect, useState } from "react";
import { View, Text, SafeAreaView, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert } from "react-native";
import { api } from "../../services/api";
import { useRoute, RouteProp, useNavigation } from "@react-navigation/native";

interface ViagemDestino {
    viagem_id: number;
    data_saida: string | Date;
    data_chegada: string | Date;
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


    const [formData, setFormData] = useState<ViagemDestino>({
        viagem_id: route.params.viagem_id,
        data_saida: "",
        data_chegada: "",
        km_saida: 0,
        km_chegada: 0,
        km_total: 0,
        local_saida: "",
        local_destino: "",
        nota: "",
        status: "",
    });

    const updateFormData = (field: keyof ViagemDestino, value: string | number) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    async function handleSubmit(){
        if (!formData.data_saida || !formData.data_chegada || !formData.km_saida || !formData.km_chegada || !formData.local_saida || !formData.local_destino) {
            Alert.alert("Erro", "Por favor, preencha todos os campos obrigatórios.");
            return;
        }

        const kmSaidaNum = parseFloat(formData.km_saida.toString());
        const kmChegadaNum = parseFloat(formData.km_chegada.toString());
        if (!isNaN(kmSaidaNum) && !isNaN(kmChegadaNum)) {
            const totalKm = kmChegadaNum - kmSaidaNum;
            setFormData((prev) => ({
                ...prev,
                km_total: totalKm,
            }));
        } else {
            Alert.alert("Erro", "Valores de Km Saída ou Km Chegada inválidos.");
        }

        const response = await api.post("viagem_destino", formData);
    };

    useEffect(() => {
        async function getViagem(){
            const response = await api.post("viagem/detalhes", {
                viagem_id: route.params.viagem_id
            });
            
            console.log("RESPONSE",response.data);
           setFormData(response.data);
           console.log("get viagem", formData);
        }

        getViagem();
    },[])

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <View style={styles.headerContent}>
                    <View style={styles.logoContainer}>
                        <Text style={styles.logoText}>FROTA</Text>
                    </View>
                </View>
            </View>

            <ScrollView style={styles.mainContent} showsVerticalScrollIndicator={false}>
                <Text style={styles.formTitle}>Finalizar viagem</Text>
                <View style={styles.fieldContainer}>
                    <Text style={styles.label}>Data Saida *</Text>
                    <TextInput placeholder="DD/MM/AAAA" style={styles.input} placeholderTextColor="grey" value={formData.data_saida as string} onChangeText={(text) => updateFormData("data_saida", text)} />
                </View>

                <View style={styles.fieldContainer}>
                    <Text style={styles.label}>Data Chegada *</Text>
                    <TextInput placeholder="DD/MM/AAAA" style={styles.input} placeholderTextColor="grey" value={formData.data_chegada as string} onChangeText={(text) => updateFormData("data_chegada", text)} />
                </View>

                <View style={styles.fieldContainer}>
                    <Text style={styles.label}>Km saida *</Text>
                    <TextInput keyboardType="numeric" placeholder="Km saida" style={styles.input} placeholderTextColor="grey" value={formData.km_saida.toString()} onChangeText={(text) => updateFormData("km_saida", text === "" ? 0 : parseFloat(text))} />
                </View>

                <View style={styles.fieldContainer}>
                    <Text style={styles.label}>Km chegada *</Text>
                    <TextInput keyboardType="numeric" placeholder="Km chegada" style={styles.input} placeholderTextColor="grey" value={formData.km_chegada.toString()} onChangeText={(text) => updateFormData("km_chegada", text === "" ? 0 : parseFloat(text))} />
                </View>

                <View style={styles.fieldContainer}>
                    <Text style={styles.label}>Local de Saída *</Text>
                    <TextInput placeholder="Local de Saída" style={styles.input} placeholderTextColor="grey" value={formData.local_saida} onChangeText={(text) => updateFormData("local_saida", text)} />
                </View>

                <View style={styles.fieldContainer}>
                    <Text style={styles.label}>Local de Destino *</Text>
                    <TextInput placeholder="Local de Destino" style={styles.input} placeholderTextColor="grey" value={formData.local_destino} onChangeText={(text) => updateFormData("local_destino", text)} />
                </View>

                <View style={styles.fieldContainer}>
                    <Text style={styles.label}>Observações (Nota)</Text>
                    <TextInput placeholder="Adicione observações" style={[styles.input, styles.textArea]} placeholderTextColor="grey" multiline numberOfLines={4} value={formData.nota} onChangeText={(text) => updateFormData("nota", text)} />
                </View>

                <View style={styles.fieldContainer}>
                    <Text style={styles.label}>Status</Text>
                    <TextInput placeholder="Status da viagem" style={styles.input} placeholderTextColor="grey" value={formData.status} onChangeText={(text) => updateFormData("status", text)} />
                </View>

                <TouchableOpacity style={[styles.button, styles.submitButton]} onPress={handleSubmit}>
                    <Text style={{ color: "#FFF", fontSize: 18, fontWeight: "bold" }}>Finalizar Viagem</Text>
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