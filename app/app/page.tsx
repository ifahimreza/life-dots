import {Suspense} from "react";
import MainPage from "../main-page";

export default function AppPage() {
  return (
    <Suspense fallback={null}>
      <MainPage />
    </Suspense>
  );
}
