<template>
    <nav class="bg-gray shadow-md py-5">
      <div class="container mx-auto flex justify-end items-center">
        <ul class="flex space-x-6">
          <li>
            <NuxtLink to="/login" class="text-gray-600 hover:text-green-600 transition-colors duration-300">
              Iniciar sesión
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="/register" class="bg-green-600 text-white py-2 px-4 rounded-full hover:bg-green-500 transition-colors duration-300">
              Regístrate
            </NuxtLink>
          </li>
        </ul>
      </div>
    </nav>
  </template>
  