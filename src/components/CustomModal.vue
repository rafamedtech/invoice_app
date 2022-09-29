<script setup>
import { useStore } from "@/stores/main";
import { storeToRefs } from "pinia";

const { currentInvoice } = storeToRefs(useStore());

// const { editInvoice } = storeToRefs(useStore());
// const { editCurrentInvoice } = useStore();

// const closeModal = () => {
//   useStore().toggleModal();
// };
console.log(currentInvoice);
const closeModal = () => {
  useStore().$patch({
    emailModal: false,
  });
};
</script>

<template>
  <div class="my-modal flex bg-[#1a1a1a]/50">
    <div class="modal-content">
      <p>
        La cotización fue enviada exitosamente a
        <span class="text-primary italic">{{
          currentInvoice.clientEmail
        }}</span>
      </p>
      <div class="my-actions flex gap-2 w-fit mx-auto">
        <!-- <button
          @click="closeModal"
          class="btn bg-[#f2f2f2] text-[#1a1a1a] border-none focus:outline-primary hover:bg-[#f2f2f2] hover:text-primary"
        >
          Return
        </button> -->
        <button
          @click="closeModal"
          class="btn bg-primary border-none hover:bg-secondary focus:outline-primary"
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
