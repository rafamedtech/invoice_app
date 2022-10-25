<script setup>
// Dependencies imports
import { useStore } from "@/stores/main";
import { storeToRefs } from "pinia";

const { editInvoice } = storeToRefs(useStore());
const { editCurrentInvoice, toggleModal, toggleInvoice } = useStore();

const closeModal = () => {
  toggleModal();
};

const closeInvoice = () => {
  toggleInvoice();
  closeModal();
  if (editInvoice.value) {
    editCurrentInvoice();
  }
};
</script>

<template>
  <div class="my-modal flex bg-[#1a1a1a]/50">
    <div class="modal-content">
      <p>¿Seguro que quieres salir? Los cambios no serán guardados!</p>
      <div class="my-actions flex gap-2">
        <button
          @click="closeModal"
          class="btn border-none bg-[#f2f2f2] text-[#1a1a1a] hover:bg-[#f2f2f2] hover:text-primary focus:outline-primary"
        >
          Regresar
        </button>
        <button
          @click="closeInvoice"
          class="btn border-none bg-primary text-white hover:bg-primary/50 focus:outline-primary"
        >
          Salir
        </button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.my-modal {
  z-index: 100;
  position: fixed;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100%;

  .modal-content {
    border-radius: 20px;
    padding: 48px 32px;
    max-width: 450px;
    background-color: #fff;
    color: #1a1a1a;

    p {
      text-align: center;
    }

    .my-actions {
      margin-top: 24px;
      button {
        flex: 1;
      }
    }
  }
}
</style>
