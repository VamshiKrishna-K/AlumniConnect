import './App.css';
import {Route,Routes} from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About.jsx';
import Login from './auth/Login.jsx';
import SignUp from './auth/SignUp.jsx'
import Navbar from './pages/Navbar.jsx';
import Footer from './pages/Footer.jsx';
import Dashboard from './dashboards/Dashboard.jsx';
import AlumniDashboard from './dashboards/AlumniDashboard.jsx';
import AdminDashboard from './dashboards/AdminDashboard.jsx';
import CollegeDashboard from './dashboards/CollegeDashboard.jsx';
import StudentDashboard from './dashboards/StudentDashboard.jsx';
import VerifiedAlumni from './student/VerifiedAlumni.jsx';
import ReferralRequests from './student/ReferralRequests.jsx'
import StudentProfile from './student/StudentProfile.jsx'
import AlumniProfile from './dashboards/AlumniProfile.jsx';
function App() {
 

  return (
      //   #f0f4ff
        <div   style={{ background: "linear-gradient(135deg, #b2ebf2, #e0f7fa, #ffffff)" }}>
          <Navbar/>
          <Routes>
            <Route path='/' element={<Home/>} />
            <Route path='/about' element={<About/>}/>
              <Route path='/login' element={<Login/>}/>
                <Route path='/signUp' element={<SignUp/>}/> 
               <Route path='/dashboard' element={<Dashboard/>}>
                    <Route path='admin' element={<AdminDashboard/>}/>
                      <Route path='alumni' element={<AlumniDashboard/>}/>
                        <Route path='college' element={<CollegeDashboard/>}/>
                          <Route path='student' element={<StudentDashboard/>}/>
                           
               </Route>
              
     
      <Route path="/profile" element={<StudentProfile />} />
      <Route path="/referrals" element={<ReferralRequests />} />
      <Route path="/verified_alumni" element={<VerifiedAlumni />} />
      <Route path="/alumni-profile" element={<AlumniProfile/>}/>
                <Route path='*' element={<h1> Incorrect</h1>}></Route>
          </Routes>
          <Footer/>
          
          </div>
  );
}

export default App;
