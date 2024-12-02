<template>
    <div class="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <div class="w-full max-w-md bg-white rounded-lg shadow-md p-8 animate-fadeIn">
        <h1 class="text-3xl font-semibold text-gray-800 mb-6 text-center">
          Iniciar Sesión
        </h1>
        <form @submit.prevent="handleLogin" class="space-y-5">
          <div>
            <input v-model="email" type="email" placeholder="Correo electrónico" required
              class="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:border-green-500"
            />
            <p v-if="errors.email" class="text-red-500 text-sm mt-1">{{ errors.email }}</p>
          </div>
          <div class="relative">
            <input :type="passwordVisible ? 'text' : 'password'" v-model="password" placeholder="Contraseña" required
              class="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:border-green-500"
            />
            <p v-if="errors.password" class="text-red-500 text-sm mt-1">{{ errors.password }}</p>
            <button type="button" @click="passwordVisible = !passwordVisible"
              class="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 focus:outline-none">
              <span v-if="passwordVisible">🙈</span>
              <span v-else>👀</span>
            </button>
          </div>
          <button type="submit"
            class="w-full bg-green-600 text-white py-3 rounded-full hover:bg-green-500 transition-all duration-300">
            Iniciar Sesión
          </button>
          <p class="text-gray-400 flex items-center justify-center text-center">
            ¿No tienes cuenta?
            <NuxtLink to="/register" class="ml-1 text-gray-500 hover:text-green-600 transition-colors duration-300">
              Regístrate aquí.
            </NuxtLink>
          </p>
        </form>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import useApi from '~/composables/useApi';
  
  const router = useRouter();
  const email = ref('');
  const password = ref('');
  const passwordVisible = ref(false);
  const errors = ref({});
  const { login } = useApi();

  definePageMeta({
   middleware: 'auth',
  });

  
  const handleLogin = async () => {
    errors.value = {};
  
    if (!email.value.trim()) {
      errors.value.email = 'El correo es obligatorio.';
    } else if (!/\S+@\S+\.\S+/.test(email.value)) {
      errors.value.email = 'El correo no es válido.';
    }
  
    if (!password.value.trim()) {
      errors.value.password = 'La contraseña es obligatoria.';
    }
  
    if (Object.keys(errors.value).length > 0) {
      return;
    }
  
    try {
      const response = await login(email.value, password.value);
      
      if (process.client) {
        localStorage.setItem('userEmail', email.value);
      }
  
      alert('Código de verificación enviado al correo');
      
      router.push('/two-factor');
    } catch (error) {
      alert(error?.data?.message || 'Error al iniciar sesión');
    }
  };
  </script>
  
  <style scoped>
  @keyframes fadeIn {
    0% {
      opacity: 0;
      transform: translateY(20px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .animate-fadeIn {
    animation: fadeIn 1s ease-out forwards;
  }
  </style>
  