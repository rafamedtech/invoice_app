<script setup>
import { useMainStore } from "@/stores/main";
import { storeToRefs } from "pinia";

const { clientInfo, eta } = storeToRefs(useMainStore());

const closeDialog = () => {
  useMainStore().$patch({
    newQuote: false,
  });
};
</script>

<template>
  <section
    class="min-h-screen absolute inset-0 bg-[#F2F2F2] max-w-screen-md z-50"
  >
    <form class="p-8 shadow-xl h-full relative">
      <h2 class="text-3xl text-primary">Nueva cotizacion</h2>

      <!-- Datos del cliente -->
      <div class="w-2/3 py-4">
        <h3 class="border-b border-primary w-fit mb-4 text-xl">
          Datos del cliente
        </h3>
        <div class="flex flex-col gap-2 mb-4">
          <label for="name" class="text-xs">Nombre</label>
          <input
            v-model="clientInfo.name"
            type="text"
            class="h-10 rounded-lg focus:ring-primary focus:border-primary"
          />
        </div>
        <div class="flex flex-col gap-2 mb-4">
          <label for="name" class="text-xs">Empresa</label>
          <input
            v-model="clientInfo.company"
            type="text"
            class="h-10 rounded-lg focus:ring-primary focus:border-primary"
          />
        </div>
        <div class="flex flex-col gap-2 mb-4">
          <label for="name" class="text-xs">Moneda</label>
          <input
            v-model="clientInfo.currency"
            type="text"
            class="h-10 rounded-lg focus:ring-primary focus:border-primary"
          />
        </div>
        <div class="flex flex-col gap-2 mb-4">
          <label for="name" class="text-xs">Tipo de cambio</label>
          <input
            v-model="clientInfo.exchange"
            type="text"
            class="h-10 rounded-lg focus:ring-primary focus:border-primary"
          />
        </div>
      </div>

      <!-- Lista de articulos -->
      <div>
        <h3 class="border-b border-primary w-fit mb-4 text-xl">Articulos</h3>
        <div>
          <h4 class="mb-2">Articulo 1</h4>
          <div class="flex gap-4">
            <div class="flex flex-col gap-2">
              <label for="name" class="text-xs">Descripcion</label>
              <textarea
                id="name"
                class="max-h-24 min-h-12 h-auto overflow-y-auto w-64 rounded-lg focus:ring-primary focus:border-primary"
              ></textarea>
            </div>
            <div class="flex flex-col gap-2 w-20">
              <label for="name" class="text-xs">Cantidad</label>
              <input
                type="text"
                class="h-10 rounded-lg focus:ring-primary focus:border-primary"
              />
            </div>
            <div class="flex flex-col gap-2 w-32">
              <label for="name" class="text-xs">Numero de parte</label>
              <input
                type="text"
                class="h-10 rounded-lg focus:ring-primary focus:border-primary"
              />
            </div>
            <div class="flex flex-col gap-2 w-36">
              <label for="name" class="text-xs">Precio Unitario</label>
              <input
                type="text"
                class="h-10 rounded-lg focus:ring-primary focus:border-primary"
              />
            </div>
          </div>
        </div>
      </div>

      <div class="flex flex-col w-36 mt-4 gap-2">
        <label>Tiempo de entrega</label>
        <input
          v-model="eta"
          type="text"
          class="h-10 rounded-lg focus:ring-primary focus:border-primary"
        />
      </div>
      <i
        @click="closeDialog"
        class="fa-solid fa-xmark absolute top-8 right-8 text-2xl z-50 cursor-pointer"
      ></i>
    </form>
  </section>
</template>
