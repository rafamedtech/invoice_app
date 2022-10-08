<script setup>
import { RouterView } from "vue-router";
// import { ref } from "vue";
import { useStore } from "@/stores/main";
import { storeToRefs } from "pinia";

import NavBar from "./components/NavBar.vue";
import InvoiceModal from "./components/InvoiceModal.vue";
import MyModal from "./components/MyModal.vue";
import CustomModal from "./components/CustomModal.vue";

const { invoiceDialog, modalActive, customModal, invoicesLoaded, user } =
  storeToRefs(useStore());
const { getInvoices, fetchUser } = useStore();

// const mobile = ref(null);

// const checkScreen = () => {
//   const windowWidth = window.innerWidth;

//   if (windowWidth <= 750) {
//     mobile.value = true;
//     return;
//   }

//   mobile.value = false;
// };

// checkScreen();

getInvoices();

fetchUser();
</script>

<template>
  <div v-if="invoicesLoaded">
    <div class="app flex-column flex">
      <NavBar v-if="user" />
      <div class="app-content flex-column flex">
        <MyModal v-if="modalActive" />
        <CustomModal v-if="customModal" />
        <transition name="invoice">
          <InvoiceModal v-if="invoiceDialog" />
        </transition>
        <RouterView v-slot="{ Component }">
          <transition name="page" mode="out-in">
            <Component :is="Component" />
          </transition>
        </RouterView>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap");

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Poppins", sans-serif;
}

.app {
  background-color: #f2f2f2;
  min-height: 100vh;
  @media (min-width: 900px) {
    flex-direction: row !important;
  }

  .app-content {
    padding: 0;
    // padding: 0 20px 0 0;
    flex: 1;
    position: relative;
  }
}

.mobile-message {
  text-align: center;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #141625;
  color: #fff;

  p {
    margin-top: 16px;
  }
}

// animated invoice

.invoice-enter-active,
.invoice-leave-active {
  transition: 0.4s ease all;
}

.invoice-enter-from,
.invoice-leave-to {
  transform: translateX(-700px);
}
// .page-move,
.page-enter-active,
.page-leave-active {
  transition: 0.4s ease-out all;
}

.page-enter-from {
  transform: translateX(-30px);
  opacity: 0;
}
.page-leave-to {
  transform: translateX(30px);
  opacity: 0;
}

// .page-enter-from,
// .page-leave-to {
//   transform: translateX(20px);
//   opacity: 0;
// }

// button,
// .button {
//   cursor: pointer;
//   padding: 16px 24px;
//   border-radius: 30px;
//   border: none;
//   font-size: 12px;
//   margin-right: 8px;
//   color: #fff;
// }

.dark-purple {
  background-color: #e90f02;
}

.red {
  background-color: #ec5757;
}

.purple {
  background-color: #7c5dfa;
}

.green {
  background-color: #33d69f;
}

.orange {
  background-color: #ff8f00;
}

// utility classes

.flex {
  display: flex;
}

.flex-column {
  flex-direction: column;
}

.custom-container {
  width: 100%;
  padding: 40px 10px;
  max-width: 850px;
  margin: 0 auto;

  @media (min-width: 768px) {
    padding-left: 100px;
    padding-right: 100px;
  }

  @media (min-width: 900px) {
    padding: 72px 10px 40px 10px;
  }
}

.nav-link {
  text-decoration: none;
  color: initial;
}

// Status Button Styling

.status-button {
  &::before {
    content: "";
    width: 10px;
    height: 10px;
    border-radius: 50%;
    // margin-right: 8px;
  }
  @media (min-width: 900px) {
    width: 10rem;
    justify-content: center;
  }
  font-size: 12px;
  // margin-right: 30px;
  align-items: center;
  // margin: 0 auto;
  // text-align: center;
  // padding: 8px 30px;
  border-radius: 10px;
}

.paid {
  &::before {
    background-color: #29b385;
    // background-color: #33d69f;
  }
  color: #29b385;
  background-color: rgba(51, 214, 160, 0.1);
}

.pending {
  &::before {
    background-color: #ff8f00;
  }
  color: #ff8f00;
  background-color: rgba(255, 145, 0, 0.1);
}

.draft {
  &::before {
    background-color: #747680;
    // background-color: #dfe3fa;
  }
  color: #747680;
  // color: #dfe3fa;
  background-color: rgba(223, 227, 250, 0.5);
}
</style>
