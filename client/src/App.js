import Home from './components/home';
import BasisData from './components/basisData';
import Dekripsi from './components/dekripsi';
import InputNilai from './components/inputNilai';
import TampilkanDataAkademik from './components/tampilkanDataAkademik';
import BangkitkanKey from './components/bangkitkanKey';

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
          <Route path='/bangkitkan-key' element={<BangkitkanKey/>}/>  
          <Route path='/dekripsi' element={<Dekripsi/>}/>  
          <Route path='/input-nilai' element={<InputNilai/>}/>  
          <Route path='/tampilkan-data-akademik' element={<TampilkanDataAkademik/>}/>  
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
