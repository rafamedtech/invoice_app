<script setup>
import { reactive, computed } from "vue";
import useVuelidate from "@vuelidate/core";
import { required, email, minLength, helpers } from "@vuelidate/validators";
import { useStore } from "@/stores/main";

const { userLogin } = useStore();

const state = reactive({
  email: "",
  password: "",
});

const rules = computed(() => {
  return {
    email: {
      required: helpers.withMessage("Este campo es requerido", required),
      email: helpers.withMessage("Formato inválido", email),
    },
    password: {
      required: helpers.withMessage("Este campo es requerido", required),
      minLength: helpers.withMessage(
        "La contraseña debe tener al menos 6 caracteres",
        minLength(6)
      ),
    },
  };
});
const v$ = useVuelidate(rules, state);

const submitForm = () => {
  userLogin(state);
};
</script>
<template>
  <main class="bg-[#f2f2f2]">
    <section
      class="container mx-auto flex flex-col flex-wrap items-center justify-center px-5 py-24 text-gray-400 lg:gap-8"
    >
      <figure class="p-4">
        <img
          src="../assets/logo-bgremoved.png"
          alt=""
          class="h-40 rounded-[20px]"
        />
      </figure>
      <form
        @submit.prevent="submitForm"
        class="bg-opacity-50 mt-10 flex w-full flex-col rounded-[20px] bg-white p-8 shadow-lg md:mt-0 md:w-1/2 lg:w-2/6"
      >
        <h2
          class="mb-5 w-fit border-b-2 border-primary text-lg font-medium text-[#1a1a1a]"
        >
          Iniciar sesión
        </h2>
        <div class="relative mb-4">
          <label for="full-name" class="text-sm leading-7 text-gray-400"
            >Email</label
          >
          <div class="relative">
            <input
              v-model="state.email"
              type="text"
              id="email"
              name="email"
              class="bg-opacity-20 w-full rounded border border-gray-600 bg-transparent py-1 px-3 text-base leading-8 text-[#1a1a1a] outline-none transition-colors duration-200 ease-in-out focus:border-secondary focus:bg-transparent focus:ring-2 focus:ring-transparent"
              :class="{
                ' border-red-500 focus:border-red-500': v$.email.$error,
                'border-[#42d392] ': !v$.email.$invalid,
              }"
              @change="v$.email.$touch"
              autocomplete="off"
            />
            <!-- <Icon
              v-if="!v$.email.$invalid"
              class="absolute right-2 h-full text-xl text-green-500"
              name="heroicons-solid:check-circle"
            />
            <Icon
              v-if="v$.email.$error"
              class="absolute right-2 h-full text-xl text-red-500"
              name="heroicons-solid:x-circle"
            /> -->
          </div>
          <span class="text-xs text-red-500" v-if="v$.email.$error">{{
            v$.email.$errors[0].$message
          }}</span>
        </div>
        <div class="relative mb-4">
          <label for="password" class="text-sm leading-7 text-gray-400"
            >Contraseña</label
          >
          <div class="relative">
            <input
              id="password"
              v-model="state.password"
              name="password"
              type="password"
              class="bg-opacity-20 w-full rounded border border-gray-600 bg-transparent py-1 px-3 text-base leading-8 text-[#1a1a1a] outline-none transition-colors duration-200 ease-in-out focus:border-secondary focus:bg-transparent focus:ring-2 focus:ring-transparent"
              :class="{
                ' border-red-500 focus:border-red-500': v$.password.$error,
                'border-[#42d392]': !v$.password.$invalid,
              }"
              @change="v$.password.$touch"
            />
            <!-- <Icon
              v-if="!v$.password.$invalid"
              class="absolute right-2 h-full text-xl text-green-500"
              name="heroicons-solid:check-circle"
            />
            <Icon
              v-if="v$.password.$error"
              class="absolute right-2 h-full text-xl text-red-500"
              name="heroicons-solid:x-circle"
            /> -->
          </div>
          <span class="text-xs text-red-500" v-if="v$.password.$error">{{
            v$.password.$errors[0].$message
          }}</span>
        </div>
        <button
          class="rounded border-0 bg-primary py-2 px-8 font-sans font-bold text-white transition-colors duration-500 hover:bg-secondary focus:outline-none"
        >
          Enviar
        </button>
      </form>
    </section>
  </main>
</template>
