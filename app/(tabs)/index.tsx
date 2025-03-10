import { useState, useEffect } from "react";
import { Text, StyleSheet, View, TextInput, TouchableOpacity, FlatList } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function HomeScreen() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState<string[]>([]);
  const [editIndex, setEditIndex] = useState<number>(-1);

  // Load tasks from AsyncStorage when the component mounts
  useEffect(() => {
    loadTasks();
  }, []);

  // Function to save tasks to AsyncStorage
  const saveTasks = async (tasks: string[]) => {
    try {
      await AsyncStorage.setItem("tasks", JSON.stringify(tasks));
    } catch (error) {
      console.error("Failed to save tasks", error);
    }
  };

  // Function to load tasks from AsyncStorage
  const loadTasks = async () => {
    try {
      const storedTasks = await AsyncStorage.getItem("tasks");
      if (storedTasks) {
        setTasks(JSON.parse(storedTasks));
      }
    } catch (error) {
      console.error("Failed to load tasks", error);
    }
  };

  const handleAddTask = () => {
    if (task) {
      let updatedTasks;
      if (editIndex !== -1) {
        updatedTasks = [...tasks];
        updatedTasks[editIndex] = task;
        setEditIndex(-1);
      } else {
        updatedTasks = [...tasks, task];
      }
      setTasks(updatedTasks);
      saveTasks(updatedTasks); // Save to AsyncStorage
      setTask("");
    }
  };

  const handleEditTask = (index: number) => {
    setTask(tasks[index]);
    setEditIndex(index);
  };

  const handleDeleteTask = (index: number) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
    saveTasks(updatedTasks); // Save to AsyncStorage
  };

  const renderItem = ({ item, index }: { item: string; index: number }) => (
    <View style={styles.task}>
      <Text style={styles.taskText}>{item}</Text>
      <View style={styles.taskActions}>
        <TouchableOpacity onPress={() => handleEditTask(index)}>
          <Text style={styles.editButton}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDeleteTask(index)}>
          <Text style={styles.deleteButton}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Meowwww Notes</Text>
      <Text style={styles.title}>ToDo App</Text>
      <TextInput
        style={styles.input}
        value={task}
        onChangeText={setTask}
        placeholder="Enter Task"
      />
      <TouchableOpacity onPress={handleAddTask} style={styles.addButton}>
        <Text style={styles.addButtonText}>{editIndex !== -1 ? "Update Task" : "Add Task"}</Text>
      </TouchableOpacity>
      <FlatList data={tasks} renderItem={renderItem} keyExtractor={(_, index) => index.toString()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 40,
    padding: 40,
  },
  heading: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 7,
    color: "dodgerblue",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    borderWidth: 2,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 10,
    fontSize: 18,
  },
  addButton: {
    backgroundColor: "dodgerblue",
    padding: 12,
    borderRadius: 5,
    marginBottom: 10,
    alignItems: "center",
  },
  addButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  task: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  taskActions: {
    flexDirection: "row",
  },
  editButton: {
    color: "dodgerblue",
    fontWeight: "bold",
    fontSize: 16,
    marginRight: 10,
  },
  deleteButton: {
    color: "red",
    fontWeight: "bold",
    fontSize: 16,
  },
  taskText: {
    fontSize: 18,
  },
});
