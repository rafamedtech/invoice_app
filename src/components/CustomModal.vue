<script setup>
// Imports
import { useStore } from "@/stores/main";
import { storeToRefs } from "pinia";

// Definitions
const { currentInvoice, modalType } = storeToRefs(useStore());
const { deleteCurrentInvoice, userLogout } = useStore();

const closeModal = () => {
  useStore().$patch({
    customModal: false,
  });
};

const deleteInvoice = () => {
  deleteCurrentInvoice(currentInvoice.value.docId);
  closeModal();
};

const toggleUserLogout = () => {
  userLogout();
  closeModal();
};

const createPDF = () => {
  closeModal();
  setTimeout(() => {
    window.print();
  }, 500);
};
</script>

<template>
  <div class="my-modal flex bg-[#1a1a1a]/50">
    <div class="modal-content margin-2">
      <!-- Email dialog -->
      <div v-if="modalType === 'email'">
        <p>La cotización fue enviada exitosamente a los siguientes correos:</p>
        <div class="mx-auto w-full text-center">
          <span class="italic text-primary">{{
            currentInvoice.clientEmail
          }}</span>
          <br />
          <span
            v-if="currentInvoice.clientEmail2"
            class="italic text-primary"
            >{{ currentInvoice.clientEmail2 }}</span
          >
        </div>
        <div class="my-actions mx-auto flex w-fit gap-2">
          <button
            @click="closeModal"
            class="btn border-none bg-primary text-white hover:bg-secondary focus:outline-primary"
          >
            Aceptar
          </button>
        </div>
      </div>

      <!-- PDF dialog -->
      <div v-if="modalType === 'print'">
        <p>
          Asegúrate de elegir <strong>"Guardar como PDF"</strong> en el destino
          y que el diseño sea <strong>"Horizontal"</strong>.
        </p>
        <figure class="my-4">
          <img class="rounded-[20px]" src="@/assets/images/print.png" alt="" />
        </figure>
        <div class="my-actions mx-auto flex w-fit gap-2">
          <button
            @click="closeModal"
            class="btn border-none bg-[#f2f2f2] text-[#1a1a1a] hover:bg-[#f2f2f2] hover:text-primary focus:outline-primary"
          >
            Regresar
          </button>
          <button
            @click="createPDF"
            class="btn border-none bg-primary text-white hover:bg-secondary focus:outline-primary"
          >
            Aceptar
          </button>
        </div>
      </div>

      <!-- Delete dialog -->
      <div v-if="modalType === 'delete'">
        <p>¿Seguro que deseas eliminar la cotización?</p>
        <div class="my-actions mx-auto flex w-full gap-2">
          <button
            @click="closeModal"
            class="btn border-none bg-[#f2f2f2] text-[#1a1a1a] hover:bg-[#f2f2f2] hover:text-primary focus:outline-primary"
          >
            Regresar
          </button>
          <button
            @click="deleteInvoice"
            class="btn border-none bg-primary text-white hover:bg-secondary focus:outline-primary"
          >
            Aceptar
          </button>
        </div>
      </div>

      <!-- Logout dialog -->
      <div v-if="modalType === 'logout'">
        <p>¿Seguro que deseas cerrar sesión?</p>
        <div class="my-actions mx-auto flex w-full gap-2">
          <button
            @click="closeModal"
            class="btn border-none bg-[#f2f2f2] text-[#1a1a1a] hover:bg-[#f2f2f2] hover:text-primary focus:outline-primary"
          >
            Regresar
          </button>
          <button
            @click="toggleUserLogout"
            class="btn border-none bg-primary text-white hover:bg-secondary focus:outline-primary"
          >
            Aceptar
          </button>
        </div>
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
