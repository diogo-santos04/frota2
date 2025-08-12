import React, { useState, useContext, useRef, useEffect } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, StatusBar, Animated, Dimensions, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { AuthContext } from "../../contexts/AuthContext";
import { Feather, MaterialIcons, FontAwesome5, MaterialCommunityIcons, FontAwesome6 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const { width, height } = Dimensions.get("window");

export default function SignIn() {
    const { signIn, loadingAuth } = useContext(AuthContext);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [emailFocused, setEmailFocused] = useState(false);
    const [passwordFocused, setPasswordFocused] = useState(false);

    // Animation refs
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;
    const scaleAnim = useRef(new Animated.Value(0.8)).current;
    const logoRotate = useRef(new Animated.Value(0)).current;
    const floatingAnim1 = useRef(new Animated.Value(0)).current;
    const floatingAnim2 = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Start entry animations
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                tension: 50,
                friction: 7,
                useNativeDriver: true,
            }),
        ]).start();

        // Logo rotation animation
        Animated.loop(
            Animated.timing(logoRotate, {
                toValue: 1,
                duration: 10000,
                useNativeDriver: true,
            })
        ).start();

        // Floating animations for background elements
        Animated.loop(
            Animated.sequence([
                Animated.timing(floatingAnim1, {
                    toValue: 1,
                    duration: 3000,
                    useNativeDriver: true,
                }),
                Animated.timing(floatingAnim1, {
                    toValue: 0,
                    duration: 3000,
                    useNativeDriver: true,
                }),
            ])
        ).start();

        Animated.loop(
            Animated.sequence([
                Animated.timing(floatingAnim2, {
                    toValue: 1,
                    duration: 4000,
                    useNativeDriver: true,
                }),
                Animated.timing(floatingAnim2, {
                    toValue: 0,
                    duration: 4000,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, []);

    async function handleLogin() {
        if (email === "" || password === "") return;

        // Button press animation
        Animated.sequence([
            Animated.timing(scaleAnim, {
                toValue: 0.95,
                duration: 100,
                useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
                toValue: 1,
                duration: 100,
                useNativeDriver: true,
            }),
        ]).start();

        await signIn({ email, password });
    }

    const logoRotateInterpolate = logoRotate.interpolate({
        inputRange: [0, 1],
        outputRange: ["0deg", "360deg"],
    });

    const FloatingElement = ({ animValue, style }) => (
        <Animated.View
            style={[
                styles.floatingElement,
                style,
                {
                    transform: [
                        {
                            translateY: animValue.interpolate({
                                inputRange: [0, 1],
                                outputRange: [0, -20],
                            }),
                        },
                    ],
                    opacity: animValue.interpolate({
                        inputRange: [0, 0.5, 1],
                        outputRange: [0.3, 0.8, 0.3],
                    }),
                },
            ]}
        />
    );

    return (
        <>
            <StatusBar backgroundColor="#0B7EC8" barStyle="light-content" />
            <LinearGradient colors={["#0B7EC8", "#1976D2", "#0D47A1", "#1A237E"]} style={styles.container} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                {/* Floating background elements */}
                <FloatingElement animValue={floatingAnim1} style={[styles.floatingElement, { top: "15%", left: "10%" }]} />
                <FloatingElement animValue={floatingAnim2} style={[styles.floatingElement, { top: "70%", right: "15%", width: 80, height: 80 }]} />
                <FloatingElement animValue={floatingAnim1} style={[styles.floatingElement, { top: "40%", right: "5%", width: 40, height: 40 }]} />

                <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.keyboardView}>
                    <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
                        <Animated.View
                            style={[
                                styles.inputContainer,
                                {
                                    opacity: fadeAnim,
                                    transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
                                },
                            ]}
                        >
                            <LinearGradient colors={["rgba(255, 255, 255, 0.95)", "rgba(255, 255, 255, 0.9)"]} style={styles.cardGradient}>
                                <View style={styles.headerContainer}>
                                    <Animated.View
                                        style={[
                                            styles.logoContainer,
                                            {
                                                transform: [{ rotate: logoRotateInterpolate }],
                                            },
                                        ]}
                                    >
                                        <LinearGradient colors={["#0B7EC8", "#1976D2"]} style={styles.logoGradient}>
                                            <FontAwesome6 name="car" size={24} color="#FFFFFF" />
                                        </LinearGradient>
                                    </Animated.View>

                                    <Text style={styles.title}>FROTA</Text>
                                    <Text style={styles.subtitle}>Sistema de Gerenciamento de Frota</Text>
                                    <View style={styles.titleUnderline} />
                                </View>

                                <View style={styles.formContainer}>
                                    <View style={styles.fieldContainer}>
                                        <Text style={styles.label}>
                                            <MaterialIcons name="email" size={16} color="#666" /> Email
                                        </Text>
                                        <View style={[styles.inputWrapper, emailFocused && styles.inputWrapperFocused]}>
                                            <LinearGradient colors={emailFocused ? ["#E3F2FD", "#BBDEFB"] : ["#F8F9FA", "#F1F3F4"]} style={styles.inputGradient}>
                                                <MaterialIcons name="email" size={20} color={emailFocused ? "#0B7EC8" : "#999"} style={styles.inputIcon} />
                                                <TextInput
                                                    placeholder="Seu email registrado"
                                                    autoCapitalize="none"
                                                    style={[styles.input, emailFocused && styles.inputFocused]}
                                                    placeholderTextColor="#999"
                                                    value={email}
                                                    onChangeText={setEmail}
                                                    onFocus={() => setEmailFocused(true)}
                                                    onBlur={() => setEmailFocused(false)}
                                                    keyboardType="email-address"
                                                />
                                            </LinearGradient>
                                        </View>
                                    </View>

                                    <View style={styles.fieldContainer}>
                                        <Text style={styles.label}>
                                            <MaterialIcons name="lock" size={16} color="#666" /> Senha
                                        </Text>
                                        <View style={[styles.inputWrapper, passwordFocused && styles.inputWrapperFocused]}>
                                            <LinearGradient colors={passwordFocused ? ["#E3F2FD", "#BBDEFB"] : ["#F8F9FA", "#F1F3F4"]} style={styles.inputGradient}>
                                                <MaterialIcons name="lock" size={20} color={passwordFocused ? "#0B7EC8" : "#999"} style={styles.inputIcon} />
                                                <TextInput
                                                    placeholder="Sua senha"
                                                    style={[styles.input, passwordFocused && styles.inputFocused]}
                                                    secureTextEntry={!showPassword}
                                                    placeholderTextColor="#999"
                                                    value={password}
                                                    onChangeText={setPassword}
                                                    onFocus={() => setPasswordFocused(true)}
                                                    onBlur={() => setPasswordFocused(false)}
                                                />
                                                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                                                    <MaterialIcons name={showPassword ? "visibility" : "visibility-off"} size={20} color={passwordFocused ? "#0B7EC8" : "#999"} />
                                                </TouchableOpacity>
                                            </LinearGradient>
                                        </View>
                                    </View>

                                    <TouchableOpacity style={styles.forgotPasswordContainer} onPress={() => {}}>
                                        <Text style={styles.forgotPasswordText}>
                                            <MaterialIcons name="help-outline" size={14} color="#0B7EC8" /> Esqueceu a senha?
                                        </Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loadingAuth}>
                                        <LinearGradient
                                            colors={loadingAuth ? ["#B0BEC5", "#90A4AE"] : ["#0B7EC8", "#1976D2", "#0D47A1"]}
                                            style={styles.buttonGradient}
                                            start={{ x: 0, y: 0 }}
                                            end={{ x: 1, y: 0 }}
                                        >
                                            {loadingAuth ? (
                                                <ActivityIndicator size={25} color="#FFF" />
                                            ) : (
                                                <View style={styles.buttonContent}>
                                                    <MaterialIcons name="login" size={20} color="#FFF" />
                                                    <Text style={styles.buttonText}>Entrar</Text>
                                                </View>
                                            )}
                                        </LinearGradient>
                                    </TouchableOpacity>
                                </View>
                            </LinearGradient>
                        </Animated.View>

                        <Animated.View
                            style={[
                                styles.footerContainer,
                                {
                                    opacity: fadeAnim,
                                    transform: [{ translateY: slideAnim }],
                                },
                            ]}
                        >
                            <View style={styles.footerContent}>
                                <MaterialIcons name="security" size={16} color="rgba(255, 255, 255, 0.8)" />
                                <Text style={styles.footerText}>© 2025 FROTA - Sistema Seguro de Gerenciamento</Text>
                            </View>
                        </Animated.View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </LinearGradient>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    keyboardView: {
        flex: 1,
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingVertical: 40,
        minHeight: height,
    },
    floatingElement: {
        position: "absolute",
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: "rgba(255, 255, 255, 0.1)",
    },
    inputContainer: {
        width: "100%",
        maxWidth: 400,
        borderRadius: 25,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 15 },
        shadowOpacity: 0.25,
        shadowRadius: 25,
        elevation: 15,
    },
    cardGradient: {
        borderRadius: 25,
        paddingVertical: 40,
        paddingHorizontal: 30,
    },
    headerContainer: {
        alignItems: "center",
        marginBottom: 40,
    },
    logoContainer: {
        marginBottom: 20,
        shadowColor: "#0B7EC8",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    logoGradient: {
        width: 70,
        height: 70,
        borderRadius: 35,
        justifyContent: "center",
        alignItems: "center",
    },
    title: {
        fontSize: 32,
        fontWeight: "800",
        color: "#1A1A1A",
        marginBottom: 8,
        letterSpacing: 2,
    },
    subtitle: {
        fontSize: 14,
        color: "#666",
        textAlign: "center",
        marginBottom: 10,
    },
    titleUnderline: {
        width: 60,
        height: 3,
        backgroundColor: "#0B7EC8",
        borderRadius: 2,
    },
    formContainer: {
        width: "100%",
        gap: 20,
    },
    fieldContainer: {
        width: "100%",
    },
    label: {
        fontSize: 14,
        fontWeight: "600",
        color: "#333",
        marginBottom: 10,
        flexDirection: "row",
        alignItems: "center",
    },
    inputWrapper: {
        borderRadius: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 4,
    },
    inputWrapperFocused: {
        shadowColor: "#0B7EC8",
        shadowOpacity: 0.3,
        elevation: 8,
    },
    inputGradient: {
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 15,
        paddingHorizontal: 15,
        minHeight: 55,
    },
    inputIcon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: "#000",
        paddingVertical: 0,
    },
    inputFocused: {
        color: "#0B7EC8",
    },
    eyeIcon: {
        padding: 5,
        marginLeft: 10,
    },
    forgotPasswordContainer: {
        alignSelf: "flex-end",
        marginTop: 5,
    },
    forgotPasswordText: {
        fontSize: 14,
        color: "#0B7EC8",
        fontWeight: "600",
        flexDirection: "row",
        alignItems: "center",
    },
    button: {
        width: "100%",
        borderRadius: 15,
        shadowColor: "#0B7EC8",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.4,
        shadowRadius: 10,
        elevation: 8,
        marginTop: 10,
    },
    buttonGradient: {
        height: 55,
        borderRadius: 15,
        justifyContent: "center",
        alignItems: "center",
    },
    buttonContent: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: "700",
        color: "white",
        textTransform: "uppercase",
        letterSpacing: 1,
    },
    footerContainer: {
        marginTop: 30,
        paddingHorizontal: 20,
    },
    footerContent: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
    },
    footerText: {
        fontSize: 12,
        color: "rgba(255, 255, 255, 0.8)",
        textAlign: "center",
        fontWeight: "500",
    },
});
