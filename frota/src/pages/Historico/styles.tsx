import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#FFFFF",
    },
    container: {
        flex: 1,
        backgroundColor: "#FFFF",
    },
    welcomeSection: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 10,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: "bold",
        color: "black",
        marginBottom: 4,
    },
    sectionSubtitle: {
        fontSize: 14,
        color: "#9e9eb3",
        marginBottom: 16,
    },
    mainContent: {
        flex: 1,
        padding: 15,
    },
    listContent: {
        paddingHorizontal: 20,
        paddingBottom: 20,
        flexGrow: 1,
    },
    viagemCard: {
        borderRadius: 12,
        marginBottom: 16,
        elevation: 5,
        overflow: "hidden",
        borderColor: "#0B7EC8",
        borderWidth: 1,
    },
    cardGradient: {
        borderRadius: 12,
        overflow: "hidden",
        backgroundColor: "#FFFFFF",
        borderColor: "black",
    },
    viagemHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#E3F2FD",
        backgroundColor: "#1976D2",
    },
    routeContainer: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
    },
    routeText: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#FFF",
        marginLeft: 8,
        flex: 1,
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 20,
        backgroundColor: "#E3F2FD",
    },
    statusText: {
        fontSize: 12,
        fontWeight: "bold",
        color: "#1976D2",
    },
    detailsContainer: {
        padding: 16,
        backgroundColor: "#FFFFFF",
        borderBottomWidth: 1,
        borderBottomColor: "#0B7EC8",
    },
    detailRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 8,
    },
    icon: {
        marginRight: 8,
        width: 16,
    },
    detailLabel: {
        fontSize: 14,
        color: "#666",
        width: 90,
    },
    detailValue: {
        fontSize: 14,
        color: "#1976D2",
        fontWeight: "500",
        flex: 1,
    },
    cardFooter: {
        flexDirection: "row",
        borderTopWidth: 1,
        borderTopColor: "#E3F2FD",
        padding: 12,
        justifyContent: "center",
        backgroundColor: "#F8F9FA",
    },
    cardAction: {
        flexDirection: "row",
        alignItems: "center",
        marginRight: 20,
    },
    cardActionText: {
        marginLeft: 6,
        fontSize: 13,
        color: "#6e6e93",
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 60,
    },
    loadingText: {
        color: "#9e9eb3",
        marginTop: 10,
        fontSize: 16,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 60,
    },
    emptyText: {
        color: "#9e9eb3",
        fontSize: 18,
        fontWeight: "bold",
        marginTop: 16,
    },
    emptySubText: {
        color: "#9e9eb3",
        fontSize: 14,
        marginTop: 8,
        textAlign: "center",
    },
});