import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { Picker } from "@react-native-picker/picker";
import Toast from "react-native-toast-message";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Feather } from "@expo/vector-icons";
import { format } from "date-fns";

interface Veiculo {
    id: number;
    nome: string;
    marca: string;
    placa: string;
}

interface Motorista {
    id: string;
    profissional_id: string;
    cnh: string | null;
    validade: Date;
    categoria: string[];
}

interface Profissional {
    id: string;
    user_id: string;
    nome: string;
    cpf: string;
    matricula: string;
    celular: string;
    codigo: string;
}

interface FormData {
    data_vistoria: string;
    km_vistoria: string;
    km_troca_oleo: string;
    data_troca_oleo: string;
    documento: boolean;
    cartao_abastecimento: boolean;
    combustivel: string;
    pneu_dianteiro: string;
    pneu_traseiro: string;
    pneu_estepe: string;
    nota: string;
    status: string;
}

interface VistoriaFormProps {
    veiculo: Veiculo | null;
    motorista: Motorista | null;
    profissional: Profissional;
    onSubmit: (formData: FormData) => void;
    submitting: boolean;
}

export default function VistoriaForm({ veiculo, motorista, profissional, onSubmit, submitting }: VistoriaFormProps) {
    const [showForm2, setShowForm2] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState<"data_vistoria" | "data_troca_oleo" | null>(null);

    const [formData, setFormData] = useState<FormData>({
        data_vistoria: "",
        km_vistoria: "",
        km_troca_oleo: "",
        data_troca_oleo: "",
        documento: false,
        cartao_abastecimento: false,
        combustivel: "",
        pneu_dianteiro: "",
        pneu_traseiro: "",
        pneu_estepe: "",
        nota: "",
        status: "Pendente",
    });

    const updateFormData = (field: keyof FormData, value: any) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleDateChange = (event: any, selectedDate: Date | undefined) => {
        setShowDatePicker(null);
        if (selectedDate) {
            updateFormData(showDatePicker!, format(selectedDate, "dd/MM/yyyy"));
        }
    };

    const handleSubmit = () => {
        if (!formData.data_vistoria || !formData.km_vistoria || !formData.km_troca_oleo || !formData.data_troca_oleo) {
            Toast.show({
                type: "error",
                text1: "Preencha os campos obrigatórios da primeira etapa.",
            });
            return;
        }

        if (showForm2 && (!formData.combustivel || !formData.pneu_dianteiro || !formData.pneu_traseiro || !formData.pneu_estepe)) {
            Toast.show({
                type: "error",
                text1: "Preencha os campos obrigatórios da segunda etapa.",
            });
            return;
        }

        onSubmit(formData);
    };

    return (
        <KeyboardAvoidingView style={{flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {(motorista || veiculo) && (
                    <View style={styles.infoContainer}>
                        {motorista && (
                            <Text style={styles.infoText}>
                                <Text style={styles.infoLabel}>Motorista: </Text>
                                {profissional.nome}
                            </Text>
                        )}
                        {veiculo && (
                            <Text style={styles.infoText}>
                                <Text style={styles.infoLabel}>Veículo: </Text>
                                {veiculo.nome} - Placa: {veiculo.placa}
                            </Text>
                        )}
                    </View>
                )}

                {veiculo && (
                    <>
                        {!showForm2 ? (
                            <>
                                <View style={styles.rowContainer}>
                                    <View style={[styles.fieldContainer, styles.halfWidth]}>
                                        <Text style={styles.label}>Data Vistoria *</Text>
                                        <TouchableOpacity style={styles.input} onPress={() => setShowDatePicker("data_vistoria")}>
                                            <Text style={styles.inputText}>{formData.data_vistoria || "Selecione a Data"}</Text>
                                        </TouchableOpacity>
                                    </View>

                                    <View style={[styles.fieldContainer, styles.halfWidth]}>
                                        <Text style={styles.label}>Km Vistoria *</Text>
                                        <TextInput
                                            placeholder="Km Vistoria"
                                            style={styles.input}
                                            placeholderTextColor="grey"
                                            value={formData.km_vistoria}
                                            onChangeText={(text) => updateFormData("km_vistoria", text)}
                                            keyboardType="numeric"
                                        />
                                    </View>
                                </View>

                                <View style={styles.rowContainer}>
                                    <View style={[styles.fieldContainer, styles.halfWidth]}>
                                        <Text style={styles.label}>Data Troca do Óleo *</Text>
                                        <TouchableOpacity style={styles.input} onPress={() => setShowDatePicker("data_troca_oleo")}>
                                            <Text style={styles.inputText}>{formData.data_troca_oleo || "Selecione a Data"}</Text>
                                        </TouchableOpacity>
                                    </View>

                                    <View style={[styles.fieldContainer, styles.halfWidth]}>
                                        <Text style={styles.label}>Km Troca do Óleo *</Text>
                                        <TextInput
                                            placeholder="Km Troca do Óleo"
                                            style={styles.input}
                                            placeholderTextColor="grey"
                                            value={formData.km_troca_oleo}
                                            onChangeText={(text) => updateFormData("km_troca_oleo", text)}
                                            keyboardType="numeric"
                                        />
                                    </View>
                                </View>

                                <View style={styles.fieldContainer}>
                                    <Text style={styles.label}>Nível de Combustível *</Text>
                                    <View style={styles.pickerContainer}>
                                        <Picker
                                            selectedValue={formData.combustivel}
                                            onValueChange={(itemValue) => updateFormData("combustivel", itemValue)}
                                            style={styles.picker}
                                            itemStyle={styles.pickerItem}
                                        >
                                            <Picker.Item label="Selecione o Nível" value="" />
                                            <Picker.Item label="1/4" value="1/4" />
                                            <Picker.Item label="2/4" value="1/2" />
                                            <Picker.Item label="3/4" value="3/4" />
                                            <Picker.Item label="Cheio" value="Cheio" />
                                        </Picker>
                                    </View>
                                </View>

                                <View style={styles.rowContainer}>
                                    <View style={[styles.fieldContainer, styles.checkboxContainer]}>
                                        <Text style={styles.label}>Documento *</Text>
                                        <TouchableOpacity style={styles.checkbox} onPress={() => updateFormData("documento", !formData.documento)}>
                                            <Feather name={formData.documento ? "check-square" : "square"} size={24} color={formData.documento ? "#28a745" : "#333"} />
                                            <Text style={styles.checkboxLabel}>Em dia</Text>
                                        </TouchableOpacity>
                                    </View>

                                    <View style={[styles.fieldContainer, styles.checkboxContainer]}>
                                        <Text style={styles.label}>Cartão Abastecimento *</Text>
                                        <TouchableOpacity style={styles.checkbox} onPress={() => updateFormData("cartao_abastecimento", !formData.cartao_abastecimento)}>
                                            <Feather name={formData.cartao_abastecimento ? "check-square" : "square"} size={24} color={formData.cartao_abastecimento ? "#28a745" : "#333"} />
                                            <Text style={styles.checkboxLabel}>Possuo</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>

                                <TouchableOpacity style={[styles.button, styles.submitButton, submitting && styles.buttonDisabled]} onPress={() => setShowForm2(true)} disabled={submitting}>
                                    <Text style={styles.buttonText}>Continuar Vistoria</Text>
                                </TouchableOpacity>
                            </>
                        ) : (
                            <>
                                <View style={styles.fieldContainer}>
                                    <Text style={styles.label}>Pneu Dianteiro *</Text>
                                    <View style={styles.pickerContainer}>
                                        <Picker
                                            selectedValue={formData.pneu_dianteiro}
                                            onValueChange={(itemValue) => updateFormData("pneu_dianteiro", itemValue)}
                                            style={styles.picker}
                                            itemStyle={styles.pickerItem}
                                        >
                                            <Picker.Item label="Selecione a Condição" value="" />
                                            <Picker.Item label="Ruim" value="Ruim" />
                                            <Picker.Item label="Regular" value="Regular" />
                                            <Picker.Item label="Bom" value="Bom" />
                                            <Picker.Item label="Ótimo" value="Otimo" />
                                        </Picker>
                                    </View>
                                </View>

                                <View style={styles.fieldContainer}>
                                    <Text style={styles.label}>Pneu Traseiro *</Text>
                                    <View style={styles.pickerContainer}>
                                        <Picker
                                            selectedValue={formData.pneu_traseiro}
                                            onValueChange={(itemValue) => updateFormData("pneu_traseiro", itemValue)}
                                            style={styles.picker}
                                            itemStyle={styles.pickerItem}
                                        >
                                            <Picker.Item label="Selecione a Condição" value="" />
                                            <Picker.Item label="Ruim" value="Ruim" />
                                            <Picker.Item label="Regular" value="Regular" />
                                            <Picker.Item label="Bom" value="Bom" />
                                            <Picker.Item label="Ótimo" value="Otimo" />
                                        </Picker>
                                    </View>
                                </View>

                                <View style={styles.fieldContainer}>
                                    <Text style={styles.label}>Pneu Estepe *</Text>
                                    <View style={styles.pickerContainer}>
                                        <Picker
                                            selectedValue={formData.pneu_estepe}
                                            onValueChange={(itemValue) => updateFormData("pneu_estepe", itemValue)}
                                            style={styles.picker}
                                            itemStyle={styles.pickerItem}
                                        >
                                            <Picker.Item label="Selecione a Condição" value="" />
                                            <Picker.Item label="Ruim" value="Ruim" />
                                            <Picker.Item label="Regular" value="Regular" />
                                            <Picker.Item label="Bom" value="Bom" />
                                            <Picker.Item label="Ótimo" value="Otimo" />
                                        </Picker>
                                    </View>
                                </View>

                                <View style={styles.fieldContainer}>
                                    <Text style={styles.label}>Observações</Text>
                                    <TextInput
                                        placeholder="Alguma nota adicional?"
                                        style={[styles.input, styles.textArea]}
                                        placeholderTextColor="grey"
                                        value={formData.nota}
                                        onChangeText={(text) => updateFormData("nota", text)}
                                        multiline
                                    />
                                </View>

                                <TouchableOpacity style={[styles.button, styles.submitButton, submitting && styles.buttonDisabled]} onPress={handleSubmit} disabled={submitting}>
                                    {submitting ? <ActivityIndicator size={25} color="#FFF" /> : <Text style={styles.buttonText}>Registrar Vistoria</Text>}
                                </TouchableOpacity>

                                <TouchableOpacity style={[styles.button, styles.backButton, submitting && styles.buttonDisabled]} onPress={() => setShowForm2(false)} disabled={submitting}>
                                    <Text style={styles.buttonText}>Voltar</Text>
                                </TouchableOpacity>
                            </>
                        )}
                    </>
                )}

                {showDatePicker && <DateTimePicker value={new Date()} mode="date" display="default" onChange={handleDateChange} />}
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    rowContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 0,
    },
    halfWidth: {
        width: "48%",
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
        justifyContent: "center",
    },
    inputText: {
        color: "#000",
        fontSize: 16,
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
    },
    backButton: {
        backgroundColor: "#dc3545",
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
    infoContainer: {
        backgroundColor: "#E8F5E8",
        padding: 15,
        borderRadius: 8,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: "#28a745",
    },
    infoText: {
        fontSize: 14,
        color: "#333",
        marginBottom: 5,
    },
    infoLabel: {
        fontWeight: "bold",
        color: "#28a745",
    },
    pickerContainer: {
        borderWidth: 2,
        borderColor: "#3A3F5A",
        borderRadius: 8,
        backgroundColor: "white",
        overflow: "hidden",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
    },
    picker: {
        width: "100%",
        height: 50,
        color: "#000",
    },
    pickerItem: {
        fontSize: 16,
    },
    checkboxContainer: {
        flexDirection: "column",
        alignItems: "flex-start",
        width: "48%",
    },
    checkbox: {
        flexDirection: "row",
        alignItems: "center",
        height: 50,
        paddingHorizontal: 10,
        backgroundColor: "white",
        borderRadius: 8,
        borderWidth: 2,
        borderColor: "#3A3F5A",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
        width: "100%",
    },
    checkboxLabel: {
        marginLeft: 8,
        fontSize: 16,
        color: "#333",
    },
});
