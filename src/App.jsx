//import logo from './logo.svg';
import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import 'react-tooltip/dist/react-tooltip.css';
import { Routes, Route } from "react-router-dom";
//Importing Pages
import { Navbar, Signup, Login } from '@/components';
import {
  Dashboard,
  EditProfile,
  OtherUserExerciseLog,
  UserExercise,
  CreateExerciseLog,
  EditExerciseLog
} from '@/pages';

//import Test_Bootstrap from './pages/test_bootstrap';

function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path='/signup' element={<Signup />} />
        <Route path='/login' element={<Login />} />
        <Route path='/' element={<Dashboard />} />
        <Route path='/edit-profile' element={<EditProfile />} />
        <Route path='/view-user-exercise/:id' element={<OtherUserExerciseLog />} />
        <Route path='/manage-exercise' element={<UserExercise />} />
        <Route path='/create-exercise-log' element={<CreateExerciseLog />} />
        <Route path='/edit-exercise-log/:id' element={<EditExerciseLog />} />
        {/* <Route path='/test-bootstrap' element={<Test_Bootstrap />} /> */}
      </Routes>
    </div>
  );
}

export default App;
