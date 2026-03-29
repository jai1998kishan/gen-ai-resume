import { useAuth } from "../hooks/useAuth";
import { Navigate, replace, useNavigate } from "react-router";

function Prodected({ children }) {
  const navigate = useNavigate();

  const { loading, user } = useAuth();

  if (!user) {
    return <Navigate to={"/login"} replace />;
  }

  if (loading) {
    return (
      <main>
        <h1>Loading...</h1>
      </main>
    );
  }

  return children;
}

export default Prodected;
