import React, { useState, useEffect } from "react";
import { View, Text, SafeAreaView, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Dimensions } from "react-native";
import { api } from "../../services/api";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackParamsList } from "../../routes/app.routes";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import { Feather } from "@expo/vector-icons";
import Checkbox from "expo-checkbox";
import { template } from "@babel/core";

interface Item {
    id: number;
    nome: string;
    descricao: string;
    ordem: number;
}

interface VistoriaItemType {
    vistoria_id: number;
    item_id: number;
    nota: string;
}

type RouteDetailParams = {
    VistoriaItem: {
        vistoria_id: number;
    };
};

type VistoriaItemRouteProps = RouteProp<RouteDetailParams, "VistoriaItem">;

const { width } = Dimensions.get("window");
const ITEM_MARGIN = 5;
const CHECKBOX_WIDTH = 170;

export default function VistoriaItem() {
    const navigation = useNavigation<NativeStackNavigationProp<StackParamsList>>();
    const route = useRoute<VistoriaItemRouteProps>();
    const vistoria_id = route.params?.vistoria_id;

    const [items, setItems] = useState<Item[]>([]);
    const [selectedItems, setSelectedItems] = useState<{ [key: number]: boolean }>({});
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        async function getItens() {
            setLoading(true);
            try {
                const response = await api.get("item");
                setItems(response.data);
            } catch (error) {
                console.error("Error fetching items:", error);
                Toast.show({
                    type: "error",
                    text1: "Erro ao carregar itens",
                    text2: "Verifique sua conexão e tente novamente.",
                });
            } finally {
                setLoading(false);
            }
        }

        getItens();
    }, []);

    const handleCheckboxChange = (itemId: number, isChecked: boolean) => {
        setSelectedItems((prev) => ({
            ...prev,
            [itemId]: isChecked,
        }));
    };

    async function handleSubmit() {
        if (!vistoria_id) {
            Toast.show({
                type: "error",
                text1: "ID da vistoria não fornecido",
                text2: "Não foi possível registrar os itens.",
            });
            return;
        }

        setSubmitting(true);
        try {
            const itemsToSave: VistoriaItemType[] = Object.keys(selectedItems)
                .filter((itemId) => selectedItems[parseInt(itemId)])
                .map((itemId) => ({
                    vistoria_id: vistoria_id,
                    item_id: parseInt(itemId),
                    nota: "",
                }));

            if (itemsToSave.length === 0) {
                Toast.show({
                    type: "info",
                    text1: "Nenhum item selecionado",
                    text2: "Selecione ao menos um item para registrar.",
                });
                setSubmitting(false);
                return;
            }

            for (const itemData of itemsToSave) {
                await api.post("/vistoria_item", itemData);
            }
            // const postPromises = itemsToSave.map((itemData) => api.post("/vistoria_item", itemData));
            // await Promise.all(postPromises);

            Toast.show({
                type: "success",
                text1: "Itens da vistoria registrados com sucesso!",
            });
            navigation.navigate("Menu");
        } catch (error) {
            console.error("Error submitting vistoria items:", error);
            Toast.show({
                type: "error",
                text1: "Erro ao registrar itens da vistoria",
                text2: "Tente novamente mais tarde.",
            });
        } finally {
            setSubmitting(false);
        }
    }

    const chunkArray = (arr: Item[], chunkSize: number) => {
        const result = [];
        for (let i = 0; i < arr.length; i += chunkSize) {
            result.push(arr.slice(i, i + chunkSize));
        }
        return result;
    };

    const itemsPerRow = Math.floor(width / (CHECKBOX_WIDTH + ITEM_MARGIN * 2));

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
                <Text style={styles.formTitle}>Assinale os itens que precisam de manutenção</Text>

                {loading ? (
                    <ActivityIndicator size="large" color="#0B7EC8" />
                ) : items.length > 0 ? (
                    chunkArray(items, itemsPerRow).map((rowItems, rowIndex) => (
                        <View key={rowIndex} style={styles.rowContainer}>
                            {rowItems.map((item) => (
                                <View key={item.id} style={styles.itemWrapper}>
                                    <View style={styles.itemContainer}>
                                        <Checkbox
                                            style={styles.checkbox}
                                            value={selectedItems[item.id] || false}
                                            onValueChange={(isChecked) => handleCheckboxChange(item.id, isChecked)}
                                            color={selectedItems[item.id] ? "#0B7EC8" : undefined}
                                        />
                                        <Text style={styles.itemTitle}>{item.nome}</Text>
                                    </View>
                                </View>
                            ))}
                        </View>
                    ))
                ) : (
                    <Text style={styles.noItemsText}>Nenhum item encontrado.</Text>
                )}

                <TouchableOpacity style={[styles.button, styles.submitButton, submitting && styles.buttonDisabled]} onPress={handleSubmit} disabled={submitting}>
                    {submitting ? <ActivityIndicator size={25} color="#FFF" /> : <Text style={styles.buttonText}>Salvar Itens da Vistoria</Text>}
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
    rowContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-around",
        marginBottom: 10,
    },
    itemWrapper: {
        width: CHECKBOX_WIDTH,
        margin: ITEM_MARGIN / 2,
    },
    itemContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "white",
        borderRadius: 8,
        padding: 10,
        borderWidth: 1,
        borderColor: "#ddd",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
        height: 65,
    },
    checkbox: {
        width: 20,
        height: 20,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: "#0B7EC8",
        marginRight: 10,
    },
    itemTextContent: {
        flex: 1,
    },
    itemTitle: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#333",
    },
    itemDescription: {
        fontSize: 12,
        color: "#666",
    },
    noItemsText: {
        textAlign: "center",
        marginTop: 20,
        fontSize: 16,
        color: "#666",
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
        marginBottom: 70,
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
