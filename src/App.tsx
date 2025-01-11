import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import Layout from "./components/layout";
import Home from "./pages/home";
import Login from "./pages/login";
import Register from "./pages/register";
import DashboardManager from "./pages/dashboard-manager";
import Language from "./pages/language-management";
import QuotePrice from "./pages/QuotePrice-manager";
import Notarization from "./pages/notarization";
import Order from "./pages/order-manager";
import DynamicDocumentsForm from "./pages/documentType";
import DocumentDetails from "./pages/documentDetails";
import TranslatorAccount from "./pages/admin/translatorAccount";
// import Translator from "./pages/translatorPage";
import History from "./pages/translator-history";
import AssignShipper from "./pages/assignShipper";
import AssignNotarization from "./pages/AssignNotarization";
import ShipperAndStaff from "./pages/admin/createShipperandStaff";
import ShipperAcccount from "./pages/admin/shipperAccount";
import DashboardAdmin from "./pages/dashboard-admin";
import StaffAccount from "./pages/admin/staffAccount";
import SendRequest from "./pages/staff/sendrequest/indes";
import DashboardStaff from "./pages/dashboard-staff";
import DashboardTranslator from "./pages/dashboard-translator";
import RequestManager from "./pages/staff/request-manager";
import MyRequest from "./pages/customer/myrequest";
import CreateOrderOnline from "./pages/staff/createorderonline";
import QuotePageDesign from "./pages/design/quotePaged";
import OrderOnlineManage from "./pages/admin/orderOnline-manage";
import AssignHardCopy from "./pages/assignmentHardCopy";
import DocumentType from "./pages/documentTypeManagement";
import Profile from "./pages/profile";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { logout } from "./redux/features/userSlice";
import { RootState } from "./redux/rootReducer";
import HistoryOrder from "./pages/customer/myhistoryorder";
import { HubConnectionBuilder } from "@microsoft/signalr";
import { useEffect, useState } from "react";
import OrderNoShip from "./pages/orderNoShip";
import OrderNoPick from "./pages/orderNoPick";
import ReportManager from "./pages/dasboard-report";
import PaymentSuccess from "./pages/payments/paySuccess";
import PaymentFailure from "./pages/payments/paymentFail";
import Payment from "./pages/payment";
import Translator from "./pages/translator/translatorPage";
import ManageTranslatorSkill from "./pages/translator/TranslatorSkill";
import Transaction from "./pages/transaction";

function App() {
  const [connection, setConnection] = useState(null);
  const account = useSelector((state: RootState) => state.accountmanage);
  useEffect(() => {
    const hubConnection = new HubConnectionBuilder()
      .withUrl("https://protrans.azurewebsites.net/notificationHub")
      .withAutomaticReconnect()
      .build();
    setConnection(hubConnection);
  }, []);

  useEffect(() => {
    if (connection && account && account.Id) {
      const startConnection = async () => {
        try {
          connection.on(`${account.Id}`, async (title, message, author) => {
            console.log("title", title);
            console.log("message", message);
            console.log("author", author);
            toast.success(` Thông báo: ${title}`);
            // Handle the notification here, e.g., display a notification, update UI, etc.
          });
          connection
            .start()
            .then(() => console.log("Connected"))
            .catch((error) => console.error(error));

          // Subscribe to a specific method
        } catch (error) {
          console.error("Error connecting to SignalR Hub:", error);
        }
      };

      startConnection();
      return () => {
        console.log("Stopped");
        connection.stop();
      };
    }
  }, [connection]);

  const AdminRoute = ({ children, role }) => {
    const user = useSelector((store: RootState) => store.accountmanage);
    const dispatch = useDispatch();
    if (user?.role === role) {
      return children;
    } else {
      toast.error("Truy cập bị từ chối.");
      dispatch(logout());
      return <Navigate to="/login" />;
    }
  };
  const router = createBrowserRouter([
    {
      path: "",
      element: <Layout />,
      children: [
        {
          path: "",
          element: <Home />,
        },
        {
          path: "/translator",
          element: (
            <AdminRoute role="Translator">
              <Translator />
            </AdminRoute>
          ),
        },
        {
          path: "/sendrequest",
          element: (
            <AdminRoute role="Customer">
              <SendRequest />
            </AdminRoute>
          ),
        },
        {
          path: "/profile",
          element: (
            <AdminRoute role="Customer">
              <Profile />
            </AdminRoute>
          ),
        },
        {
          path: "/myrequest",
          element: (
            <AdminRoute role="Customer">
              <MyRequest />
            </AdminRoute>
          ),
        },
        {
          path: "/myhistoryorder",
          element: (
            <AdminRoute role="Customer">
              <HistoryOrder />
            </AdminRoute>
          ),
        },
        {
          path: "/quotePageDesign",
          element: <QuotePageDesign />,
        },
      ],
    },
    {
      path: "",
      children: [
        {
          path: "/login",
          element: <Login />,
        },
        {
          path: "/register",
          element: <Register />,
        },
        {
          path: "/paymentSuccess",
          element: <PaymentSuccess />,
        },
        {
          path: "/paymentfail",
          element: <PaymentFailure />,
        },
        {
          path: "/payment",
          element: <Payment />,
        },
      ],
    },
    {
      path: "dashboardmanager",
      element: (
        <AdminRoute role="Manager">
          <DashboardManager />
        </AdminRoute>
      ),
      children: [
        {
          path: "assignhardcopy",
          element: <AssignHardCopy />,
        },
        {
          path: "documenttype",
          element: <DocumentType />,
        },
        {
          path: "language",
          element: <Language />,
        },
        {
          path: "document",
          element: <DynamicDocumentsForm />,
        },
        {
          path: "quoteprice",
          element: <QuotePrice />,
        },
        {
          path: "notarization",
          element: <Notarization />,
        },
        {
          path: "order",
          element: <Order />,
        },
        {
          path: "order/details/:id",
          element: <DocumentDetails />,
        },
        {
          path: "assignshipper",
          element: <AssignShipper />,
        },
        // {
        //   path: "tasknotarizationlist",
        //   element: <TaskNotarizationList />,
        // },
        {
          path: "assignNotarization",
          element: <AssignNotarization />,
        },
        {
          path: "reportmanager",
          element: <ReportManager />,
        },
        {
          path: "transaction",
          element: <Transaction />,
        },
      ],
    },
    {
      path: "dashboardadmin",
      element: (
        <AdminRoute role="Admin">
          <DashboardAdmin />
        </AdminRoute>
      ),
      children: [
        {
          path: "translatorAccount",
          element: <TranslatorAccount />,
        },
        {
          path: "traslator",
          element: <Translator />,
        },
        {
          path: "staffaccount",
          element: <StaffAccount />,
        },
        {
          path: "createstaffandshipper",
          element: <ShipperAndStaff />,
        },
        {
          path: "shipperaccount",
          element: <ShipperAcccount />,
        },
      ],
    },
    {
      path: "dashboardstaff",
      element: (
        <AdminRoute role="Staff">
          <DashboardStaff />
        </AdminRoute>
      ),
      children: [
        {
          path: "orderonlinemanage/details/:id",
          element: <DocumentDetails />,
        },
        {
          path: "order/details/:id",
          element: <DocumentDetails />,
        },
        {
          path: "orderonlinemanage",
          element: <OrderOnlineManage />,
        },
        {
          path: "orderonline",
          element: <CreateOrderOnline />,
        },
        {
          path: "requestmanage",
          element: <RequestManager />,
        },
        {
          path: "createoderoffline",
          element: <DynamicDocumentsForm />,
        },
        {
          path: "order",
          element: <Order />,
        },
        {
          path: "order/details/:id",
          element: <DocumentDetails />,
        },
        {
          path: "ordernoship",
          element: <OrderNoShip />,
        },
        {
          path: "ordernopick",
          element: <OrderNoPick />,
        },
      ],
    },
    {
      path: "dashboardtranslator",
      element: (
        <AdminRoute role="Translator">
          <DashboardTranslator />
        </AdminRoute>
      ),
      children: [
        {
          path: "assignment",
          element: <Translator />,
        },
        {
          path: "history",
          element: <History />,
        },
        {
          path: "translatorskill",
          element: <ManageTranslatorSkill />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
