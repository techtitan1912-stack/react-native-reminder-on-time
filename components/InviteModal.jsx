import { Ionicons } from "@expo/vector-icons";
import {
    Modal,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";

export default function InviteModal({ visible, onClose, contact,inviteUser }) {
    return (
        <Modal transparent visible={visible} animationType="slide">
            <View style={styles.overlay}>
                <View style={styles.container}>

                    {/* drag line */}
                    <View style={styles.dragBar} />

                    {/* Title */}
                    <Text style={styles.title}>Send SMS invite?</Text>

                    <Text style={styles.subtitle}>
                        {contact?.name} isn't on this app. Do you want to invite them to join?
                    </Text>

                    {/* Profile */}
                    <View style={styles.profile}>
                        <Ionicons name="person-circle" size={50} color="#aaa" />
                        <Text style={styles.name}>{contact?.name}</Text>
                    </View>

                    {/* Message box */}
                    <Text style={styles.label}>Message</Text>
                    <TextInput
                        style={styles.input}
                        multiline
                        defaultValue={`Let's start! It's fast, simple, secure messaging and calling for free. This invite expires soon.`}
                    />

                    {/* Invite Button */}
                    <TouchableOpacity style={styles.inviteBtn}
                        onPress={() => inviteUser(contact?.phone)}
                    >
                        <Text style={styles.inviteText}>Invite via SMS</Text>
                    </TouchableOpacity>

                    {/* Cancel */}
                    <TouchableOpacity onPress={onClose}>
                        <Text style={styles.cancel}>Not now</Text>
                    </TouchableOpacity>

                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.6)",
        justifyContent: "flex-end"
    },
    container: {
        backgroundColor: "#121212",
        padding: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20
    },
    dragBar: {
        width: 50,
        height: 5,
        backgroundColor: "#555",
        alignSelf: "center",
        borderRadius: 10,
        marginBottom: 15
    },
    title: {
        color: "#fff",
        fontSize: 20,
        fontWeight: "bold",
        textAlign: "center"
    },
    subtitle: {
        color: "#aaa",
        textAlign: "center",
        marginVertical: 10
    },
    profile: {
        alignItems: "center",
        marginVertical: 10
    },
    name: {
        color: "#fff",
        marginTop: 5
    },
    label: {
        color: "#aaa",
        marginTop: 10
    },
    input: {
        borderWidth: 1,
        borderColor: "#333",
        borderRadius: 10,
        padding: 10,
        color: "#fff",
        marginTop: 5
    },
    inviteBtn: {
        backgroundColor: "#25D366",
        padding: 15,
        borderRadius: 30,
        alignItems: "center",
        marginTop: 20
    },
    inviteText: {
        color: "#fff",
        fontWeight: "bold"
    },
    cancel: {
        color: "#25D366",
        textAlign: "center",
        marginTop: 15
    }
});