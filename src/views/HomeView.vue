<script setup>
import { ref, computed } from "vue";
import { useStore } from "@/stores/main";
import { storeToRefs } from "pinia";

import MyInvoice from "@/components/MyInvoice.vue";
// import LoginForm from "@/components/LoginForm.vue";

const filterMenu = ref(null);

const { getInvoices } = useStore();

const newInvoice = () => {
  useStore().toggleInvoice();
};

const toggleFilterMenu = () => {
  filterMenu.value = !filterMenu.value;
};

const { invoiceData } = storeToRefs(useStore());

const filteredInvoice = ref("");

const filteredInvoices = (e) => {
  if (e.target.innerText === "Todas") {
    filteredInvoice.value = null;
    return;
  }

  filteredInvoice.value = e.target.innerText;
};

const filteredData = computed(() => {
  return invoiceData.value.filter((invoice) => {
    if (filteredInvoice.value === "Borrador") {
      return invoice.invoiceDraft === true;
    }
    if (filteredInvoice.value === "Pendiente") {
      return invoice.invoicePending === true;
    }
    if (filteredInvoice.value === "Pagada") {
      return invoice.invoicePaid === true;
    }

    return invoice;
  });
});

getInvoices();
</script>

<template>
  <div class="home custom-container">
    <!-- Header -->
    <div>
      <div class="header flex">
        <div class="left flex flex-column">
          <h1 class="lg:text-3xl text-2xl text-primary">Cotizaciones</h1>
          <span class="text-sm"
            >Tienes (<span class="text-primary">{{ invoiceData.length }}</span
            >) cotizaciones en total</span
          >
        </div>
        <div
          class="right flex flex-col-reverse lg:flex-row gap-4 items-end lg:items-center"
        >
          <div @click="toggleFilterMenu" class="filter flex gap-2">
            <span
              >Filtrar etapa
              <span class="text-secondary" v-if="filteredInvoice"
                >: {{ filteredInvoice }}</span
              ></span
            >
            <i class="fa-solid fa-chevron-down text-primary"></i>
            <ul v-show="filterMenu" class="filter-menu lg:mr-10">
              <li @click="filteredInvoices">Borrador</li>
              <li @click="filteredInvoices">Pendiente</li>
              <li @click="filteredInvoices">Pagada</li>
              <li @click="filteredInvoices">Todas</li>
            </ul>
          </div>
          <div
            @click="newInvoice"
            class="btn bg-primary border-none flex gap-2 hover:bg-secondary"
          >
            <div class="inner-button flex">
              <i class="fa-solid fa-plus"></i>
              <!-- <img src="@/assets/images/icon-plus.svg" alt="" /> -->
            </div>
            <span>Cotizacion</span>
          </div>
        </div>
      </div>
      <!-- Invoices -->

      <div v-if="invoiceData.length > 0" v-auto-animate>
        <MyInvoice
          v-for="(invoice, index) in filteredData"
          :invoice="invoice"
          :key="index"
        />
      </div>

      <div v-else class="empty flex flex-column">
        <img src="@/assets/images/illustration-empty.svg" alt="" />
        <h3>No hay cotizaciones</h3>
        <p>
          Crea una nueva cotizacion haciendo click en el boton Nueva Cotizacion
        </p>
      </div>
    </div>
    <!-- <div v-else>
      <LoginForm />
    </div> -->
  </div>
</template>

<style lang="scss" scoped>
.home {
  color: #1a1a1a;

  .header {
    margin-bottom: 65px;

    .left,
    .right {
      flex: 1;
    }

    .right {
      justify-content: flex-end;
      // align-items: center;

      .button,
      .filter {
        align-items: center;

        span {
          font-size: 11px;
        }
      }

      .filter {
        position: relative;
        // margin-right: 40px;
        cursor: pointer;

        img {
          margin-left: 12px;
          width: 9px;
          height: 5px;
        }

        .filter-menu {
          width: 120px;
          position: absolute;
          top: 25px;
          list-style: none;
          background-color: #fff;
          border-radius: 10px;
          // background-color: #1e2139;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
            0 2px 4px -1px rgba(0, 0, 0, 0.06);

          li {
            cursor: pointer;
            font-size: 12px;
            padding: 10px 20px;

            &:hover {
              color: #1e2139;
              background-color: #dfa48c;
              border-radius: 10px;
            }
          }
        }
      }

      .button {
        padding: 8px 10px;
        background-color: #e90f02;
        border-radius: 40px;

        .inner-button {
          margin-right: 8px;
          border-radius: 50%;
          padding: 8px;
          align-items: center;
          justify-content: center;
          background-color: #fff;
          img {
            width: 10px;
            height: 10px;
          }
        }
      }
    }
  }

  .empty {
    margin-top: 160px;
    align-items: center;

    img {
      width: 214px;
      height: 200px;
    }

    h3 {
      font-size: 20px;
      margin-top: 40px;
    }

    p {
      text-align: center;
      max-width: 224px;
      font-size: 12px;
      font-weight: 300;
      margin-top: 16px;
    }
  }
}
</style>
