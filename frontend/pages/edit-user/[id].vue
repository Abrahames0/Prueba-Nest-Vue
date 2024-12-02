<template>
    <div class="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <div class="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <h1 class="text-3xl font-semibold text-gray-800 mb-6 text-center">
          Editar Usuario
        </h1>
        <form @submit.prevent="handleEdit" class="space-y-5">
          <div>
            <input v-model="name" type="text" placeholder="Nombre" required
              class="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:border-green-500"
            />
          </div>
          <div>
            <input v-model="email" type="email" placeholder="Correo Electrónico" required
              class="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:border-green-500"
            />
          </div>
          <div>
            <input v-model="contact" type="text" placeholder="Número de Teléfono" required
              class="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:border-green-500"
            />
          </div>
          <button type="submit"
            class="w-full bg-green-600 text-white py-3 rounded-full hover:bg-green-500 transition-all duration-300">
            Guardar Cambios
          </button>
        </form>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import useApi from '~/composables/useApi';
  
  const router = useRouter();
  const route = useRoute();
  const { getUsers, updateUser } = useApi();
  
  const id = route.params.id;
  const name = ref('');
  const email = ref('');
  const contact = ref('');
  
  onMounted(async () => {
    await loadUser();
  });
  
  const loadUser = async () => {
    try {
      const response = await getUsers();
      const user = response.find((u) => u.id === id);
      if (user) {
        name.value = user.name;
        email.value = user.email;
        contact.value = user.contact;
      }
    } catch (error) {
      alert('Error al cargar el usuario');
      router.push('/dashboard');
    }
  };
  
  const handleEdit = async () => {
  try {
    await updateUser(id, {
      name: name.value,
      email: email.value,
      contact: contact.value,
    });
    alert('Usuario actualizado correctamente');
    router.push('/dashboard');
  } catch (error) {
    console.error('Error al actualizar el usuario:', error);
    alert('Error al actualizar el usuario');
  }
};
  </script>
  