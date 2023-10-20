import { useState } from 'react'
import './App.css';
import { Outlet, RouterProvider, createBrowserRouter } from 'react-router-dom';
import Login from './pages/login/Login';
import Recuperar_Password from './pages/recuperar_password/Recuperar_Password';
import Panel_Lateral from './components/Panel_Lateral/Panel_Lateral';
import Sidebar from './components/Sidebar/Sidebar';
import Navbar from './components/Navbar/Navbar';
import EstadoRed from './pages/estado_de_red/EstadoRed';
import GestionUsuarios from './pages/gestion_usuarios/GestionUsuarios';
import GestionCobertura from './pages/gestion_cobertura/GestionCobertura';
import GestionPlanes from './pages/gestion_planes/GestionPlanes';
import GestionClientes from './pages/gestion_clientes/GestionClientes';
import GestionSedes from './pages/gestion_sedes/GestionSedes';
import ConsultaCobertura from './pages/consulta_cobertura/ConsultaCobertura';
import Auditorias from './pages/auditorias/Auditorias';
import Archivos from './pages/archivos/Archivos';
import Reportes from './pages/reportes/Reportes';
import Dashboard from './pages/dashboard/Dashboard';



function App() {

  const LayoutExt = () => {  //Layout de las páginas externas (Login y Recuperar contraseña)
    return (
      <div className="main-login">
        <div className="video-bg">
          <video className="video" autoPlay loop muted>
            <source src="./estrellas.mp4" type="video/mp4"/>
            <source src="./estrellas.webm" type="video/webm"/>
          </video>
        </div>
        <div className="contenedor-panel">
        <Panel_Lateral />
        <Outlet />

        </div>
      </div>
    );
  };

  const LayoutSidebar = () => { //Layout de las páginas internas (Dashboard y todo lo que esté dentro)
    return (
      <div className="main-dashboard">
        <Sidebar/>
      <div className="derecha"> 
        <Navbar />
        <Outlet />
        
        </div> 
      </div>
    );
  };

  const router = createBrowserRouter([
    {
      path: '/',
      element: <LayoutSidebar />,
      children: [
        {
          element: <Dashboard/>,
          path: '/',
        }
        ,
        {
          element: <EstadoRed/>,
          path: '/estado_de_red',

        },
        {
          element: <GestionUsuarios/>,
          path: '/gestion_usuarios',

        },

        {
          element: <GestionCobertura/>,
          path: '/gestion_de_cobertura',
        },

        {
          element: <GestionPlanes/>,
          path: '/gestion_de_planes',
        },

        {
          element: <GestionClientes/>,
          path: '/gestion_de_clientes',
        },
        {
          element: <GestionSedes/>,
          path: '/gestion_de_sedes',
        },
        {
          element: <ConsultaCobertura/>,
          path: '/consulta_de_cobertura',
        },
        {
          element: <Archivos/>,
          path: '/archivos',
        },
        {
          element: <Auditorias/>,
          path: '/auditorias',
        },
        {
          element: <Reportes/>,
          path: '/reportes',
        }
      ],
    },


    {
      path: '/',
      element: <LayoutExt />,
      children: [
        {
          element: <Login />,
          path: '/login',
        },
        {
          element: <Recuperar_Password />,
          path: '/recuperar_password',
        }
      ]
    }


  ]);
  
 
  return <RouterProvider router={router} />;
  
}

export default App
