import { StatusBar } from 'expo-status-bar';
import Appnavigation from './navigations/appnavigation';
import { LanguageProvider } from './LanguageProvider';
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import store from './redux/store'
import { persistStore } from "redux-persist";


export default function App() {
  const persist = persistStore(store);

  return (
    <Provider store={store}>
      <LanguageProvider>
        <PersistGate loading={null} persistor={persist}>

            <Appnavigation />

        </PersistGate>
      </LanguageProvider>
    </Provider>

  );
}

