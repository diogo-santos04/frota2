import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");
const ITEM_MARGIN = 5;
const CHECKBOX_WIDTH = 170;

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFFF",
    },
    mainContent: {
        flex: 1,
        padding: 25,
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
        height: 55,
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