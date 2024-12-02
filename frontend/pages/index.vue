<template>
    <Navbar />
    <div class="min-h-screen bg-gray-100 flex flex-col items-center justify-center animate-fadeIn">
      <div class="max-w-2xl w-full text-center mt-8 px-6">
        <h1 class="text-5xl font-bold text-gray-800 mb-4 animate-fadeIn delay-100">
          Bienvenido a esta prueba tecnica con Nuxt 3
        </h1>
        <p class="text-lg text-gray-600 mb-6 animate-fadeIn delay-200">
          Esta es la página principal.
        </p>
        <NuxtLink to="/register"
          class="inline-block bg-green-600 text-white py-3 px-6 rounded-full hover:bg-green-500 transition-all duration-300 animate-bounce delay-300">
          Regístrate Ahora
        </NuxtLink>
      </div>
    </div>
  </template>
  
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
  
  @keyframes bounce {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-10px);
    }
  }
  
  .animate-bounce {
    animation: bounce 1.5s infinite;
  }
  </style>
  