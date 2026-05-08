import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Contacts from "expo-contacts";
// import * as SMS from "expo-sms";
import { useEffect, useState } from "react";
import { Alert, FlatList, Modal, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import styles from "../assets/styles/contact.styles";
import { BASE_URL } from "../lib/utils/api.js";
import InviteModal from "./InviteModal.jsx";

export default function ContactSelectComponent({
  visible,
  onClose,
  onSelectContacts,
  onSelectContactsName,
}) {
  const insets = useSafeAreaInsets(); // 👈 important
  const [contacts, setContacts] = useState([]);
  const [finalList, setFinalList] = useState([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState([]);
  const [inviteModalVisible, setInviteModalVisible] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);


  useEffect(() => {
    if (visible) {
      loadFromCache();
    }
  }, [visible]);

  // ---------------- LOAD CACHE ----------------
  const loadFromCache = async () => {
    try {
      const cached = await AsyncStorage.getItem("finalContacts");

      if (!cached || cached === "undefined" || cached.trim() === "") {
        await AsyncStorage.removeItem("finalContacts");
        return fullSync();
      }

      const data = JSON.parse(cached);

      // optional safety
      if (!Array.isArray(data)) {
        throw new Error("Invalid cache format");
      }

      setFinalList(data);
      setContacts(data);
    } catch (error) {
      console.log("Cache parse error >>>", error);

      // corrupted data remove karo
      await AsyncStorage.removeItem("finalContacts");

      fullSync(); // fresh data load
    }
  };

  // ---------------- FULL SYNC ----------------
  const fullSync = async () => {
    try {
      const contactData = await loadContacts();

      const numbers = contactData.map(c => formatNumber(c.phone));

      const path = `/api/auth/checkRegistered`;
      console.log("At full sync >>> path : ", BASE_URL, path);

      const res = await fetch(`${BASE_URL}${path}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ phoneNumbers: numbers })
      });


      if (!res.ok) {
        console.log("Server error >>>", res.status);
        return;
      }

      let registered = [];

      const text = await res.text();

      console.log("Raw response >>>", text);

      if (text) {
        try {
          registered = JSON.parse(text);
        } catch (e) {
          console.log("JSON parse failed >>>", e);
          registered = [];
        }
      }
      console.log("At full sync >>> registered numbers : ", registered);

      const merged = contactData.map(c => ({
        ...c,
        phone: formatNumber(c.phone),
        isUser: registered.includes(formatNumber(c.phone))
      }));

      setFinalList(merged);
      setContacts(merged);

      await AsyncStorage.setItem("finalContacts", JSON.stringify(merged));
    } catch (error) {
      console.log("Error in full sync >>> ", error);
    };
  }

  // ---------------- LOAD CONTACTS ----------------
  const loadContacts = async () => {
    const { status } = await Contacts.requestPermissionsAsync();

    if (status !== "granted") return [];

    const { data } = await Contacts.getContactsAsync({
      fields: [Contacts.Fields.PhoneNumbers]
    });

    return data
      .filter(c => c.phoneNumbers?.length)
      .map(c => ({
        id: c.id,
        name: c.name,
        phone: c.phoneNumbers[0].number
      }));
  };

  // ---------------- FORMAT ----------------
  const formatNumber = (num) => {
    return num?.replace(/\D/g, "").slice(-10) || "";
  };

  // ---------------- TOGGLE ----------------
  const toggleSelect = (item) => {
    if (selected.includes(item.id)) {
      setSelected(selected.filter(id => id !== item.id));
    } else {
      setSelected([...selected, item.id]);
    }
  };

  // ---------------- SEARCH ----------------
  const filteredContacts = finalList.filter(item =>
    item.name?.toLowerCase().includes(search.toLowerCase()) ||
    item.phone?.includes(search)
  );

  // ---------------- INVITE ----------------
  const inviteUser = async (phone) => {
    // const isAvailable = await SMS.isAvailableAsync();


    Alert.alert("Invite Sent")
    // if (isAvailable) {
    //   await SMS.sendSMSAsync(
    //     [phone],
    //     "Join my app: "
    //   );
    // }
  };

  // ---------------- OK ----------------
  const handleOk = () => {
    const selectedContacts = finalList.filter(c => selected.includes(c.id));

    const numbers = selectedContacts.map(c => c.phone).join(",");
    const names = selectedContacts.map(c => c.name).join(",");

    onSelectContacts(numbers);
    onSelectContactsName(names);

    setSelected([]);
    onClose();
  };

  // ---------------- UI ----------------
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#EAF5EC", }}>

      <Modal visible={visible} animationType="slide">
        <View style={styles.container}>

          {/* HEADER */}
          <View style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center"
          }}>
            <Text style={styles.title}>Select Contacts</Text>

            {/* 🔄 SYNC BUTTON */}
            <TouchableOpacity onPress={fullSync}>
              <Ionicons name="sync" size={24} color="blue" />
            </TouchableOpacity>
          </View>

          {/* SEARCH */}
          <TextInput
            placeholder="Search name or number..."
            value={search}
            onChangeText={setSearch}
            style={styles.search}
          />

          {/* LIST */}
          <FlatList
            data={filteredContacts}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => {
              const isSelected = selected.includes(item.id);

              return (
                <View style={styles.contactItem}>

                  <TouchableOpacity
                    style={{ flex: 1 }}
                    onPress={() => item.isUser && toggleSelect(item)}
                  >
                    <Text style={styles.name}>{item.name}</Text>
                    <Text style={styles.number}>{item.phone}</Text>
                  </TouchableOpacity>

                  {item.isUser ? (
                    // ✅ Toggle
                    <TouchableOpacity onPress={() => toggleSelect(item)}>
                      <View style={[
                        styles.checkbox,
                        isSelected && styles.checkboxSelected
                      ]}>
                        {isSelected && (
                          <Ionicons name="checkmark" size={18} color="#fff" />
                        )}
                      </View>
                    </TouchableOpacity>
                  ) : (
                    // 📩 Invite
                    <TouchableOpacity
                      onPress={() => {
                        setSelectedContact(item);
                        setInviteModalVisible(true);
                      }}
                      style={{
                        backgroundColor: "green",
                        paddingHorizontal: 12,
                        paddingVertical: 6,
                        borderRadius: 20
                      }}
                    >
                      <Text style={{ color: "#fff" }}>Invite</Text>
                    </TouchableOpacity>
                  )}

                </View>
              );
            }}
          />

          {/* FOOTER */}
          <View style={[
            styles.bottomButtons,
            {
              paddingBottom: insets.bottom, // 👈 main fix
            },
          ]}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.btnText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.okBtn} onPress={handleOk}>
              <Text style={styles.btnText}>OK</Text>
            </TouchableOpacity>
          </View>

        </View>
      </Modal>



      <InviteModal
        visible={inviteModalVisible}
        onClose={() => setInviteModalVisible(false)}
        contact={selectedContact}
        inviteUser={inviteUser}
      />
    </SafeAreaView>
  )
}