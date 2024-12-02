<template>
    <div class="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <div class="w-full max-w-md bg-white rounded-lg shadow-md p-8 animate-fadeIn">
        <h1 class="text-3xl font-semibold text-gray-800 mb-6 text-center">
          Regístrate
        </h1>
        <form @submit.prevent="handleRegister" class="space-y-5">
          <div>
            <input v-model="name" type="text" placeholder="Nombre y apellido" required
              class="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:border-green-500"
            />
            <p v-if="errors.name" class="text-red-500 text-sm mt-1">{{ errors.name }}</p>
          </div>
          <div>
            <input v-model="contact" type="text" maxlength="10" @input="contact = contact.replace(/[^0-9]/g, '').slice(0, 10)"
              placeholder="Número de teléfono" required
              class="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:border-green-500"
            />
            <p v-if="errors.contact" class="text-red-500 text-sm mt-1">{{ errors.contact }}</p>
          </div>
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
          <div class="relative">
            <input :type="confirmPasswordVisible ? 'text' : 'password'" v-model="confirmPassword" placeholder="Confirma tu contraseña" required
              class="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:border-green-500"
            />
            <p v-if="errors.confirmPassword" class="text-red-500 text-sm mt-1">{{ errors.confirmPassword }}</p>
            <button type="button" @click="confirmPasswordVisible = !confirmPasswordVisible"
              class="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 focus:outline-none">
              <span v-if="confirmPasswordVisible">🙈</span>
              <span v-else>👀</span>
            </button>
          </div>
          <button type="submit"
            class="w-full bg-green-600 text-white py-3 rounded-full hover:bg-green-500 transition-all duration-300">
            Registrar
          </button>
          <p class="text-gray-400 flex items-center justify-center text-center">
            Ya estás registrado,
            <NuxtLink to="/login" class="ml-1 text-gray-500 hover:text-green-600 transition-colors duration-300">
              Iniciar sesión aquí.
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
  
  const name = ref('');
  const email = ref('');
  const contact = ref('');
  const password = ref('');
  const confirmPassword = ref('');
  const passwordVisible = ref(false);
  const confirmPasswordVisible = ref(false);
  const errors = ref({});
  const { register } = useApi();
  
  const validateForm = () => {
    errors.value = {};
  
    if (!name.value.trim()) {
      errors.value.name = 'El nombre es obligatorio.';
    } else if (typeof name.value !== 'string') {
      errors.value.name = 'El nombre debe ser una cadena de texto.';
    }
  
    if (!contact.value) {
      errors.value.contact = 'El contacto es obligatorio.';
    } else if (!/^\d{10}$/.test(contact.value)) {
      errors.value.contact = 'El contacto debe tener exactamente 10 dígitos.';
    } else if (typeof contact.value !== 'string') {
      errors.value.contact = 'El contacto debe ser una cadena de texto.';
    }
  
    if (!email.value.trim()) {
      errors.value.email = 'El correo es obligatorio.';
    } else if (!/\S+@\S+\.\S+/.test(email.value)) {
      errors.value.email = 'El correo no es válido.';
    }
  
    if (!password.value) {
      errors.value.password = 'La contraseña es obligatoria.';
    } else if (password.value.length < 10) {
      errors.value.password = 'La contraseña debe tener al menos 10 caracteres.';
    } else if (typeof password.value !== 'string') {
      errors.value.password = 'La contraseña debe ser una cadena de texto.';
    }
  
    if (!confirmPassword.value) {
      errors.value.confirmPassword = 'La confirmación de la contraseña es obligatoria.';
    } else if (confirmPassword.value.length < 10) {
      errors.value.confirmPassword = 'La confirmación de la contraseña debe tener al menos 10 caracteres.';
    } else if (typeof confirmPassword.value !== 'string') {
      errors.value.confirmPassword = 'La confirmación de la contraseña debe ser una cadena de texto.';
    } else if (password.value !== confirmPassword.value) {
      errors.value.confirmPassword = 'Las contraseñas no coinciden.';
    }
  
    return Object.keys(errors.value).length === 0;
  };
  
  const handleRegister = async () => {
    if (!validateForm()) {
      return;
    }
  
    try {
      const response = await register({
        name: name.value,
        email: email.value,
        contact: contact.value,
        password: password.value,
        confirmPassword: confirmPassword.value,
      });
      localStorage.setItem('token', response.token);
      alert('Registro exitoso');
      router.push('/login');
    } catch (error) {
      const errorMessage = Array.isArray(error.data.message)
        ? error.data.message.join('\n')
        : error.data.message;
      alert(errorMessage || 'Error al registrarse');
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
  