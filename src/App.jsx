import Axios from 'axios';
import {
  RouterProvider,
} from "react-router-dom";
import { router } from './Routes.jsx';
import GlobalComponents from './global/Components.jsx';
import ContextStore from './hooks/ContextStore.jsx';
import { Provider } from "react-redux";
import store, { persistor } from './redux/store.jsx';
import { PersistGate } from "redux-persist/integration/react";
import AuthInit from './AuthInit.jsx';

Axios.defaults.baseURL = import.meta.env.VITE_API_URL;

function App() {

  return (
    <>
    <ContextStore>
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <RouterProvider router={router} />
          <GlobalComponents />
        </PersistGate>
      </Provider>
    </ContextStore>
    </>
  )
}

export default App
