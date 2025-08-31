import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Login from './pages/Login';
import Register from './pages/Register';
import UserPage from './pages/UserPage';
import Adminpage from './pages/Adminpage';
import PatentsForm from './components/PatentsForm';
import PublicationsForm from './components/PublicationsForm';
import EventsForm from './components/EventsForm';
import ConferencesForm from './components/ConferencesForm';
import AdminViewAll from './pages/AdminViewAll';
import AdminAddNew from './pages/AdminAddNew';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Register />} />
        <Route path='/login' element={<Login />} />
        <Route path='/user' element={<UserPage />} />
        <Route path='/admin' element={<Adminpage />} />
        <Route path='/addpatents' element={<PatentsForm />} />
        <Route path='/addpublications' element={<PublicationsForm />} />
        <Route path='/addevents' element={<EventsForm />} />
        <Route path='/addconferences' element={<ConferencesForm />} />
        <Route path='/adminViewAll/:type' element={<AdminViewAll />} />
        <Route path='/adminAddNew/:type' element={<AdminAddNew />} />
      </Routes>
    </Router>
  );
}

export default App;
