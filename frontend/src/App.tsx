import { RouterProvider } from "react-router";
import { AuthProvider, ThemeProvider } from "@/contexts";
import router from "@/pages/routing";
import { QueryProvider } from "@/providers/query-provider";

export default function App() {
  return (
    <QueryProvider>
      <ThemeProvider>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </ThemeProvider>
    </QueryProvider>
  );
}
