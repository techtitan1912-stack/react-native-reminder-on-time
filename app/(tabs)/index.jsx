import { Ionicons } from "@expo/vector-icons";
import { Audio } from "expo-av";
import { Image } from "expo-image";
import { useRootNavigationState, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, KeyboardAvoidingView, Platform, Pressable, RefreshControl, Text, TouchableOpacity, View } from "react-native";
import { ActivityIndicator, Menu } from "react-native-paper";
import styles from "../../assets/styles/home.styles.js";
import { applyFilters } from "../../assets/utils/filterUtils.jsx";
import EmptyState from "../../components/EmptyState.jsx";
import FilterBar from "../../components/FilterBar";
import Loader from "../../components/Loader.jsx";
import CompletePopup from "../../components/TaskCompletePopup.jsx";
import DeletePopup from "../../components/TaskDeletePopup.jsx";
import COLORS from "../../constants/colors.js";
import { BASE_URL } from "../../lib/utils/api.js";
import { formatDate } from "../../lib/utils/utils.js";
import { useAuthStore } from "../../store/authStore.js";

export default function Home() {
    const { user, loginToken } = useAuthStore();
    const router = useRouter();
    const [profileImage, setProfileImage] = useState(user?.profileImage || "");
    const rootNavigationState = useRootNavigationState();
    // const [visible, setVisible] = useState(false);

    const [deleteVisible, setDeleteVisible] = useState(false);
    const [completeVisible, setCompleteVisible] = useState(false);
    const [selectedTaskId, setSelectedTaskId] = useState(null);

    const [deleteId, setDeleteId] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [activeMenuId, setActiveMenuId] = useState(null);
    const [isSelfTask, setIsSelfTask] = useState(true);



    useEffect(() => {
        if (user?.profileImage) {
            setProfileImage(user.profileImage);
        }
    }, [user]);

    // fetch tasks when user is available
    useEffect(() => {
        // const fetchTaskList = async () => {
        //     if (user && user.userName) {
        //         await getTaskList(user.userName, 1, 10);
        //     }
        // };
        fetchTaskList();
    }, []);


    useEffect(() => {
        Audio.setAudioModeAsync({
            allowsRecordingIOS: false,
            playsInSilentModeIOS: true, // 🔥 VERY IMPORTANT (iPhone)
            staysActiveInBackground: true,
            shouldDuckAndroid: true,
            playThroughEarpieceAndroid: false,
        });
    }, []);

    const showAddTaskPage = () => {
        // ✅ wait until navigation ready
        if (!rootNavigationState?.key) return;
        router.push("/addTaskPage");
    }

    const [refreshing, setRefreshing] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [tasks, setTask] = useState([]);
    const [filteredTasks, setFilteredTasks] = useState([]);
    const [selectedFilters, setSelectedFilters] = useState(["All"]);

    const [modalFilters, setModalFilters] =
        useState({
            mentioned: false,
            completed: false,
            today: false,
        });

    const [modalVisible, setModalVisible] =
        useState(false);


    //get task list of user
    const fetchTaskList = async (pageNumber = 1, refresh = false) => {
        console.log("Getting task list with data >> ", { pageNumber });

        try {
            if (refreshing) setRefreshing(true);
            else if (pageNumber === 1) setIsLoading(true);

            const url = `${BASE_URL}/api/tasks/getTasks?page=${pageNumber}&limit=100`;
            console.log("GET task list from url : ", url);
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${loginToken}`,
                }
            });
            const responseData = await response.json();
            console.log("At get task list Response Data >> ", responseData);
            if (!response.ok) throw new Error(responseData.message || "Something went wrong");

            const mergedTasks = refresh || pageNumber === 1
                ? responseData.tasks
                : [...tasks, ...responseData.tasks];

            const uniqueTasks = Array.from(
                new Map(mergedTasks.map(task => [task._id, task])).values()
            );
            setTask(uniqueTasks);
            setFilteredTasks(uniqueTasks);
            // const uniqueTasks =
            //     refresh || pageNumber === 1
            //         ? responseData.tasks
            //         : Array.from(new Set([...tasks, ...responseData.tasks].map((task) => task._id))).map((id) =>
            //             [...tasks, ...responseData.tasks].find((task) => task._id === id)
            //         );

            setHasMore(pageNumber < responseData.totalPages);
            setPage(pageNumber);
            setIsLoading(false);

            return { success: true, message: "Task list fetched successfully", data: responseData };
        } catch (error) {
            console.log("Error in getTaskList >> ", error);
            setIsLoading(false);
            return { success: false, message: error.message || "Failed to fetch task list" };
        } finally {
            if (refreshing) setRefreshing(false);
            else setIsLoading(false);
        }

    }

    const openDeletePopup = (id) => {
        setSelectedTaskId(id);
        setDeleteVisible(true);
    };
    const openCompletePopup = (id) => {
        setSelectedTaskId(id);
        setCompleteVisible(true);
    };

    // Delete Task
    const handleDelete = async () => {
        console.log("At handle delete task id:", selectedTaskId)
        // deleteTask(selectedTaskId); // your delete API
        try {
            const path = `/api/tasks/deleteTask/${selectedTaskId}`;
            console.log("Attempting delete task for path >>", path);

            const response = await fetch(`${BASE_URL}${path}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${loginToken}`,
                    "Content-Type": "application/json",
                }
            });


            const responseData = await response.json();
            console.log("At delete task Response Data >> ", responseData);

            if (!response.ok) throw new Error(responseData.message || "Something went wrong");

            if (response.ok) {
                console.log("Task delete susscessfuly >> ");
                fetchTaskList(1, true);
            }
        } catch (error) {
            console.log("Error in delete task >> ", error);
            console.log("Tried URLs:", error.tried || 'no tried list');
            setIsLoading(false);
            // router.push("/(tabs)");
        }
        setDeleteVisible(false);
    };

    const handleFilterChange = (newFilters) => {
        console.log("Filters received in Home:", newFilters);
        // Always ensure array
        const safeFilters = Array.isArray(newFilters)
            ? newFilters
            : ["All"];
        setSelectedFilters(safeFilters);
        const result = applyFilters(
            tasks,
            safeFilters,
            modalFilters
        );
        setFilteredTasks([...result]);
    };

    const handleComplete = async () => {
        console.log("Complete task with task id >>", selectedTaskId);
        try {
            const path = `/api/tasks/completeTask/${selectedTaskId}`;
            console.log("Attempting update task for path >>", path);

            const response = await fetch(`${BASE_URL}${path}`, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${loginToken}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    isCompleted: true,
                })
            });
            setCompleteVisible(false);
            const responseData = await response.json();
            console.log("At complete task Response Data >> ", responseData);

            if (!response.ok) throw new Error(responseData.message || "Something went wrong");

            if (response.ok) {
                console.log("Task complete susscessfuly >> ");
                fetchTaskList(1, true);
            }
        } catch (error) {
            console.log("Error in complete task >> ", error);
            console.log("Tried URLs:", error.tried || 'no tried list');
            setIsLoading(false);
            setCompleteVisible(false);
        }
    };

    if (isLoading) return <Loader size="large" />

    const handleCancel = () => {
        setDeleteVisible(false);
        setCompleteVisible(false);
    };

    const handleLoadMore = async () => {
        console.log("Calling handle load more page >>", page)
        if (hasMore && !refreshing && page > 1) {
            fetchTaskList(page + 1)
        }
    };

    //update task isViewed
    const updateTaskViewed = async (taskId, isViewed) => {
        try {
            if (isViewed) return;

            const path = `/api/tasks/updateTaskIsViewed/${taskId}`;
            console.log("Attempting updateTaskIsViewed for path >>", path);
            console.log(" At update task >>> Current Time : ", new Date());

            const response = await fetch(`${BASE_URL}${path}`, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${loginToken}`,
                    "Content-Type": "application/json",
                }
            });

            const responseData = await response.json();
            console.log("At updateTaskIsViewed Response Data >> ", responseData);

            if (!response.ok) throw new Error(responseData.message || "Something went wrong");

            // OR local state update
            // setTask(prev =>
            //     prev.map(t =>
            //         t._id === taskId ? { ...t, isViewed: true } : t
            //     )
            // );
        } catch (e) {
            console.log("Error updating viewed:", e);
        }
    };

    const renderItem = ({ item }) => {
        // bedge const
        const hasMention = item.mentionNumber && item.mentionNumber.length > 0;
        const isPending = !item.isCompleted;
        const userId = item?.user;
        const isNew = !item.isViewed;
        const isSelf = item.mobileNumber === user?.mobileNumber;
        
        return (
            <Pressable
                onPress={() => {
                    console.log("Sending Task:", item);
                    // ✅ wait until navigation ready
                    if (!rootNavigationState?.key) return;

                    updateTaskViewed(item._id, item.isViewed);
                    router.push({
                        pathname: "/taskDetail",
                        params: {
                            task: JSON.stringify(item),
                            taskId: item._id,
                        }
                    })
                }}
                style={({ pressed }) => [
                    styles.showTaskDetails,
                    pressed && styles.taskCardPressed
                ]}
            >
                <View style={styles.taskCard}>
                    {/* 1️⃣ LEFT - Profile */}
                    <View style={styles.left}>
                        <Image source={{ uri: item.profileImage ? item.profileImage : user?.profileImage || "https://via.placeholder.com/150" }} style={styles.taskProfileImage} />
                    </View>

                    {/* 2️⃣ MIDDLE - Title + Date */}
                    <View style={styles.middle}>

                        

                        <Text style={styles.userNameOnTaskCard}>
                            {
                                hasMention
                                    ? (isSelf ? "@Mention" : item.username)
                                    : (isSelf ? "Self" : item.username)
                            }
                        </Text>

                        <Text style={[
                            styles.taskTitle,
                            item.isCompleted && styles.completedTitle
                        ]}>{item.title}</Text>
                        {/* <Text style={styles.taskTitle}>Description :{item.description}</Text> */}
                        <Text style={styles.date}>{formatDate(item.reminderTime)}</Text>
                    </View>

                    {/* 3️⃣ RIGHT - Badge + Menu */}
                    <View style={styles.right}>
                        {/* Badge Container */}
                        <View style={styles.badgeContainer}>

                            {isNew && (
                                <View style={styles.newBadge}>
                                    <Text style={styles.newBadgeText}>NEW</Text>
                                </View>
                            )}

                            {isPending && (
                                <View style={[styles.badge, styles.pending]}>
                                    <Text style={styles.badgeText}>PENDING</Text>
                                </View>
                            )}
                            {!isPending && (
                                <View style={[styles.badge, styles.complete]}>
                                    <Text style={styles.badgeText}>COMPLETE</Text>
                                </View>
                            )}

                            {/* {hasMention && (
                                <View style={[styles.badge, styles.mention]}>
                                    <Text style={styles.badgeText}>MENTION</Text>
                                </View>
                            )} */}

                        </View>


                        <Menu
                            visible={activeMenuId === item._id}
                            onDismiss={() => setActiveMenuId(null)}
                            anchor={
                                <TouchableOpacity onPress={() => setActiveMenuId(item._id)}>
                                    <Ionicons name="ellipsis-vertical" size={20} />
                                </TouchableOpacity>
                            }
                        >
                            {isPending && (
                                <Menu.Item
                                    onPress={() => {
                                        setActiveMenuId(null);
                                        openCompletePopup(item._id);
                                    }}
                                    title="Complete"
                                />
                            )}
                            {userId === user?.id && (
                                <Menu.Item
                                    onPress={() => {
                                        setActiveMenuId(null);
                                        openDeletePopup(item._id);
                                    }}
                                    title="Delete"
                                />
                            )}
                        </Menu>
                    </View>
                </View >
            </Pressable>
        )
    };



    /* ================= UI ================= */
    return (
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
            <View style={styles.container}>
                {/* <ProfileHeader /> */}

                {/* <View style={styles.profileContainer}> */}
                <View style={styles.profileHeader}>
                    <Image source={{ uri: user?.profileImage || "https://via.placeholder.com/150" }} style={styles.profileImage} />

                    <View style={styles.profileInfo}>
                        <Text style={styles.username}>{user?.username || "User"}</Text>
                        {/* <Text style={styles.email}>{user.email}</Text> */}
                    </View>

                </View>
                {/* Filters */}
                {/* <View style={styles.filterContainer}>
                        </View> */}
                <FilterBar
                    selectedFilters={selectedFilters}
                    onFilterChange={handleFilterChange}
                />

                {/* <FilterModal
                    visible={modalVisible}
                    onClose={() => setModalVisible(false)}
                    filters={modalFilters}
                    setFilters={setModalFilters}
                /> */}

                {/* </View> */}
                {/* SHOW TASK LIST */}
                <FlatList
                    data={filteredTasks}
                    renderItem={renderItem}
                    keyExtractor={(item) => item._id}
                    contentContainerStyle={styles.listContainer}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={() => fetchTaskList(1, true)}
                            colors={[COLORS.primary]}
                            tintColor={COLORS.primary}
                        />
                    }
                    onEndReached={page > 1 && handleLoadMore}
                    onEndReachedThreshold={0.1}
                    ListFooterComponent={
                        hasMore && tasks.length > 0 ? (
                            <ActivityIndicator style={styles.footerLoader} size={"small"} color={COLORS.primary} />
                        ) : null
                    }
                    ListEmptyComponent={() => {
                        // No tasks exist
                        if (tasks.length === 0) {
                            return <EmptyState type="noTask" />;
                        }
                        // Tasks exist but filter empty
                        return <EmptyState type="noResult" />;
                    }}

                />

                {/* ADD BUTTON */}
                <TouchableOpacity
                    onPress={() => showAddTaskPage()}
                    activeOpacity={0.8}
                    style={{
                        position: "absolute",
                        bottom: 30,          // 👈 tab bar ke upar adjust karo
                        right: 20,

                        width: 60,
                        height: 60,
                        borderRadius: 30,

                        backgroundColor: COLORS.primary,
                        justifyContent: "center",
                        alignItems: "center",

                        elevation: 8,       // Android shadow
                        shadowColor: "#000", // iOS shadow
                        shadowOpacity: 0.3,
                        shadowOffset: { width: 0, height: 5 },
                        shadowRadius: 8,
                    }}>
                    <Ionicons name="add-circle" size={30} color="#fff" />
                </TouchableOpacity>
            </View >


            {/* Delete Model        */}
            <DeletePopup
                visible={deleteVisible}
                onCancel={handleCancel}
                onDelete={handleDelete}
            />
            <CompletePopup
                visible={completeVisible}
                onCancel={handleCancel}
                onComplete={handleComplete}
            />
        </KeyboardAvoidingView >
    );
}
