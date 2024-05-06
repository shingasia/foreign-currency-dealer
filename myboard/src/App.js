import { BrowserRouter, Routes, Route, Link, Outlet, useNavigate } from 'react-router-dom';
import MemberJoinPage from './pages/member/MemberJoinPage';
import MemberLoginPage from './pages/member/MemberLoginPage';
import HomePage from './pages/main/HomePage';
import SellingPage from './pages/selling/SellingPage';
import SellingRegisterInput from './pages/selling/SellingRegisterInput';
import SellingDetailPage from './pages/selling/SellingDatailPage';
import NavPanel from './components/common/NavPanel';
function App() {

  return (
    <>
      <BrowserRouter>
        <NavPanel />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/selling/list" element={<SellingPage />} />
          <Route path="/selling/register" element={<SellingRegisterInput />} />
          {/* <Route path="/selling/detail" element={<CommunityPage />} /> */}
          <Route path="/selling/detail" element={<SellingDetailPage />} />
          <Route path="/member" element={<><Outlet/></>}>
            <Route path="login" element={<MemberLoginPage />} />
          </Route>
          {/* <Route path="/about" element={<AboutPage />} />
          <Route path="/profile" element={<ProfilePage />} /> */}
        </Routes>
      </BrowserRouter>
      {/* <MemberJoinPage /> */}
      {/* <MemberLoginPage /> */}
    </>
  );
}

export default App;
