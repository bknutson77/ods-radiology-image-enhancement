import AuthenticationView from "./authentication/AuthenticationView";
import { RootStoreProvider } from "./providers/RootStoreContext";

export default function App() {
  return (
    <RootStoreProvider>
      <AuthenticationView />
    </RootStoreProvider>
  );
}
