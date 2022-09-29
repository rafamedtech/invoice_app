<script setup>
import { useStore } from "@/stores/main";

const { userLogout } = useStore();
</script>

<template>
  <header
    class="flex print:hidden justify-between flex-col shadow-sm lg:shadow-lg"
  >
    <div class="branding w-28 lg:w-24 items-center flex bg-white">
      <img
        src="@/assets/logo-bgremoved.png"
        alt=""
        class="rounded-[10px] lg:w-24 lg:h-24"
      />
    </div>
    <button
      @click="userLogout"
      class="branding flex bg-white flex-col items-center text-secondary"
    >
      <i class="fa-solid fa-right-from-bracket text-2xl"></i>
      <p class="text-xs">Cerrar sesión</p>
    </button>
  </header>
</template>

<style lang="scss" scoped>
header {
  z-index: 99;
  flex-direction: row;
  background-color: #fff;
  @media (min-width: 900px) {
    min-height: 100%;
    max-height: 100vh;
    min-width: 80px;
    flex-direction: column;
    border-radius: 0 20px 0 0;
    position: fixed;
  }

  .branding {
    // border-radius: 0 20px 20px 0;
    // background-color: #e90f02;
    justify-content: center;
    padding: 12px 5px;

    @media (min-width: 900px) {
      width: 100%;
      // padding: 24px 10px;
    }

    img {
      width: auto;
      // height: 30px;
    }
  }
}
</style>
