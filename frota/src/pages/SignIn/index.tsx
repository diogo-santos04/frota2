import React, { useState, useContext } from "react";
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    StatusBar,
} from "react-native";
import { AuthContext } from "../../contexts/AuthContext";

export default function SignIn() {
    const { signIn, loadingAuth } = useContext(AuthContext);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    async function handleLogin() {
        if (email === "" || password === "") return;

        await signIn({ email, password });
    }

    return (
        <>
            <StatusBar backgroundColor="#2952CC" barStyle="light-content" />
            <View style={styles.container}>

                <View style={styles.inputContainer}>
                    <View style={styles.headerContainer}>
                        <Text style={styles.title}>FROTA</Text>
                        <Text style={styles.subtitle}>Sistema de Gerenciamento de Frota</Text>
                    </View>

                    <View style={styles.fieldContainer}>
                        <Text style={styles.label}>Email</Text>
                        <TextInput
                            placeholder="Seu email registrado"
                            autoCapitalize="none"
                            style={styles.input}
                            placeholderTextColor="grey"
                            value={email}
                            onChangeText={setEmail}
                        />
                    </View>

                    <View style={styles.fieldContainer}>
                        <Text style={styles.label}>Senha</Text>
                        <TextInput
                            placeholder="Sua senha"
                            style={styles.input}
                            secureTextEntry={true}
                            placeholderTextColor="grey"
                            value={password}
                            onChangeText={setPassword}
                        />
                    </View>

                    <TouchableOpacity 
                        style={styles.forgotPasswordContainer}
                        onPress={() => {}}
                    >
                        <Text style={styles.forgotPasswordText}>Esqueceu a senha?</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.button} onPress={handleLogin}>
                        {loadingAuth ? (
                            <ActivityIndicator size={25} color="#FFF" />
                        ) : (
                            <Text style={styles.buttonText}>Entrar</Text>
                        )}
                    </TouchableOpacity>                  
                </View>

                <View style={styles.footerContainer}>
                    <Text style={styles.footerText}>
                        © 2025 FROTA - Sistema de Gerenciamento de Frota Municipal
                    </Text>
                </View>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#0B7EC8",
        paddingHorizontal: 20,
        paddingVertical: 40,
    },
    inputContainer: {
        width: "95%",
        maxWidth: 400,
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 40,
        paddingHorizontal: 24,
        backgroundColor: "white",
        borderRadius: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 8,
    },
    headerContainer: {
        alignItems: "center",
        marginBottom: 32,
    },
    title: {
        fontSize: 28,
        fontWeight: "700",
        color: "#1a1a1a",
        marginBottom: 8,
        letterSpacing: 0.5,
    },
    subtitle: {
        fontSize: 14,
        color: "#666",
        textAlign: "center",
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
    forgotPasswordContainer: {
        alignSelf: "flex-end",
        marginBottom: 24,
    },
    forgotPasswordText: {
        fontSize: 14,
        color: "#2952CC",
        fontWeight: "500",
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
    },
    buttonText: {
        fontSize: 16,
        fontWeight: "600",
        color: "white",
        textTransform: "uppercase",
        letterSpacing: 0.5,
    },
    footerContainer: {
        position: "absolute",
        bottom: 30,
        paddingHorizontal: 20,
    },
    footerText: {
        fontSize: 12,
        color: "rgba(255, 255, 255, 0.8)",
        textAlign: "center",
    },
});