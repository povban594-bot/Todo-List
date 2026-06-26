<template>
  <div class="bg-red-50 rounded-lg p-4 max-w-md m-auto mt-20 shadow">
    <h1 class="text-2xl font-bold mb-4">Todo-List</h1>

    <div class="mb-3">
      <input
        v-model="searchQuery"
        type="search"
        placeholder="Search task"
        class="w-full border p-2 rounded-lg"
      />
    </div>
    <div class="flex mb-4">
      <input
        v-model="newTodo"
        type="text"
        placeholder="Add a new task"
        class="flex-1 border p-2 rounded-lg mr-2"
        @keyup.enter="addTodo"
      />
      <button
        @click="addTodo"
        class="bg-blue-500 text-white px-4 rounded-lg hover:bg-blue-600"
      >
        Add
      </button>
    </div>

    <!-- Incomplete tasks -->
    <ul v-if="incompleteTodos.length > 0">
      <li v-for="todo in incompleteTodos" :key="todo.id" class="py-1">
        <div class="flex justify-between border p-2 mr-2 w-full rounded-lg bg-white">
          <div class="flex items-center">
            <input
              type="checkbox"
              :checked="todo.completed"
              @change="toggleComplete(todo, $event)"
              class="rounded-lg mr-2"
            />
            <div v-if="editingId === todo.id" class="flex items-center space-x-2">
              <input
                v-model="editingText"
                type="text"
                class="px-1 border rounded border-gray-300"
                @keyup.enter="saveEdit(todo)"
              />
              <button
                @click="saveEdit(todo)"
                class="text-white bg-green-500 px-1 rounded text-[13px] hover:bg-green-600"
              >Save</button>
              <button
                @click="cancelEdit"
                class="text-white bg-red-400 px-1 rounded text-[13px] hover:bg-red-600"
              >Cancel</button>
            </div>
            <span v-else>{{ todo.title }}</span>
          </div>
          <div class="flex items-center gap-1">
            <button
              @click="startEdit(todo)"
              class="bg-blue-400 px-1 rounded text-white text-[13px] hover:text-gray-700"
            >edit</button>
            <button
              @click="deleteTodo(todo.id)"
              class="text-white bg-red-700 px-1 rounded hover:bg-red-800 text-[13px]"
            >delete</button>
          </div>
        </div>
      </li>
    </ul>
    <p v-else class="text-center text-gray-500 py-2 text-sm">No tasks</p>

    <!-- Divider + Completed section -->
    <template v-if="completedTodos.length > 0">
      <div class="flex items-center my-3 gap-2">
        <hr class="flex-1 border-gray-300" />
        <span class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Completed</span>
        <hr class="flex-1 border-gray-300" />
      </div>

      <ul>
        <li v-for="todo in completedTodos" :key="todo.id" class="py-1">
          <div class="flex justify-between border p-2 mr-2 w-full rounded-lg bg-white">
            <div class="flex items-center">
              <input
                type="checkbox"
                :checked="todo.completed"
                @change="toggleComplete(todo, $event)"
                class="rounded-lg mr-2"
              />
              <span class="text-green-700 line-through">{{ todo.title }}</span>
            </div>
            <div class="flex items-center gap-1">
              <span class="text-[13px] text-white bg-green-500 px-1 py-0.5 rounded">Done</span>
              <button
                @click="deleteTodo(todo.id)"
                class="text-white bg-red-700 px-1 rounded hover:bg-red-800 text-[13px]"
              >delete</button>
            </div>
          </div>
        </li>
      </ul>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import {
  collection, addDoc, deleteDoc, doc, onSnapshot,
  updateDoc, serverTimestamp, query, orderBy
} from "firebase/firestore";
import { db } from "./firebase";

const todosCollection = collection(db, "todos");

const todos = ref([]);
const newTodo = ref("");
const editingId = ref(null);
const editingText = ref("");
const searchQuery = ref("");

const filteredTodos = computed(() => {
  const q = searchQuery.value.trim().toLowerCase();
  if (!q) return todos.value;
  return todos.value.filter((t) => (t.title || "").toLowerCase().includes(q));
});

// Split into two lists
const incompleteTodos = computed(() => filteredTodos.value.filter(t => !t.completed));
const completedTodos = computed(() => filteredTodos.value.filter(t => t.completed));

onMounted(() => {
  const q = query(todosCollection, orderBy("createdAt", "desc"));
  onSnapshot(q, (snapshot) => {
    todos.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  });
});

const addTodo = async () => {
  if (newTodo.value.trim() === "") return;
  await addDoc(todosCollection, {
    title: newTodo.value.trim(),
    completed: false,
    createdAt: serverTimestamp()
  });
  newTodo.value = "";
};

const toggleComplete = async (todo, e) => {
  const checked = e && e.target ? e.target.checked : !todo.completed;
  await updateDoc(doc(db, "todos", todo.id), { completed: checked });
};

const deleteTodo = async (id) => {
  await deleteDoc(doc(db, "todos", id));
};

const startEdit = (todo) => {
  editingId.value = todo.id;
  editingText.value = todo.title;
};

const saveEdit = async (todo) => {
  const trimmed = editingText.value.trim();
  if (trimmed === "") { cancelEdit(); return; }
  await updateDoc(doc(db, "todos", todo.id), { title: trimmed });
  editingId.value = null;
  editingText.value = "";
};

const cancelEdit = () => {
  editingId.value = null;
  editingText.value = "";
};
</script>