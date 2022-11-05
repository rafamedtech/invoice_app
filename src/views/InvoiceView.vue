<script setup>
// Imports
import { useStore } from "@/stores/main";
import { storeToRefs } from "pinia";
import { useRoute } from "vue-router";
import emailjs from "@emailjs/browser";

// Definitions
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
        customer_name2: currentInvoice.value.clientName2
          ? currentInvoice.value.clientName2.split(" ")[0]
          : "",
        customer_email: currentInvoice.value.clientEmail,
        customer_email2: currentInvoice.value.clientEmail2,
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
  useStore().$patch({
    customModal: true,
    modalType: "print",
  });
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
            <span
              class="flex items-center gap-2"
              v-if="currentInvoice.invoicePaid"
              ><i
                class="fa-regular fa-circle-check text-base text-green-500"
              ></i>
              Vendido</span
            >
            <span v-if="currentInvoice.invoiceDraft">Borrador</span>
            <span
              class="flex items-center gap-2"
              v-if="currentInvoice.invoicePending"
            >
              <i
                class="fa-solid fa-circle-exclamation text-base text-secondary"
              ></i>
              Pendiente</span
            >
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
            Marcar Vendido
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
      class="relative mb-8 h-fit rounded-[20px] bg-white py-4 shadow-lg print:hidden lg:print:h-screen lg:print:w-screen"
      :class="{ hidden: user }"
    >
      <h2
        class="absolute inset-0 top-8 mb-4 block text-center text-xl font-bold uppercase italic text-primary print:block"
      >
        Nuestras marcas
      </h2>
      <picture>
        <source
          media="(max-width: 767px)"
          srcset="@/assets/images/covermvppt.png"
        />
        <img
          src="@/assets/images/covermvp.png"
          srcset="@/assets/images/covermvp.png"
          alt=""
          class="rounded-[20px]"
        />
      </picture>
      <div
        class="absolute inset-x-4 bottom-4 flex items-center justify-between text-[8px] lg:text-xs"
      >
        <div>
          <p>cotizaciones@gcosoluciones.com</p>
        </div>
        <div>
          <p>Lic. Orlando Toledo Virgen</p>
          <p>orlando@gcosoluciones.com</p>
          <p>celular: (622) 118 6556</p>
        </div>
      </div>
    </div>
    <div
      class="relative mb-8 hidden h-fit rounded-[20px] bg-white py-4 shadow-lg print:flex print:h-[700px] print:items-center lg:print:h-screen lg:print:w-screen"
    >
      <h2
        class="absolute inset-0 top-8 mb-4 block text-center text-xl font-bold uppercase italic text-primary print:block"
      >
        Nuestras marcas
      </h2>
      <figure class="h-full">
        <img class="h-auto w-full" src="@/assets/images/covermvp.png" alt="" />
      </figure>
      <div
        class="absolute inset-x-4 bottom-4 flex items-center justify-between text-[8px] lg:text-xs"
      >
        <div>
          <p>cotizaciones@gcosoluciones.com</p>
        </div>
        <div>
          <p>Lic. Orlando Toledo Virgen</p>
          <p>orlando@gcosoluciones.com</p>
          <p>celular: (622) 118 6556</p>
        </div>
      </div>
    </div>

    <!-- <figure
      class="relative hidden print:flex print:h-[100vh] print:items-center"
    >
      <h2
        class="absolute inset-0 top-8 mb-4 block text-center text-xl font-bold uppercase italic text-primary print:block"
      >
        Nuestras marcas
      </h2>
      <img class="h-auto w-full" src="@/assets/images/covermvp.png" alt="" />
      <div
        class="absolute inset-x-4 bottom-4 flex items-center justify-between text-[8px] lg:text-xs"
      >
        <div>
          <p>cotizaciones@gcosoluciones.com</p>
        </div>
        <div>
          <p>Lic. Orlando Toledo Virgen</p>
          <p>orlando@gcosoluciones.com</p>
          <p>celular: (622) 118 6556</p>
        </div>
      </div>
    </figure> -->

    <!-- Invoice body -->
    <div id="pdf-content" class="w-full">
      <section class="rounded-[20px] bg-white pt-4 shadow-lg">
        <section class="relative flex h-full justify-between px-4 lg:px-8">
          <div class="mb-4 h-fit">
            <img class="mb-2 h-28" src="@/assets/logo.png" />
            <span class="block text-xs font-bold text-primary"
              >GCO SOLUCIONES <span class="text-secondary">INDUSTRIALES</span>
            </span>
            <a class="text-[10px]" href="https://www.gcosoluciones.com"
              >www.gcosoluciones.com</a
            >
            <p class="w-[40ch] text-[6px] lg:w-[70ch]">
              SISTEMAS DE CONTROL ELÉCTRICO, ELECTRÓNICO, NEUMÁTICO,
              AUTOMATIZACIÓN, FILTRACIÓN, CONTROL DE FLAMA, PRESIÓN,
              TEMPERATURA, BOMBEO, TRATAMIENTO DE AGUA Y ALMACENAMIENTO
            </p>
          </div>
          <h1
            class="absolute inset-0 top-2 hidden h-fit text-center text-xl font-bold uppercase italic text-primary lg:block"
          >
            Cotización
          </h1>
          <div class="flex flex-col items-end">
            <p class="font-bold uppercase">#{{ currentInvoice.invId }}</p>

            <h3 class="text-[9px] text-primary lg:text-base">Fecha</h3>
            <p class="text-[10px]">{{ currentInvoice.invoiceDate }}</p>

            <h3 class="text-[9px] text-primary lg:text-base">Vigencia</h3>
            <p class="text-[10px]">{{ currentInvoice.paymentDueDate }}</p>
          </div>
        </section>

        <!-- Customer information section -->
        <section class="rounded-[20px] pb-4">
          <h2 class="mx-auto mb-4 w-fit border-b-2 border-primary">
            Información del cliente
          </h2>

          <ul class="grid grid-cols-3 px-4 text-[9px] lg:grid-cols-5 lg:px-8">
            <li class="text-center">
              <h3
                class="border-b border-black text-[9px] text-primary lg:text-base"
              >
                Nombre
              </h3>
              <p class="text-[8px] print:text-[8px] lg:text-xs">
                {{ currentInvoice.clientName }}
              </p>
              <p class="text-[8px] print:text-[8px] lg:text-xs">
                {{ currentInvoice.clientName2 }}
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
                {{ currentInvoice.exchangeCost ? "$" : ""
                }}{{ currentInvoice.exchangeCost }}
              </p>
            </li>
            <li class="text-center">
              <h3
                class="border-b border-black text-[9px] text-primary lg:text-base"
              >
                Forma de pago
              </h3>
              <p class="text-[8px] print:text-[8px] lg:text-xs">
                {{ currentInvoice.paymentType }}
              </p>
            </li>
          </ul>
        </section>
      </section>

      <!-- Items table -->
      <section
        class="relative mt-4 max-h-[240px] min-h-[240px] overflow-x-auto rounded-[20px] bg-white shadow-lg"
      >
        <div
          class="flex w-[150vw] justify-between gap-2 px-4 text-[10px] print:w-full lg:w-full lg:justify-between lg:gap-2 lg:px-8"
        >
          <!-- <h5 class="w-6 py-2 font-bold text-primary">ID</h5> -->
          <h5
            class="py-2 font-bold text-primary print:w-1/12 print:basis-1/12 lg:basis-[10%]"
          >
            No parte
          </h5>
          <div class="w-72 print:w-7/12 lg:basis-7/12">
            <h5 class="w-full py-2 text-center font-bold text-primary">
              Descripción
            </h5>
          </div>
          <h5
            class="py-2 text-center font-bold text-primary print:w-1/12 lg:basis-1/12"
          >
            Cantidad
          </h5>
          <h5
            class="py-2 text-center font-bold text-primary print:w-2/12 lg:basis-1/12"
          >
            Precio unitario
          </h5>
          <h5 class="w-12 py-2 text-right font-bold text-primary print:w-1/12">
            Importe
          </h5>
        </div>
        <div
          class="flex w-[150vw] justify-between gap-2 px-4 text-[10px] print:w-full lg:w-full lg:justify-between lg:gap-2 lg:px-8"
          v-for="(item, index) in currentInvoice.invoiceItemList"
          :key="index"
        >
          <!-- <p class="w-6 py-2">{{ item.id }}</p> -->
          <p
            class="py-2 print:w-1/12 print:basis-1/12 print:text-[8px] lg:basis-[10%]"
          >
            {{ item.partNo }}
          </p>
          <div class="w-72 print:w-7/12 lg:basis-7/12">
            <p class="w-full py-2 text-left print:text-[8px]">
              {{ item.itemName }}
            </p>
          </div>
          <p class="py-2 text-center print:w-1/12 lg:basis-1/12">
            {{ item.qty }}
          </p>
          <p class="py-2 text-center print:w-2/12 lg:basis-1/12">
            {{
              new Intl.NumberFormat("es-MX", {
                style: "currency",
                currency: "MXN",
              }).format(item.price)
            }}
          </p>
          <p class="w-12 py-2 text-right print:w-1/12">
            {{
              new Intl.NumberFormat("es-MX", {
                style: "currency",
                currency: "MXN",
              }).format(item.total)
            }}
          </p>
        </div>
        <!-- <div class="absolute bottom-4 flex w-full justify-end gap-4 px-4">
          <h5 class="text-left text-xs font-bold text-primary">
            Tiempo de entrega
          </h5>
          <p class="text-center text-xs italic">
            {{ currentInvoice.eta }}
          </p>
        </div> -->
      </section>

      <!-- Terms and total sections -->
      <section
        class="flex w-full flex-col-reverse gap-4 py-4 print:flex-row lg:flex-row"
      >
        <section
          class="flex w-full flex-col gap-4 rounded-[20px] bg-white px-6 py-4 shadow-lg print:w-3/5 print:basis-4/5 print:flex-row print:pr-0 lg:w-4/5 lg:flex-row"
        >
          <div class="print:w-3/5 lg:w-1/2">
            <h3 class="mb-2 w-fit border-b-2 border-primary text-[#1a1a1a]">
              Condiciones del servicio
            </h3>
            <p
              class="w-[50ch] text-[8px] italic print:w-full print:text-[8px] lg:w-[80ch]"
            >
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
            <p
              class="w-[50ch] text-[10px] uppercase italic print:w-full lg:w-[70ch]"
            >
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
                {{
                  new Intl.NumberFormat("es-MX", {
                    style: "currency",
                    currency: "MXN",
                  }).format(currentInvoice.invoiceSubtotal)
                }}
              </p>
              <p>
                {{
                  new Intl.NumberFormat("es-MX", {
                    style: "currency",
                    currency: "MXN",
                  }).format(currentInvoice.invoiceTax)
                }}
              </p>
            </div>
          </div>
          <div class="divide divider my-0 w-full"></div>
          <div class="flex w-full justify-between font-bold">
            <p class="text-primary">Total</p>
            <p>
              {{
                new Intl.NumberFormat("es-MX", {
                  style: "currency",
                  currency: "MXN",
                }).format(currentInvoice.invoiceTotal)
              }}
            </p>
          </div>
        </section>
      </section>
    </div>
    <!-- :class="{ hidden: user }" -->
    <section class="mt-8 lg:print:h-screen lg:print:w-screen">
      <img src="../assets/logo-bgremoved.png" class="mb-2 h-24" alt="" />
      <div
        class="relative flex w-full flex-col items-center rounded-[20px] bg-white py-8 px-8 text-xs shadow-lg print:h-[500px] print:max-h-[500px] lg:h-[70vh] lg:text-base"
      >
        <h2
          class="inset-0 top-4 h-fit text-center text-xl font-bold uppercase italic text-primary print:block lg:block"
        >
          Ficha Técnica
        </h2>
        <section class="h-full overflow-hidden">
          <div class="container mx-auto h-full px-5 py-8">
            <div
              class="mx-auto flex h-full flex-col items-center justify-center gap-8 print:w-full print:flex-row print:flex-nowrap lg:flex-row"
            >
              <figure
                v-if="currentInvoice.features.image"
                class="h-full rounded"
                :class="{
                  'print:h-auto print:w-1/2 lg:w-auto':
                    currentInvoice.features.text,
                  'mx-auto print:h-auto print:w-1/2 lg:h-full lg:w-full':
                    !currentInvoice.features.text,
                }"
              >
                <img
                  class="h-full w-full"
                  alt="ecommerce"
                  :src="currentInvoice.features.image"
                />
              </figure>
              <div
                v-if="currentInvoice.features.text"
                class="w-full basis-1/2 leading-tight lg:mt-0 lg:w-1/2"
              >
                <p class="mx-auto h-full w-full basis-1/2 text-[10px]">
                  {{ currentInvoice.features.text }}
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
      <section class="mt-4 flex justify-end">
        <ul class="mr-0 flex gap-8">
          <li class="flex items-center gap-2">
            <i
              v-if="currentInvoice.condition === 'nuevo'"
              class="fa-regular fa-circle-check text-xl text-green-500"
            ></i>
            <i
              v-else
              class="fa-regular fa-circle-xmark text-xl text-red-500"
            ></i>
            Nuevo
          </li>
          <li class="flex items-center gap-2">
            <i
              v-if="currentInvoice.condition === 'usado'"
              class="fa-regular fa-circle-check text-xl text-green-500"
            ></i>
            <i
              v-else
              class="fa-regular fa-circle-xmark text-xl text-red-500"
            ></i>
            Usado
          </li>
          <li class="flex items-center gap-2">
            <i
              v-if="currentInvoice.condition === 'refurbished'"
              class="fa-regular fa-circle-check text-xl text-green-500"
            ></i>
            <i
              v-else
              class="fa-regular fa-circle-xmark text-xl text-red-500"
            ></i>
            Refurbished
          </li>
        </ul>
      </section>
    </section>

    <!-- Crear PDF usuario -->
    <div class="pdf flex justify-center print:hidden" v-if="!user">
      <button
        @click="generatePDF"
        class="mt-8 flex h-14 w-40 flex-row items-center justify-center gap-2 rounded-[10px] border-none bg-primary px-10 py-6 text-xs text-white transition-all hover:-translate-y-[1px] hover:shadow-lg"
      >
        <i class="fa-solid fa-file-pdf text-lg"></i>
        Crear PDF
      </button>
    </div>
  </main>
</template>

<style lang="scss" scoped>
.pdf {
  @media print {
    display: none;
  }
}
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
        // color: #1a1a1a;
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
