<script setup>
import { useStore } from "@/stores/main";
import { storeToRefs } from "pinia";
import { useRoute, useRouter } from "vue-router";

import emailjs from "@emailjs/browser";

const router = useRouter();
// const route = useRoute();

const { currentInvoice, user } = storeToRefs(useStore());
const {
  setCurrentInvoice,
  editCurrentInvoice,
  toggleInvoice,
  deleteCurrentInvoice,
  updateStatusToPaid,
  updateStatusToPending,
} = useStore();

const toggleEditInvoice = () => {
  editCurrentInvoice();
  toggleInvoice();
};

const deleteInvoice = (id) => {
  deleteCurrentInvoice(id);
  router.push("/");
};

setCurrentInvoice(useRoute().params.invoiceId);

const sendEmail = () => {
  emailjs
    .send(
      "gco",
      "template_gw5kvf9",
      {
        customer_name: currentInvoice.value.clientName.split(" ")[0],
        customer_email: currentInvoice.value.clientEmail,
        message: location.toString(),
      },
      "QyWKNAO42Ukv7v_0T"
    )
    .then(
      (result) => {
        console.log("SUCCESS!", result.text);
      },
      (error) => {
        console.log("FAILED...", error.text);
      }
    );
  setTimeout(() => {
    useStore().$patch({
      emailModal: true,
    });
  }, 1000);
};

const generatePDF = () => {
  window.print();
};

// console.log(location.toString());
</script>

<template>
  <main
    class="min-h-screen max-w-screen-xl print:px-10 pt-2 pb-6 px-4 lg:px-10 mx-auto bg-[#F2F2F2] w-full relative"
  >
    <div
      v-if="currentInvoice"
      class="invoice-view my-container mb-4 print:hidden"
    >
      <router-link
        v-if="user"
        class="nav-link flex gap-2"
        :to="{ name: 'home' }"
      >
        <i class="fa-solid fa-chevron-left text-primary"></i> Regresar
      </router-link>
      <!-- Header -->
      <div v-if="user" class="header flex flex-col lg:flex-row shadow-lg gap-4">
        <div class="left flex flex-col lg:flex-row gap-2">
          <span>Etapa</span>
          <div
            class="status-button py-2 px-4 lg:mr-2 lg:px-8 flex gap-2"
            :class="{
              paid: currentInvoice.invoicePaid,
              draft: currentInvoice.invoiceDraft,
              pending: currentInvoice.invoicePending,
            }"
          >
            <span v-if="currentInvoice.invoicePaid">Pagada</span>
            <span v-if="currentInvoice.invoiceDraft">Borrador</span>
            <span v-if="currentInvoice.invoicePending">Pendiente</span>
          </div>
        </div>

        <!-- Status bar -->
        <div class="right flex justify-center gap-4 items-center">
          <button
            @click="toggleEditInvoice"
            class="bg-[#f2f2f2] px-2 py-8 text-[#1a1a1a] border-none hover:shadow-lg transition-all lg:text-[10px] hover:-translate-y-[1px] flex flex-col items-center gap-2 text-[9px] justify-center h-14 rounded-[10px] w-14"
          >
            <i class="fa-regular fa-pen-to-square text-base"></i>
            Editar
          </button>
          <button
            @click="deleteInvoice(currentInvoice.docId)"
            class="bg-[#f2f2f2] px-2 py-8 text-[#1a1a1a] border-none hover:shadow-lg transition-all lg:text-[10px] hover:-translate-y-[1px] flex flex-col items-center gap-2 text-[9px] justify-center h-14 rounded-[10px] w-14"
          >
            <i class="fa-solid fa-trash-can text-primary text-base"></i>
            Eliminar
          </button>
          <button
            @click="updateStatusToPaid(currentInvoice.docId)"
            v-if="currentInvoice.invoicePending"
            class="bg-[#f2f2f2] px-2 py-8 text-[#1a1a1a] border-none hover:shadow-lg transition-all lg:text-[10px] hover:-translate-y-[1px] flex flex-col items-center gap-0 text-[9px] justify-center h-14 rounded-[10px] w-14"
          >
            <i class="fa-regular fa-circle-check text-green-500 text-base"></i>
            Marcar Pagada
          </button>
          <button
            v-if="currentInvoice.invoiceDraft || currentInvoice.invoicePaid"
            @click="updateStatusToPending(currentInvoice.docId)"
            class="bg-[#f2f2f2] px-2 py-8 text-[#1a1a1a] border-none hover:shadow-lg transition-all lg:text-[10px] hover:-translate-y-[1px] flex flex-col items-center gap-2 text-[9px] justify-center h-14 rounded-[10px] w-14"
          >
            <i
              class="fa-solid fa-circle-exclamation text-secondary text-base"
            ></i>
            Marcar Pendiente
          </button>
          <button
            @click="generatePDF"
            class="bg-[#f2f2f2] px-2 py-8 text-[#1a1a1a] border-none hover:shadow-lg transition-all lg:text-[10px] hover:-translate-y-[1px] flex flex-col items-center gap-0 text-[9px] justify-center h-14 rounded-[10px] w-14"
          >
            <i class="fa-solid fa-file-pdf text-base"></i>
            Crear PDF
          </button>
          <button
            @click="sendEmail"
            class="bg-[#f2f2f2] px-2 py-8 text-[#1a1a1a] border-none hover:shadow-lg transition-all lg:text-[10px] hover:-translate-y-[1px] flex flex-col items-center gap-2 text-[9px] justify-center h-14 rounded-[10px] w-14"
          >
            <i class="fa-regular fa-paper-plane text-blue-500 text-base"></i>
            Enviar
          </button>
        </div>
      </div>
    </div>

    <!-- Cover -->

    <div
      class="lg:print:h-screen lg:print:w-screen print:hidden"
      :class="{ hidden: user }"
    >
      <picture>
        <source
          media="(max-width: 767px)"
          srcset="@/assets/images/coverdemomobile.png"
        />
        <img
          src="@/assets/images/coverdemo.png"
          srcset="@/assets/images/coverdemo.png"
          alt=""
          class="rounded-[20px] mb-4"
        />
      </picture>
    </div>

    <figure
      class="hidden print:flex print:mb-36 print:h-full print:items-center"
    >
      <img src="@/assets/images/coverdemo.png" alt="" />
    </figure>

    <!-- Invoice body -->
    <div id="pdf-content" class="w-full">
      <section class="rounded-[20px] bg-white pt-4 shadow-lg">
        <section class="h-full flex justify-between px-4 lg:px-8 relative">
          <div class="h-fit mb-4">
            <img class="mb-2 h-28" src="@/assets/logo.png" />
            <span class="text-primary text-xs font-bold"
              >GCO SOLUCIONES <span class="text-secondary">INDUSTRIALES</span>
            </span>
            <p class="text-[8px] w-[50ch] lg:w-[70ch]">
              SISTEMAS DE CONTROL ELÉCTRICO, ELECTRÓNICO, NEUMÁTICO,
              AUTOMATIZACIÓN, FILTRACIÓN, CONTROL DE FLAMA, PRESIÓN,
              TEMPERATURA, BOMBEO, TRATAMIENTO DE AGUA Y ALMACENAMIENTO
            </p>
          </div>
          <h1
            class="absolute hidden lg:block inset-0 top-2 text-primary text-xl font-bold italic uppercase text-center"
          >
            Cotización
          </h1>
          <div class="flex flex-col items-end">
            <!-- <h3 class="text-primary">Cotización</h3> -->
            <p class="font-bold">#{{ currentInvoice.invoiceId }}</p>

            <h3 class="text-primary text-[9px] lg:text-base">Fecha</h3>
            <p class="text-xs">{{ currentInvoice.invoiceDate }}</p>

            <h3 class="text-primary text-[9px] lg:text-base">Vigencia</h3>
            <p class="text-xs">{{ currentInvoice.paymentDueDate }}</p>
          </div>
        </section>

        <!-- Customer information section -->
        <section class="pb-4 rounded-[20px]">
          <h2 class="w-fit mx-auto border-b-2 border-primary mb-4">
            Información del cliente
          </h2>

          <ul class="grid grid-cols-4 px-4 lg:px-8 text-[9px]">
            <li class="text-center">
              <h3
                class="border-b border-black text-primary text-[9px] lg:text-base"
              >
                Nombre
              </h3>
              <p class="text-[8px] lg:text-xs print:text-[8px]">
                {{ currentInvoice.clientName }}
              </p>
            </li>
            <li class="text-center">
              <h3
                class="border-b border-black text-primary text-[9px] lg:text-base"
              >
                Empresa
              </h3>
              <p class="text-[8px] lg:text-xs print:text-[8px]">
                {{ currentInvoice.clientCompany }}
              </p>
            </li>
            <li class="text-center">
              <h3
                class="border-b border-black text-primary text-[9px] lg:text-base"
              >
                Moneda
              </h3>
              <p class="text-[8px] lg:text-xs print:text-[8px]">
                {{ currentInvoice.currencyType }}
              </p>
            </li>
            <li class="text-center">
              <h3
                class="border-b border-black text-primary text-[9px] lg:text-base"
              >
                Tipo de cambio
              </h3>
              <p class="text-[8px] lg:text-xs print:text-[8px]">
                {{ currentInvoice.exchangeCost }}
              </p>
            </li>
          </ul>
        </section>
      </section>

      <!-- Items table -->
      <section
        class="overflow-x-auto min-h-[250px] shadow-lg bg-white rounded-[20px] mt-4"
      >
        <table class="table w-full px-8 relative">
          <!-- head -->
          <thead>
            <tr class="text-xs">
              <th class="bg-white pl-8 py-2 text-primary text-xs">ID</th>
              <th class="bg-white px-4 py-2 text-primary text-xs">
                Descripción
              </th>
              <th class="bg-white px-4 py-2 text-center text-primary text-xs">
                Cantidad
              </th>
              <th class="bg-white px-4 py-2 text-center text-primary text-xs">
                No. parte
              </th>
              <th class="bg-white px-4 py-2 text-center text-primary text-xs">
                Precio unitario
              </th>
              <th
                class="bg-white pl-4 pr-8 py-2 text-center text-primary text-xs"
              >
                Importe
              </th>
            </tr>
          </thead>
          <tbody>
            <!-- rows -->
            <tr
              v-for="(item, index) in currentInvoice.invoiceItemList"
              :key="index"
            >
              <th class="pl-8 py-2 pr-0">{{ item.id }}</th>
              <td class="px-4 py-2 text-[9px] block">
                {{ item.itemName }}
              </td>
              <td class="px-0 py-2 text-center">{{ item.qty }}</td>
              <td class="px-0 py-2 text-center">{{ item.partNo }}</td>
              <td class="px-0 py-2 text-center">
                ${{ parseFloat(item.price).toFixed(2) }}
              </td>
              <td class="pl-0 pr-4 py-2 text-center">
                ${{ parseFloat(item.total).toFixed(2) }}
              </td>
            </tr>

            <tr>
              <th></th>
              <td class="px-0 py-2 text-left text-xs text-primary font-bold">
                Tiempo de entrega
              </td>
              <td class="px-8 py-2 text-center text-xs italic">
                {{ currentInvoice.eta }}
              </td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </section>

      <!-- Terms and total sections -->
      <section
        class="pt-4 flex gap-4 flex-col-reverse print:flex-row lg:flex-row w-full"
      >
        <section
          class="rounded-[20px] flex gap-4 bg-white px-6 py-4 lg:w-4/5 shadow-lg flex-col lg:flex-row print:flex-row w-full"
        >
          <div>
            <h3 class="text-[#1a1a1a] border-b-2 border-primary w-fit mb-2">
              Condiciones del servicio
            </h3>
            <p class="italic text-[8px] w-[50ch] lg:w-[100ch]">
              AGRADECIENDO SU AMABLE PREFERENCIA NOS ES GRATO SOMETER A SU
              CONSIDERACION NUESTRA COTIZACION DE ACUERDO A SU REQUERIMIENTO,
              ESPERANDO SEA SATISFACTORIA A SUS NECESIDADES, LOS PRECIOS
              MENCIONADOS ESTAN SUJETOS A ALTERACIONES. POR LO ANTERIOR,
              QUEDAMOS A SUS ORDENES PARA CUALQUIER DUDA O ACLARACION AL
              RESPECTO.
            </p>
          </div>
          <div>
            <h3 class="text-[#1a1a1a] border-b-2 border-primary w-fit mb-2">
              Notas:
            </h3>
            <p class="italic text-[8px] w-[70ch] print:w-[40-ch] uppercase">
              {{ currentInvoice.notes }}
            </p>
          </div>
        </section>
        <section
          class="rounded-[20px] w-full bg-white px-6 py-4 lg:w-1/5 flex flex-col justify-center shadow-lg"
        >
          <div class="flex items-center justify-between">
            <div class="flex flex-col gap-2">
              <p class="text-xs text-primary">Subtotal</p>
              <p class="text-xs text-primary">IVA 16%</p>
            </div>
            <div class="flex flex-col items-end gap-2 text-xs">
              <p>
                ${{ parseFloat(currentInvoice.invoiceSubtotal).toFixed(2) }}
              </p>
              <p>${{ parseFloat(currentInvoice.invoiceTax).toFixed(2) }}</p>
            </div>
          </div>
          <div class="divider divide w-full my-0"></div>
          <div class="w-full flex justify-between font-bold">
            <p class="text-primary">Total</p>
            <p>${{ parseFloat(currentInvoice.invoiceTotal).toFixed(2) }}</p>
          </div>
        </section>
      </section>
    </div>
    <div class="flex justify-center print:hidden" v-if="!user">
      <button
        @click="generatePDF"
        class="bg-primary px-10 py-6 text-white flex-row border-none hover:shadow-lg transition-all text-xs hover:-translate-y-[1px] flex items-center gap-2 justify-center h-14 rounded-[10px] w-14 mt-8"
      >
        <i class="fa-solid fa-file-pdf text-lg"></i>
        Crear PDF
      </button>
    </div>
  </main>
</template>

<style lang="scss" scoped>
.invoice-view {
  .nav-link {
    margin-top: 16px;
    margin-bottom: 32px;
    align-items: center;
    color: #1a1a1a;
    font-size: 12px;
    img {
      margin-right: 16px;
      width: 7px;
      height: 10px;
    }
  }

  .header,
  .invoice-details {
    background-color: #fff;
    border-radius: 20px;
  }

  .header {
    align-items: center;
    padding: 24px 32px;
    font-size: 12px;

    .left {
      align-items: center;

      span {
        color: #1a1a1a;
        // color: #dfe3fa;
        margin-right: 16px;
      }
    }

    .right {
      flex: 1;
      justify-content: flex-end;

      // button {
      //   color: #fff;
      // }
    }
  }

  .invoice-details {
    padding: 48px;
    margin-top: 24px;

    .top {
      div {
        color: #dfe3fa;
        flex: 1;
      }

      .left {
        font-size: 12px;
        p:first-child {
          font-size: 24px;
          text-transform: uppercase;
          color: #fff;
          margin-bottom: 8px;
        }

        p:nth-child(2) {
          font-size: 16px;
        }

        span {
          color: #888eb0;
        }
      }

      .right {
        font-size: 12px;
        align-items: flex-end;
      }
    }

    .middle {
      margin-top: 50px;
      color: #dfe3fa;
      gap: 16px;

      h4 {
        font-size: 12px;
        font-weight: 400;
        margin-bottom: 12px;
      }

      p {
        font-size: 16px;
      }

      .bill,
      .payment {
        flex: 1;
      }

      .payment {
        h4:nth-child(3) {
          margin-top: 32px;
        }

        p {
          font-weight: 600;
        }
      }

      .bill {
        p:nth-child(2) {
          font-size: 16px;
        }
        p:nth-child(3) {
          margin-top: auto;
        }

        p {
          font-size: 12px;
        }
      }

      .send-to {
        flex: 2;
      }
    }

    .bottom {
      margin-top: 50px;

      .billing-items {
        padding: 32px;
        border-radius: 20px 20px 0 0;
        background-color: #252945;

        .heading {
          color: #dfe3fa;
          // font-size: 12px;
          margin-bottom: 32px;

          p:first-child {
            flex: 3;
            text-align: left;
          }

          p {
            flex: 1;
            text-align: right;
          }
        }

        .item {
          margin-bottom: 32px;
          font-size: 13px;
          color: #fff;

          &:last-child {
            margin-bottom: 0;
          }

          p:first-child {
            flex: 3;
            text-align: left;
          }

          p {
            flex: 1;
            text-align: right;
          }
        }
      }

      .total {
        color: #fff;
        padding: 32px;
        background-color: rgba(12, 14, 22, 0.7);
        align-items: center;
        border-radius: 0 0 20px 20px;

        p {
          flex: 1;
          font-size: 12px;
        }

        p:nth-child(2) {
          font-size: 28px;
          text-align: right;
        }
      }
    }
  }
}
</style>
