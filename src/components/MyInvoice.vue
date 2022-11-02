<script setup>
defineProps(["invoice"]);
</script>

<template>
  <router-link
    :to="{ name: 'Invoice', params: { invoiceId: invoice.invoiceId } }"
    class="invoice relative flex py-7 px-4 transition-all duration-300 hover:shadow-lg focus:outline-primary lg:px-8"
  >
    <div class="left flex">
      <span class="tracking-number text-xs lg:text-base"
        >#{{ invoice.invId }}</span
      >
      <span class="due-date hidden lg:block">{{ invoice.paymentDueDate }}</span>
      <span class="person text-xs lg:text-base">{{
        invoice.clientCompany
      }}</span>
    </div>
    <div class="right flex">
      <span class="price"
        >${{ parseFloat(invoice.invoiceTotal).toFixed(2) }}</span
      >
      <div
        class="status-button absolute inset-0 flex gap-2 py-2 px-4 lg:static lg:mr-2 lg:px-8"
        :class="{
          paid: invoice.invoicePaid,
          draft: invoice.invoiceDraft,
          pending: invoice.invoicePending,
        }"
      >
        <span class="hidden lg:block" v-if="invoice.invoicePaid">Vendido</span>
        <span class="hidden lg:block" v-if="invoice.invoiceDraft"
          >Borrador</span
        >
        <span class="hidden lg:block" v-if="invoice.invoicePending"
          >Pendiente</span
        >
      </div>
      <div class="icon">
        <i class="fa-solid fa-chevron-right text-primary"></i>
        <!-- <img src="@/assets/images/icon-arrow-right.svg" alt="" /> -->
      </div>
    </div>
  </router-link>
</template>

<style lang="scss" scoped>
.invoice {
  text-decoration: none;
  cursor: pointer;
  // gap: 10rem;
  gap: 16px;
  margin-bottom: 16px;
  color: #1a1a1a;
  border-radius: 20px;
  // padding: 28px 32px;
  background-color: #fff;
  align-items: center;

  // span {
  //   font-size: 13px;
  // }

  .left {
    align-items: center;
    flex-basis: 60%;
    gap: 16px;

    // span {
    //   flex: 0.5;
    // }

    @media (min-width: 768px) {
      span {
        flex: 1;
      }
    }

    .tracking-number {
      text-transform: uppercase;
    }
  }

  .right {
    gap: 16px;
    flex-basis: 40%;
    align-items: center;

    .price {
      flex: 1;
      font-size: 16px;
      font-weight: 600px;
    }
  }
}
</style>
