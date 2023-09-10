import * as React from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import "../Tabla/Tabla.scss";


import { useState } from 'react';

export default function Tabla(props) {

  let {rows, columns, actions, handleDeleteRow} = props;
  const [filas, setFilas] = useState(rows)
  const [mostrarModal, setMostrarModal] = useState(false);

  const handleEditClick = (row) => {
    setMostrarModal(true);
  };

  const handleDeleteClick = (row) => {
    const nuevasFilas = filas.filter((fila) => fila.id !== row.id);
    setFilas(nuevasFilas);
    handleDeleteRow(row.id);
  };

  React.useEffect(()=> {
    setFilas(rows);
  },[rows]);

  if (actions) {
    const actionColumn = [
      {
        field: "action",
        headerName: "Accion",
        width: 200,
        renderCell: (params) => {
          return (
            <div className="action-column">
                <a href="#" id="edit" onClick={() => props.handleEditClick(params.rows)}> 
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="icon icon-tabler icon-tabler-edit"
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="#000000"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1" />
                  <path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z" />
                  <path d="M16 5l3 3" />
                </svg>
              </a>
              <a href="#" id="delete" onClick={() => handleDeleteClick(params.row)}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="icon icon-tabler icon-tabler-trash"
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="#000000"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M4 7l16 0" />
                  <path d="M10 11l0 6" />
                  <path d="M14 11l0 6" />
                  <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
                  <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
                </svg>
              </a>
            </div>
          );
        },
      },
    ];
    columns = [...columns, ...actionColumn];
  }
  
  return (
    <>
    <Box sx ={{ height: '100%', width: '100%' }}>
      
      <DataGrid
      sx = {{
        m: 2,
        fontSize: 16,
        fontFamily: 'Poppins',
        alignContent: 'center',
        justifyContent: 'center'
      }}
        rows={filas}
        columns={columns}
        initialState={{
          filter:{
            SfilterModel:{
              item:[],
              quickFilterValues: ['se'],
            }
          }
        }}
        disableColumnFilter
        disableColumnSelector
        disableDensitySelector
        pageSizeOptions={[5, 10]}
        slots={{toolbar: GridToolbar }}
        slotProps={{
          toolbar:{
            showQuickFilter: true,
          },
        }}
      />
     </Box>
      
      
      
    </>
  );
}