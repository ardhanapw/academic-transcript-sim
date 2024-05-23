import Home from './components/home';
import BasisData from './components/basisData';
import BuatTranskripAkademik from './components/buatTranskripAkademik';
import InputDataAkademik from './components/inputDataAkademik';

import Navbar from './components/navbar';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';


function App() {
  return (
    <>
      <BrowserRouter>
        <Navbar/>
        <Routes>
          <Route path='/' element={<Home/>}/>  
          <Route path='/basis-data' element={<BasisData/>}/>  
          <Route path='/buat-transkrip-akademik' element={<BuatTranskripAkademik/>}/>  
          <Route path='/input-data-akademik' element={<InputDataAkademik/>}/>  
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
