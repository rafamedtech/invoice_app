<script setup>
// Imports
import { useStore } from "@/stores/main";
import { storeToRefs } from "pinia";

// Definitions
const { currentInvoice, modalType } = storeToRefs(useStore());
const { deleteCurrentInvoice } = useStore();

const closeModal = () => {
  useStore().$patch({
    customModal: false,
  });
};

const deleteInvoice = () => {
  deleteCurrentInvoice(currentInvoice.value.docId);
  closeModal();
};
</script>

<template>
  <div class="my-modal flex bg-[#1a1a1a]/50">
    <div class="modal-content margin-2">
      <p v-if="modalType === 'email'">
        La cotización fue enviada exitosamente a
        <span class="italic text-primary">{{
          currentInvoice.clientEmail
        }}</span>
      </p>
      <p v-else>¿Seguro que quieres eliminar la cotización?</p>
      <div
        v-if="modalType === 'email'"
        class="my-actions mx-auto flex w-fit gap-2"
      >
        <button
          @click="closeModal"
          class="btn border-none bg-primary hover:bg-secondary focus:outline-primary"
        >
          Aceptar
        </button>
      </div>
      <div v-else class="my-actions mx-auto flex w-full gap-2">
        <button
          @click="closeModal"
          class="btn border-none bg-[#f2f2f2] text-[#1a1a1a] hover:bg-[#f2f2f2] hover:text-primary focus:outline-primary"
        >
          Regresar
        </button>
        <button
          @click="deleteInvoice"
          class="btn border-none bg-primary hover:bg-secondary focus:outline-primary"
        >
          Aceptar
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
    margin: 1rem;
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
