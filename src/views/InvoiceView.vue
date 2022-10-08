<script setup>
import { useStore } from "@/stores/main";
import { storeToRefs } from "pinia";
import { useRoute } from "vue-router";
// import { useRoute, useRouter } from "vue-router";
import emailjs from "@emailjs/browser";

// const router = useRouter();
const { params } = useRoute();

const { currentInvoice, user } = storeToRefs(useStore());
const {
  setCurrentInvoice,
  editCurrentInvoice,
  toggleInvoice,
  updateStatusToPaid,
  updateStatusToPending,
} = useStore();

const toggleEditInvoice = () => {
  editCurrentInvoice();
  toggleInvoice();
};

const deleteInvoice = () => {
  useStore().$patch({
    customModal: true,
    modalType: "delete",
  });
};

setCurrentInvoice(params.invoiceId);

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
      customModal: true,
      modalType: "email",
    });
    if (currentInvoice.value.invoiceDraft) {
      updateStatusToPending(currentInvoice.value.docId);
    }
  }, 1000);
};

const generatePDF = () => {
  window.print();
};
</script>

<template>
  <main
    class="relative mx-auto min-h-screen w-full max-w-screen-xl bg-[#F2F2F2] px-4 pt-2 pb-6 print:px-10 lg:px-10"
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
      <div v-if="user" class="header flex flex-col gap-4 shadow-lg lg:flex-row">
        <div class="left flex flex-col gap-2 lg:flex-row">
          <span>Etapa</span>
          <div
            class="status-button flex gap-2 py-2 px-4 lg:mr-2 lg:px-8"
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
        <div class="right flex items-center justify-center gap-3">
          <button
            @click="toggleEditInvoice"
            class="flex h-14 w-14 flex-col items-center justify-center gap-2 rounded-[10px] border-none bg-[#f2f2f2] px-2 py-8 text-[9px] text-[#1a1a1a] transition-all hover:-translate-y-[1px] hover:shadow-lg lg:text-[10px]"
          >
            <i class="fa-regular fa-pen-to-square text-base"></i>
            Editar
          </button>
          <button
            @click="deleteInvoice()"
            class="flex h-14 w-14 flex-col items-center justify-center gap-2 rounded-[10px] border-none bg-[#f2f2f2] px-2 py-8 text-[9px] text-[#1a1a1a] transition-all hover:-translate-y-[1px] hover:shadow-lg lg:text-[10px]"
          >
            <i class="fa-solid fa-trash-can text-base text-primary"></i>
            Eliminar
          </button>
          <button
            @click="updateStatusToPaid(currentInvoice.docId)"
            v-if="currentInvoice.invoicePending"
            class="flex h-14 w-14 flex-col items-center justify-center gap-0 rounded-[10px] border-none bg-[#f2f2f2] px-2 py-8 text-[9px] text-[#1a1a1a] transition-all hover:-translate-y-[1px] hover:shadow-lg lg:text-[10px]"
          >
            <i class="fa-regular fa-circle-check text-base text-green-500"></i>
            Marcar Pagada
          </button>
          <button
            v-if="currentInvoice.invoiceDraft || currentInvoice.invoicePaid"
            @click="updateStatusToPending(currentInvoice.docId)"
            class="flex h-14 w-14 flex-col items-center justify-center gap-0 rounded-[10px] border-none bg-[#f2f2f2] px-2 py-8 text-[9px] text-[#1a1a1a] transition-all hover:-translate-y-[1px] hover:shadow-lg lg:text-[10px]"
          >
            <i
              class="fa-solid fa-circle-exclamation text-base text-secondary"
            ></i>
            Marcar Pendiente
          </button>
          <button
            @click="generatePDF"
            class="flex h-14 w-14 flex-col items-center justify-center gap-0 rounded-[10px] border-none bg-[#f2f2f2] px-2 py-8 text-[9px] text-[#1a1a1a] transition-all hover:-translate-y-[1px] hover:shadow-lg lg:text-[10px]"
          >
            <i class="fa-solid fa-file-pdf text-base"></i>
            Crear PDF
          </button>
          <button
            @click="sendEmail"
            class="flex h-14 w-14 flex-col items-center justify-center gap-2 rounded-[10px] border-none bg-[#f2f2f2] px-2 py-8 text-[9px] text-[#1a1a1a] transition-all hover:-translate-y-[1px] hover:shadow-lg lg:text-[10px]"
          >
            <i class="fa-regular fa-paper-plane text-base text-blue-500"></i>
            Enviar
          </button>
        </div>
      </div>
    </div>

    <!-- Cover -->

    <div
      class="print:hidden lg:print:h-screen lg:print:w-screen"
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
          class="mb-4 rounded-[20px]"
        />
      </picture>
    </div>

    <figure
      class="hidden print:mb-36 print:flex print:h-full print:items-center"
    >
      <img src="@/assets/images/coverdemo.png" alt="" />
    </figure>

    <!-- Invoice body -->
    <div id="pdf-content" class="w-full">
      <section class="rounded-[20px] bg-white pt-4 shadow-lg">
        <section class="relative flex h-full justify-between px-4 lg:px-8">
          <div class="mb-4 h-fit">
            <img class="mb-2 h-28" src="@/assets/logo.png" />
            <span class="text-xs font-bold text-primary"
              >GCO SOLUCIONES <span class="text-secondary">INDUSTRIALES</span>
            </span>
            <p class="w-[50ch] text-[8px] lg:w-[70ch]">
              SISTEMAS DE CONTROL ELÉCTRICO, ELECTRÓNICO, NEUMÁTICO,
              AUTOMATIZACIÓN, FILTRACIÓN, CONTROL DE FLAMA, PRESIÓN,
              TEMPERATURA, BOMBEO, TRATAMIENTO DE AGUA Y ALMACENAMIENTO
            </p>
          </div>
          <h1
            class="absolute inset-0 top-2 hidden text-center text-xl font-bold uppercase italic text-primary lg:block"
          >
            Cotización
          </h1>
          <div class="flex flex-col items-end">
            <!-- <h3 class="text-primary">Cotización</h3> -->
            <p class="font-bold">#{{ currentInvoice.invoiceId }}</p>

            <h3 class="text-[9px] text-primary lg:text-base">Fecha</h3>
            <p class="text-xs">{{ currentInvoice.invoiceDate }}</p>

            <h3 class="text-[9px] text-primary lg:text-base">Vigencia</h3>
            <p class="text-xs">{{ currentInvoice.paymentDueDate }}</p>
          </div>
        </section>

        <!-- Customer information section -->
        <section class="rounded-[20px] pb-4">
          <h2 class="mx-auto mb-4 w-fit border-b-2 border-primary">
            Información del cliente
          </h2>

          <ul class="grid grid-cols-4 px-4 text-[9px] lg:px-8">
            <li class="text-center">
              <h3
                class="border-b border-black text-[9px] text-primary lg:text-base"
              >
                Nombre
              </h3>
              <p class="text-[8px] print:text-[8px] lg:text-xs">
                {{ currentInvoice.clientName }}
              </p>
            </li>
            <li class="text-center">
              <h3
                class="border-b border-black text-[9px] text-primary lg:text-base"
              >
                Empresa
              </h3>
              <p class="text-[8px] print:text-[8px] lg:text-xs">
                {{ currentInvoice.clientCompany }}
              </p>
            </li>
            <li class="text-center">
              <h3
                class="border-b border-black text-[9px] text-primary lg:text-base"
              >
                Moneda
              </h3>
              <p class="text-[8px] print:text-[8px] lg:text-xs">
                {{ currentInvoice.currencyType }}
              </p>
            </li>
            <li class="text-center">
              <h3
                class="border-b border-black text-[9px] text-primary lg:text-base"
              >
                Tipo de cambio
              </h3>
              <p class="text-[8px] print:text-[8px] lg:text-xs">
                {{ currentInvoice.exchangeCost }}
              </p>
            </li>
          </ul>
        </section>
      </section>

      <!-- Items table -->
      <section
        class="mt-4 min-h-[250px] overflow-x-auto rounded-[20px] bg-white shadow-lg"
      >
        <table class="relative table w-full px-8">
          <!-- head -->
          <thead>
            <tr class="text-xs">
              <th class="bg-white py-2 pl-8 text-xs text-primary">ID</th>
              <th class="bg-white px-4 py-2 text-xs text-primary">
                Descripción
              </th>
              <th class="bg-white px-4 py-2 text-center text-xs text-primary">
                Cantidad
              </th>
              <th class="bg-white px-4 py-2 text-center text-xs text-primary">
                No. parte
              </th>
              <th class="bg-white px-4 py-2 text-center text-xs text-primary">
                Precio unitario
              </th>
              <th
                class="bg-white py-2 pl-4 pr-8 text-center text-xs text-primary"
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
              <th class="py-2 pl-8 pr-0">{{ item.id }}</th>
              <td class="block px-4 py-2 text-[9px]">
                {{ item.itemName }}
              </td>
              <td class="px-0 py-2 text-center">{{ item.qty }}</td>
              <td class="px-0 py-2 text-center">{{ item.partNo }}</td>
              <td class="px-0 py-2 text-center">
                ${{ parseFloat(item.price).toFixed(2) }}
              </td>
              <td class="py-2 pl-0 pr-4 text-center">
                ${{ parseFloat(item.total).toFixed(2) }}
              </td>
            </tr>

            <tr>
              <th></th>
              <td class="px-0 py-2 text-left text-xs font-bold text-primary">
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
        class="flex w-full flex-col-reverse gap-4 pt-4 print:flex-row lg:flex-row"
      >
        <section
          class="flex w-full flex-col gap-4 rounded-[20px] bg-white px-6 py-4 shadow-lg print:w-3/5 print:basis-4/5 print:flex-row print:pr-0 lg:w-4/5 lg:flex-row"
        >
          <div class="w-1/2 print:w-3/5">
            <h3 class="mb-2 w-fit border-b-2 border-primary text-[#1a1a1a]">
              Condiciones del servicio
            </h3>
            <p class="w-[50ch] text-[8px] italic print:w-full lg:w-[80ch]">
              AGRADECIENDO SU AMABLE PREFERENCIA NOS ES GRATO SOMETER A SU
              CONSIDERACION NUESTRA COTIZACION DE ACUERDO A SU REQUERIMIENTO,
              ESPERANDO SEA SATISFACTORIA A SUS NECESIDADES, LOS PRECIOS
              MENCIONADOS ESTAN SUJETOS A ALTERACIONES. POR LO ANTERIOR,
              QUEDAMOS A SUS ORDENES PARA CUALQUIER DUDA O ACLARACION AL
              RESPECTO.
            </p>
          </div>
          <div class="w-1/2">
            <h3 class="mb-2 w-fit border-b-2 border-primary text-[#1a1a1a]">
              Notas:
            </h3>
            <p class="w-[50ch] text-[10px] uppercase italic lg:w-[70ch]">
              {{ currentInvoice.notes }}
            </p>
          </div>
        </section>
        <section
          class="flex w-full basis-[20%] flex-col justify-center rounded-[20px] bg-white px-6 py-4 shadow-lg print:basis-1/5 print:px-4 lg:w-1/5"
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
          <div class="divide divider my-0 w-full"></div>
          <div class="flex w-full justify-between font-bold">
            <p class="text-primary">Total</p>
            <p>${{ parseFloat(currentInvoice.invoiceTotal).toFixed(2) }}</p>
          </div>
        </section>
      </section>
    </div>
    <div class="flex justify-center print:hidden" v-if="!user">
      <button
        @click="generatePDF"
        class="mt-8 flex h-14 w-14 flex-row items-center justify-center gap-2 rounded-[10px] border-none bg-primary px-10 py-6 text-xs text-white transition-all hover:-translate-y-[1px] hover:shadow-lg"
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
