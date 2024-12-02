<template>
    <div class="min-h-screen p-8 bg-gray-100 relative">
      <div class="bg-white rounded-lg shadow-md p-6 mb-8 flex justify-between items-center">
        <h1 class="text-4xl font-semibold text-gray-800">Lista de Usuarios</h1>
        <div class="relative">
          <button @click="toggleDropdown" class="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center text-xl font-semibold">
            {{ userInitial }}
          </button>
          <div v-if="isDropdownOpen" class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10">
            <ul class="py-2">
              <li @click="logout" class="px-4 py-2 cursor-pointer hover:bg-gray-100 text-gray-800">Cerrar sesión</li>
            </ul>
          </div>
        </div>
      </div>
  
      <div class="overflow-x-auto">
        <table class="w-full bg-white rounded-lg shadow-lg overflow-hidden">
          <thead>
            <tr class="bg-gradient-to-r from-gray-200 to-gray-300 text-left text-gray-700">
              <th class="py-4 px-6 font-medium">Nombre</th>
              <th class="py-4 px-6 font-medium">Correo Electrónico</th>
              <th class="py-4 px-6 font-medium">Teléfono</th>
              <th class="py-4 px-6 font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users" :key="user.id" class="border-b hover:bg-gray-100 transition-colors">
              <td class="py-4 px-6 text-gray-800">{{ user.name }}</td>
              <td class="py-4 px-6 text-gray-800">{{ user.email }}</td>
              <td class="py-4 px-6 text-gray-800">{{ user.contact }}</td>
              <td class="py-4 px-6">
                <button 
                  @click="editUser(user)" 
                  class="text-sm bg-blue-500 text-white px-4 py-2 rounded-md shadow-md mr-2 hover:bg-blue-600 transition-all">
                  Editar
                </button>
                <button 
                  @click="removeUser(user.id)" 
                  class="text-sm bg-red-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-red-600 transition-all">
                  Eliminar
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import useApi from '~/composables/useApi';
  import { useRouter } from 'vue-router';
  
  definePageMeta({
    middleware: 'auth',
  });
  
  const users = ref([]);
  const { getUsers, deleteUser } = useApi();
  const router = useRouter();
  
  const userInitial = "U";
  const isDropdownOpen = ref(false);
  
  const toggleDropdown = () => {
    isDropdownOpen.value = !isDropdownOpen.value;
  };
  
  const logout = () => {
    localStorage.removeItem('token');
    alert('Has cerrado sesión correctamente');
    router.push('/login');
  };
  
  onMounted(async () => {
    await loadUsers();
  });
  
  const loadUsers = async () => {
    try {
      const response = await getUsers();
      users.value = response;
    } catch (error) {
      alert('Error al cargar los usuarios');
    }
  };
  
  const editUser = (user) => {
    router.push(`/edit-user/${user.id}`);
  };
  
  const removeUser = async (id) => {
    if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      try {
        await deleteUser(id);
        alert('Usuario eliminado correctamente');
        await loadUsers();
      } catch (error) {
        alert('Error al eliminar el usuario');
      }
    }
  };
  </script>
  