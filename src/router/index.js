import { createRouter, createWebHashHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
// import InvoiceView from "../views/InvoiceView.vue";
import { auth } from "@/firebase";

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: "/cotizacion/:invoiceId",
      name: "Invoice",
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      // component: InvoiceView,

      component: () => import("../views/InvoiceView.vue"),
    },
    {
      path: "/login",
      name: "Login",
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import("../views/LoginView.vue"),
    },
    {
      path: "/configuracion",
      name: "Settings",
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import("../views/SettingsView.vue"),
    },
  ],
});

router.beforeEach((to, from, next) => {
  if (to.path === "/login" && auth.currentUser) {
    next("/");
    return;
  }

  if (
    to.matched.some((record) => record.meta.requiresAuth) &&
    !auth.currentUser
  ) {
    next("/login");
    return;
  }

  next();
});

router.beforeEach((to, from, next) => {
  // console.log(to);
  if (to.path === "/" || to.path === "/login") {
    document.title = "GCO Soluciones Industriales";
    next();
    return;
  }
  document.title = `Cotización #${to.params.invoiceId} | GCO Soluciones Industriales`;
  next();
});

export default router;
