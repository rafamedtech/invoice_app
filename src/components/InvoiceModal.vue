<script setup>
import { reactive, ref, computed, watchEffect } from "vue";
import { useStore } from "@/stores/main";
import { storeToRefs } from "pinia";
import { uid } from "uid";
import { collection, updateDoc, addDoc, doc } from "firebase/firestore";
import { db } from "@/firebase";

import LoadingSpinner from "@/components/LoadingSpinner.vue";

const state = reactive({
  dateOptions: { year: "numeric", month: "short", day: "numeric" },
  docId: null,
  loading: null,
  clientName: null,
  clientCompany: null,
  clientEmail: null,
  invoiceDateUnix: null,
  invoiceDate: null,
  paymentTerms: 1,
  paymentDueDateUnix: null,
  paymentDueDate: null,
  currencyType: "MX",
  exchangeCost: "",
  eta: "Inmediata",
  notes: null,
  invoicePending: null,
  invoiceDraft: null,
  invoiceItemList: [
    { id: uid(2), itemName: "", qty: "", partNo: "", price: "" },
  ],
  invoiceSubtotal: 0,
});

const invoiceTax = computed(() => {
  return state.invoiceSubtotal * 0.16;
});

const invoiceTotal = computed(() => {
  return state.invoiceSubtotal + invoiceTax.value;
});

const { editInvoice, currentInvoice } = storeToRefs(useStore());
const { editCurrentInvoice, updateCurrentInvoice, getInvoices, toggleModal } =
  useStore();

const closeInvoice = () => {
  useStore().toggleInvoice();
  if (editInvoice.value) {
    editCurrentInvoice();
  }
};

const addNewInvoiceItem = () => {
  state.invoiceItemList.push({
    id: uid(2),
    itemName: "",
    qty: "",
    partNo: "",
    price: 0,
    total: 0,
  });
};

const invoiceWrap = ref(null);

const checkClick = (e) => {
  if (e.target === invoiceWrap.value) {
    toggleModal();
  }
};

const deleteInvoiceItem = (id) => {
  state.invoiceItemList = state.invoiceItemList.filter(
    (item) => item.id !== id
  );
};

const calInvoiceTotal = () => {
  state.invoiceSubtotal = 0;
  state.invoiceItemList.forEach((item) => {
    state.invoiceSubtotal += item.total;
  });
};

const publishInvoice = () => {
  state.invoicePending = true;
};

const saveDraft = () => {
  state.invoiceDraft = true;
};

const uploadInvoice = async () => {
  if (state.invoiceItemList.length <= 0) {
    alert("Favor de agregar articulos a la cotizacion!");
    return;
  }

  state.loading = true;

  calInvoiceTotal();

  await addDoc(collection(db, "invoices"), {
    invoiceId: uid(6),
    clientName: state.clientName,
    clientCompany: state.clientCompany,
    clientEmail: state.clientEmail,
    currencyType: state.currencyType,
    exchangeCost: state.exchangeCost,
    eta: state.eta,
    notes: state.notes,
    invoiceDate: state.invoiceDate,
    invoiceDateUnix: state.invoiceDateUnix,
    paymentTerms: state.paymentTerms,
    paymentDueDate: state.paymentDueDate,
    paymentDueDateUnix: state.paymentDueDateUnix,
    invoiceItemList: state.invoiceItemList,
    invoiceSubtotal: state.invoiceSubtotal,
    invoiceTax: invoiceTax.value,
    invoiceTotal: invoiceTotal.value,
    invoicePending: state.invoicePending,
    invoiceDraft: state.invoiceDraft,
    invoicePaid: null,
  });

  state.loading = false;

  closeInvoice();

  getInvoices();
};

const updateInvoice = async () => {
  if (state.invoiceItemList.length <= 0) {
    alert("Please ensure you filled out work items!");
    return;
  }

  state.loading = true;

  calInvoiceTotal();

  const docRef = doc(db, "invoices", state.docId);

  await updateDoc(docRef, {
    clientName: state.clientName,
    clientCompany: state.clientCompany,
    clientEmail: state.clientEmail,
    currencyType: state.currencyType,
    exchangeCost: state.exchangeCost,
    eta: state.eta,
    paymentTerms: state.paymentTerms,
    paymentDueDate: state.paymentDueDate,
    paymentDueDateUnix: state.paymentDueDateUnix,
    notes: state.notes,
    invoiceItemList: state.invoiceItemList,
    invoiceSubtotal: state.invoiceSubtotal,
    invoiceTax: invoiceTax.value,
    invoiceTotal: invoiceTotal.value,
  });

  state.loading = false;

  const payload = reactive({
    docId: currentInvoice.value.docId,
    routeId: currentInvoice.value.invoiceId,
  });

  updateCurrentInvoice(payload);

  getInvoices();
};

const submitForm = () => {
  if (editInvoice.value) {
    updateInvoice();
    return;
  }
  uploadInvoice();
};

if (!editInvoice.value) {
  state.invoiceDateUnix = Date.now();
  state.invoiceDate = new Date(state.invoiceDateUnix).toLocaleDateString(
    "en-us",
    state.dateOptions
  );
}

if (editInvoice.value) {
  state.docId = currentInvoice.value.docId;
  state.clientName = currentInvoice.value.clientName;
  state.clientCompany = currentInvoice.value.clientCompany;
  state.clientEmail = currentInvoice.value.clientEmail;
  state.currencyType = currentInvoice.value.currencyType;
  state.exchangeCost = currentInvoice.value.exchangeCost;
  state.eta = currentInvoice.value.eta;
  state.invoiceDateUnix = currentInvoice.value.invoiceDateUnix;
  state.invoiceDate = currentInvoice.value.invoiceDate;
  state.paymentTerms = currentInvoice.value.paymentTerms;
  state.paymentDueDateUnix = currentInvoice.value.paymentDueDateUnix;
  state.paymentDueDate = currentInvoice.value.paymentDueDate;
  state.notes = currentInvoice.value.notes;
  state.invoicePending = currentInvoice.value.invoicePending;
  state.invoiceDraft = currentInvoice.value.invoiceDraft;
  state.invoiceItemList = currentInvoice.value.invoiceItemList;
  state.invoiceSubtotal = currentInvoice.value.invoiceSubtotal;
  // invoiceTax.value = currentInvoice.value.invoiceTax;
  // invoiceTotal.value = currentInvoice.value.invoiceTotal;
}

watchEffect(() => {
  const futureDate = new Date();
  state.paymentDueDateUnix = futureDate.setDate(
    futureDate.getDate() + parseInt(state.paymentTerms)
  );
  state.paymentDueDate = new Date(state.paymentDueDateUnix).toLocaleDateString(
    "en-us",
    state.dateOptions
  );
});
</script>

<template>
  <div
    @click="checkClick"
    ref="invoiceWrap"
    class="invoice-wrap flex-column z-50 flex w-[300vw] bg-[#1a1a1a]/50 lg:w-[200vw]"
  >
    <Transition name="invoice">
      <form
        @submit.prevent="submitForm"
        class="invoice-content w-screen px-4 pt-40 pb-14 lg:max-w-3xl lg:p-14"
      >
        <LoadingSpinner v-show="state.loading" />
        <h1
          class="w-fit border-b-2 border-primary text-2xl text-[#1a1a1a]"
          v-if="!editInvoice"
        >
          Nueva Cotización
        </h1>
        <h1
          class="w-fit border-b-2 border-primary text-2xl text-[#1a1a1a]"
          v-else
        >
          Editar Cotización
        </h1>

        <!-- Bill To -->
        <div class="bill-to flex-column flex gap-4">
          <h4 class="text-primary">Datos generales</h4>
          <div class="flex-column flex">
            <label for="clientName">Nombre del cliente</label>
            <input
              class="focus:ring-primary"
              required
              type="text"
              id="clientName"
              v-model="state.clientName"
            />
          </div>
          <div class="flex-column flex">
            <label for="clientCompany">Empresa</label>
            <input
              class="focus:ring-primary"
              required
              type="text"
              id="clientCompany"
              v-model="state.clientCompany"
            />
          </div>
          <div class="flex-column flex">
            <label for="clientEmail">Correo electrónico</label>
            <input
              class="focus:ring-primary"
              required
              type="email"
              id="clientEmail"
              v-model="state.clientEmail"
            />
          </div>

          <div class="location-details flex">
            <div class="flex-column flex">
              <label for="currencyType">Moneda</label>
              <!-- <input
                class="focus:ring-primary"
                required
                type="text"
                id="currencyType"
                v-model="state.currencyType"
              /> -->
              <select
                class="focus:ring-primary"
                name="currencyType"
                v-model="state.currencyType"
                id="currencyType"
              >
                <option value="MX">MX</option>
                <option value="USD">USD</option>
              </select>
            </div>
            <div class="flex-column flex">
              <label for="exchangeCost">Tipo de cambio</label>
              <input
                class="focus:ring-primary"
                type="text"
                id="exchangeCost"
                v-model="state.exchangeCost"
              />
            </div>
          </div>
        </div>

        <!-- Invoice Work Details -->
        <div class="invoice-work flex-column flex">
          <div class="payment flex">
            <div class="flex-column flex">
              <label for="invoiceDate">Fecha</label>
              <input
                disabled
                type="text"
                id="invoiceDate"
                v-model="state.invoiceDate"
              />
            </div>
            <div class="flex-column flex">
              <label for="paymentDueDate">Días de vigencia</label>
              <input
                class="focus:ring-primary"
                type="number"
                id="paymentDueDate"
                v-model="state.paymentTerms"
              />
              <!-- v-model="state.paymentDueDate" -->
            </div>
            <div class="flex-column flex">
              <label
                for="paymentDueDate"
                class="mb-[6px] text-[10px] lg:text-[12px]"
                data-label="entrega"
                >Tiempo de entrega</label
              >
              <input
                class="focus:ring-primary"
                type="text"
                id="paymentDueDate"
                v-model="state.eta"
              />
              <!-- v-model="state.paymentDueDate" -->
            </div>
          </div>

          <div class="work-items mt-8">
            <h3 class="mb-4 text-primary">Artículos</h3>
            <table class="item-list">
              <tr class="table-heading flex">
                <th class="item-name">Descripción</th>
                <th class="qty">Ctd</th>
                <th class="price">No. parte</th>
                <th class="price">Precio</th>
                <th class="total">Total</th>
              </tr>
              <div v-auto-animate>
                <tr
                  class="table-items flex gap-[10px] lg:gap-4"
                  v-for="(item, index) in state.invoiceItemList"
                  :key="index"
                >
                  <td class="item-name">
                    <input
                      class="focus:ring-primary"
                      type="text"
                      v-model="item.itemName"
                    />
                  </td>
                  <td class="qty">
                    <input
                      class="focus:ring-primary"
                      type="text"
                      v-model="item.qty"
                    />
                  </td>
                  <td class="price">
                    <input
                      class="focus:ring-primary"
                      type="text"
                      v-model="item.partNo"
                    />
                  </td>
                  <td class="price">
                    <input
                      class="focus:ring-primary"
                      type="text"
                      v-model="item.price"
                    />
                  </td>
                  <td class="total flex">
                    ${{
                      parseFloat((item.total = item.qty * item.price)).toFixed(
                        2
                      )
                    }}
                  </td>
                  <i
                    @click="deleteInvoiceItem(item.id)"
                    class="fa-solid fa-trash absolute -top-5 right-0 m-auto cursor-pointer text-base text-primary"
                    title="Borrar artículo"
                  ></i>
                </tr>
              </div>
            </table>

            <div
              @click="addNewInvoiceItem"
              class="btn flex gap-2 border-none bg-primary/50 hover:bg-secondary"
            >
              <i class="fa-solid fa-plus"></i>
              Agregar artículo
            </div>
          </div>

          <div class="mt-8 flex flex-col">
            <label for="notes">Notas</label>
            <textarea
              id="notes"
              class="rounded-[16px] border-none focus:ring-primary"
              v-model="state.notes"
            ></textarea>
          </div>
        </div>

        <!-- <section class="mt-8">
          <p class="text-right text-primary">
            Subtotal
            <span class="text-[#1a1a1a]">$ {{ state.invoiceSubtotal }}</span>
          </p>
          <p class="text-right mt-4 text-primary">
            IVA <span class="text-[#1a1a1a]">$ {{ invoiceTax }}</span>
          </p>
          <p class="text-right mt-4 text-primary">
            Total <span class="text-[#1a1a1a]">$ {{ invoiceTotal }}</span>
          </p>
        </section> -->

        <!-- Save/Exit -->
        <div class="save flex flex-col gap-2 lg:flex-row">
          <div class="left">
            <button
              type="button"
              @click="closeInvoice"
              class="btn w-full border-none bg-white text-primary hover:bg-secondary hover:text-white focus:outline-primary lg:w-auto"
            >
              Cancelar
            </button>
          </div>
          <div class="right flex flex-col gap-2 lg:flex-row">
            <button
              v-if="!editInvoice"
              type="submit"
              @click="saveDraft"
              class="btn border-none bg-gray-200 text-secondary hover:bg-secondary hover:text-white focus:outline-primary"
            >
              Guardar Borrador
            </button>
            <button
              v-if="!editInvoice"
              type="submit"
              @click="publishInvoice"
              class="btn border-none bg-primary hover:bg-secondary hover:text-white focus:outline-primary"
            >
              Crear Cotización
            </button>
            <button
              v-if="editInvoice"
              type="sumbit"
              class="btn border-none bg-primary hover:bg-secondary focus:outline-primary"
            >
              Actualizar Cotización
            </button>
          </div>
        </div>
      </form>
    </Transition>
  </div>
</template>

<style lang="scss" scoped>
// animated invoice

.invoice-enter-active,
.invoice-leave-active {
  transition: 0.4s ease all;
}

.invoice-enter-from,
.invoice-leave-to {
  transform: translateX(-700px);
  opacity: 0;
}
.invoice-wrap {
  position: fixed;
  top: 0;
  left: 0;
  // width: 300vw;
  height: 100vh;
  overflow: scroll;
  &::-webkit-scrollbar {
    display: none;
  }
  @media (min-width: 900px) {
    left: 90px;
  }

  .invoice-content {
    position: relative;
    // padding: 56px;
    // max-width: 700px;
    // width: 100%;
    background-color: #f2f2f2;
    color: #1a1a1a;
    box-shadow: 10px 4px 6px -1px rgba(0, 0, 0, 0.2),
      0 2px 4px -1px rgba(0, 0, 0, 0.06);

    h1 {
      margin-bottom: 48px;
      // color: #e90f02;
    }

    // h3 {
    //   margin-bottom: 16px;
    //   font-size: 18px;
    //   color: #777f98;
    // }

    // h4 {
    //   color: #e90f02;
    //   font-size: 12px;
    //   margin-bottom: 24px;
    // }

    // Bill To / Bill From
    .bill-to,
    .bill-from {
      margin-bottom: 48px;

      .location-details {
        gap: 16px;
        div {
          flex: 1;
        }
      }
    }

    // Invoice Work

    .invoice-work {
      .payment {
        gap: 24px;
        div {
          flex: 1;
        }
      }

      .work-items {
        .item-list {
          width: 100%;

          // Item Table Styling
          .table-heading,
          .table-items {
            gap: 16px;
            // font-size: 12px;

            .item-name {
              flex-basis: 30%;
              // @media (min-width: 900px) {
              //   flex-basis: 50%;
              // }
            }

            .qty {
              flex-basis: 15%;

              @media (min-width: 768px) {
                flex-basis: 10%;
              }
            }

            .price {
              flex-basis: 20%;
            }

            .total {
              flex-basis: 20%;
              align-self: center;
            }
          }

          .table-heading {
            margin-bottom: 16px;

            th {
              text-align: left;
            }
          }

          .table-items {
            position: relative;
            margin-bottom: 24px;

            img {
              position: absolute;
              top: 15px;
              right: 0;
              width: 12px;
              height: 16px;
            }
          }
        }

        // .button {
        //   color: #fff;
        //   background-color: #252945;
        //   align-items: center;
        //   justify-content: center;
        //   width: 100%;

        //   img {
        //     margin-right: 4px;
        //   }
        // }
      }
    }

    .save {
      margin-top: 60px;

      div {
        flex: 1;
      }

      .right {
        justify-content: flex-end;
      }
    }
  }

  .input {
    margin-bottom: 24px;
  }

  label:not([data-label="entrega"]) {
    font-size: 12px;
    margin-bottom: 6px;
    // background-color: transparent !important;
  }

  input,
  select {
    width: 100%;
    // background-color: #fff;
    // background-color: #1e2139;
    color: #1a1a1a;
    border-radius: 10px;
    // padding: 12px 4px;
    border: none;

    &:focus {
      outline: none;
    }
  }
}
</style>
