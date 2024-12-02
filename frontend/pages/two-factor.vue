<template>
    <div class="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <div class="w-full max-w-md bg-white rounded-lg shadow-md p-8 animate-fadeIn">
        <h1 class="text-3xl font-semibold text-gray-800 mb-6 text-center">
          Verificación en Dos Pasos
        </h1>
        <form @submit.prevent="handleTwoFactor" class="space-y-5">
          <div>
            <input
              v-model="verificationCode" type="text" placeholder="Código de verificación" required
              class="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:border-green-500"
            />
            <p v-if="errors.verificationCode" class="text-red-500 text-sm mt-1">{{ errors.verificationCode }}</p>
          </div>
          <button type="submit"
            class="w-full bg-green-600 text-white py-3 rounded-full hover:bg-green-500 transition-all duration-300">
            Verificar
          </button>
        </form>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import useApi from '~/composables/useApi';
  
  const router = useRouter();
  const verificationCode = ref('');
  const errors = ref({});
  const { verifyCode } = useApi();
  
  const email = localStorage.getItem('userEmail');
  
  if (!email) {
    alert('Debe iniciar sesión primero.');
    router.push('/login');
  }
  
  const handleTwoFactor = async () => {
    errors.value = {};
  
    if (!verificationCode.value.trim()) {
      errors.value.verificationCode = 'El código de verificación es obligatorio.';
    }
  
    if (Object.keys(errors.value).length > 0) {
      return;
    }
  
    try {
      await verifyCode(email, verificationCode.value);
      alert('Verificación exitosa');
      router.push('/dashboard');
    } catch (error) {
      alert(error.data?.message || 'Código de verificación incorrecto');
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
  