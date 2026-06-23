import {Routes, Route ,Navigate} from "react-router";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import SheetsPage from "./pages/SheetsPage";
import SheetDetail from "./pages/SheetDetail";
import ContestsPage from "./pages/ContestsPage";
import ContestArena from "./pages/ContestArena";
import ProfilePage from "./pages/ProfilePage";
import ContestLeaderboard from "./pages/ContestLeaderboard";
import { useDispatch, useSelector } from 'react-redux';
import { checkAuth } from "./authSlice";
import { useEffect } from "react";
import AdminPanel from "./components/AdminPanel";
import ProblemPage from "./pages/ProblemPage"
import Admin from "./pages/Admin";
import AdminDelete from "./components/AdminDelete"
import AdminUpdate from "./components/AdminUpdate";

function App(){
  
  const dispatch = useDispatch();
  const {isAuthenticated,user,loading} = useSelector((state)=>state.auth);

  // check initial authentication
  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);
  
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">
      <span className="loading loading-spinner loading-lg"></span>
    </div>;
  }

  return(
  <>
    <Routes>
      <Route path="/" element={isAuthenticated ? <Dashboard /> : <Navigate to="/signup" />} />
      <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <Login />} />
      <Route path="/signup" element={isAuthenticated ? <Navigate to="/" /> : <Signup />} />
      
      {/* Sheets Routes */}
      <Route path="/sheets" element={isAuthenticated ? <SheetsPage /> : <Navigate to="/signup" />} />
      <Route path="/sheets/:company" element={isAuthenticated ? <SheetDetail /> : <Navigate to="/signup" />} />
      
      {/* Contest Routes */}
      <Route path="/contests" element={isAuthenticated ? <ContestsPage /> : <Navigate to="/signup" />} />
      <Route path="/contest/:contestId" element={isAuthenticated ? <ContestArena /> : <Navigate to="/signup" />} />
      <Route path="/contest/:contestId/leaderboard" element={isAuthenticated ? <ContestLeaderboard /> : <Navigate to="/signup" />} />
      
      {/* Profile Route */}
      <Route path="/profile" element={isAuthenticated ? <ProfilePage /> : <Navigate to="/signup" />} />

      {/* Admin Routes */}
      <Route path="/admin" element={isAuthenticated && user?.role === 'admin' ? <Admin /> : <Navigate to="/" />} />
      <Route path="/admin/create" element={isAuthenticated && user?.role === 'admin' ? <AdminPanel /> : <Navigate to="/" />} />
      <Route path="/admin/update" element={isAuthenticated && user?.role === 'admin' ? <AdminUpdate /> : <Navigate to="/" />} />
      <Route path="/admin/delete" element={isAuthenticated && user?.role === 'admin' ? <AdminDelete /> : <Navigate to="/" />} />
      
      <Route path="/problem/:problemId" element={isAuthenticated ? <ProblemPage /> : <Navigate to="/signup" />} />
    </Routes>
  </>
  )
}

export default App;