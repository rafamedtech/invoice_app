import { ref } from "vue";
import { useRouter } from "vue-router";
import { defineStore } from "pinia";
import {
  collection,
  getDocs,
  deleteDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db, auth } from "@/firebase";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";

export const useStore = defineStore("main", () => {
  const invoiceDialog = ref(null);
  const modalActive = ref(null);
  const invoiceData = ref([]);
  const invoicesLoaded = ref(null);
  const currentInvoice = ref(null);
  const editInvoice = ref(null);
  const contactData = ref([]);
  const user = ref(null);

  const customModal = ref(null);
  const modalType = ref(null);

  // const errorMsg = ref("");

  const router = useRouter();

  const toggleInvoice = () => {
    invoiceDialog.value = !invoiceDialog.value;
  };

  const toggleModal = () => {
    modalActive.value = !modalActive.value;
  };

  const getInvoices = async () => {
    const dataBase = await getDocs(collection(db, "invoices"));
    dataBase.forEach((doc) => {
      if (!invoiceData.value.some((invoice) => invoice.docId === doc.id)) {
        const data = {
          docId: doc.id,
          invId: doc.data().invId,
          createdBy: doc.data().createdBy,
          invoiceId: doc.data().invoiceId,
          clientCompany: doc.data().clientCompany,
          clientName: doc.data().clientName,
          clientName2: doc.data().clientName2,
          clientEmail: doc.data().clientEmail,
          clientEmail2: doc.data().clientEmail2,
          currencyType: doc.data().currencyType,
          exchangeCost: doc.data().exchangeCost,
          eta: doc.data().eta,
          invoiceDateUnix: doc.data().invoiceDateUnix,
          invoiceDate: doc.data().invoiceDate,
          paymentTerms: doc.data().paymentTerms,
          paymentDueDateUnix: doc.data().paymentDueDateUnix,
          paymentDueDate: doc.data().paymentDueDate,
          condition: doc.data().condition,
          paymentType: doc.data().paymentType,
          notes: doc.data().notes,
          featureType: doc.data().featureType,
          features: doc.data().features,
          invoiceItemList: doc.data().invoiceItemList,
          invoiceTax: doc.data().invoiceTax,
          invoiceSubtotal: doc.data().invoiceSubtotal,
          invoiceTotal: doc.data().invoiceTotal,
          invoicePending: doc.data().invoicePending,
          invoiceDraft: doc.data().invoiceDraft,
          invoicePaid: doc.data().invoicePaid,
        };

        const contact = {
          clientCompany: doc.data().clientCompany,
          clientName: doc.data().clientName,
          clientName2: doc.data().clientName2,
          clientEmail: doc.data().clientEmail,
          clientEmail2: doc.data().clientEmail2,
        };

        contactData.value.push(contact);
        invoiceData.value.push(data);
      }
    });

    invoicesLoaded.value = true;
  };

  const setCurrentInvoice = (payload) => {
    currentInvoice.value = invoiceData.value.find((invoice) => {
      return invoice.invoiceId === payload;
    });
  };

  const editCurrentInvoice = () => {
    editInvoice.value = !editInvoice.value;
  };

  const deleteInvoice = (payload) => {
    invoiceData.value = invoiceData.value.filter(
      (invoice) => invoice.docId !== payload
    );
  };

  const updateCurrentInvoice = async ({ docId, routeId }) => {
    deleteInvoice(docId);
    await getInvoices();
    toggleInvoice();
    editCurrentInvoice();
    setCurrentInvoice(routeId);
  };

  const deleteCurrentInvoice = async (docId) => {
    deleteInvoice(docId);
    await deleteDoc(doc(db, "invoices", docId));
    router.push("/");
  };

  const updateStatusToPaid = async (payload) => {
    const docRef = doc(db, "invoices", payload);
    await updateDoc(docRef, {
      invoicePaid: true,
      invoicePending: false,
    });

    invoiceData.value.forEach((invoice) => {
      if (invoice.docId === payload) {
        invoice.invoicePaid = true;
        invoice.invoicePending = false;
      }
    });
  };

  const updateStatusToPending = async (payload) => {
    const docRef = doc(db, "invoices", payload);
    await updateDoc(docRef, {
      invoicePaid: false,
      invoicePending: true,
      invoiceDraft: false,
    });

    invoiceData.value.forEach((invoice) => {
      if (invoice.docId === payload) {
        invoice.invoicePaid = false;
        invoice.invoicePending = true;
        invoice.invoiceDraft = false;
      }
    });
  };

  const userLogin = ({ email, password }) => {
    // const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        console.log("Successfully signed in!");

        router.push("/");
      })
      .catch((error) => {
        console.log(error.code);
        switch (error.code) {
          case "auth/invalid-email":
            alert("Correo electrónico inválido");
            // errorMsg.value = "Invalid email";
            break;
          case "auth/user-not-found":
            alert("No se encontro una cuenta con este correo electrónico");
            // errorMsg.value = "No account with that email was found";
            break;
          case "auth/wrong-password":
            alert("Contraseña incorrecta");
            // errorMsg.value = "incorrect password";
            break;
          default:
            alert("Correo electrónico o contraseña incorrectos");
            // errorMsg.value = "Email or password was incorrect";
            break;
        }
      });
  };

  const userLogout = async () => {
    await signOut(auth);

    user.value = null;

    router.push("/login");
  };

  const fetchUser = () => {
    auth.onAuthStateChanged(async (fetchedUser) => {
      if (fetchedUser === null) {
        user.value = null;
      } else {
        user.value = fetchedUser;

        if (router.isReady() && router.currentRoute.value.path === "/login") {
          router.push("/");
        }
      }
    });
  };
  return {
    user,
    invoiceDialog,
    modalActive,
    invoiceData,
    contactData,
    invoicesLoaded,
    currentInvoice,
    editInvoice,
    customModal,
    modalType,
    toggleInvoice,
    toggleModal,
    getInvoices,
    setCurrentInvoice,
    editCurrentInvoice,
    deleteCurrentInvoice,
    updateCurrentInvoice,
    updateStatusToPaid,
    updateStatusToPending,
    userLogin,
    userLogout,
    fetchUser,
  };
});
