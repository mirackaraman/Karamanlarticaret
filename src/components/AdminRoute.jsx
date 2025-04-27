import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
  const { user } = useAuth();

  if (!user) {
    // Giriş yapmamışsa login sayfasına yönlendir
    return <Navigate to="/login" />;
  }

  if (!user.isAdmin) {
    // Giriş yapmış ama admin değilse anasayfaya yönlendir
    return <Navigate to="/" />;
  }

  // Admin kullanıcıysa sayfayı göster
  return children;
};

export default AdminRoute;
