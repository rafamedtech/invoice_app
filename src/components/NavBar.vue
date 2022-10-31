<script setup>
import { useStore } from "@/stores/main";

// const { userLogout } = useStore();
const userLogout = () => {
  useStore().$patch({
    customModal: true,
    modalType: "logout",
  });
};
</script>

<template>
  <header
    class="flex flex-col justify-between shadow-sm print:hidden lg:shadow-lg"
  >
    <div class="branding flex w-28 items-center bg-white lg:w-24">
      <img
        src="@/assets/logo-bgremoved.png"
        alt=""
        class="rounded-[10px] lg:h-24 lg:w-24"
      />
    </div>
    <button
      @click="userLogout"
      class="branding flex flex-col items-center bg-white text-secondary"
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
