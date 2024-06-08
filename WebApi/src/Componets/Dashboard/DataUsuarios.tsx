import {
  Box,
  Button,
  Typography,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Usuario from "../Interface/IUsuarios";
import axios from "axios";

export default function DataGridDemo() {
  const [rows, setRows] = useState<Usuario[]>([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [currentAutor, setCurrentAutor] = useState<Usuario | null>(null);
  const [newAutor, setNewAutor] = useState<Usuario>({
    pkUsuario: 0,
    nombre: "",
    user: "",
  });
  const [autorToDelete, setAutorToDelete] = useState<number | null>(null);

  const columns: GridColDef[] = [
    { field: "pkUsuario", headerName: "ID", width: 70 },
    { field: "nombre", headerName: "Nombre", width: 200 },
    { field: "user", headerName: "Usuario", width: 130 },
    {
      field: "actions",
      headerName: "Acciones",
      width: 150,
      renderCell: (params) => (
        <Box display="flex" justifyContent="space-between" width="100%">
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={() => handleEdit(params.row)}
          >
            Editar
          </Button>
          <Button
            variant="contained"
            color="secondary"
            size="small"
            onClick={() => handleOpenConfirm(params.row.pkUsuario)}
            style={{ marginLeft: 8 }}
          >
            Eliminar
          </Button>
        </Box>
      ),
    },
  ];

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "https://localhost:7141/Usuario"
      );
      console.log("Response data:", response.data); // Verifica la estructura de la respuesta
      setRows(response.data.result); // Ajuste aquí
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (autorToDelete !== null) {
      try {
        await axios.delete(`https://localhost:7141/Usuario/${autorToDelete}`);
        setRows((prevRows) =>
          prevRows.filter((row) => row.pkUsuario !== autorToDelete)
        );
        setAutorToDelete(null);
        handleCloseConfirm();
      } catch (error) {
        console.error("Error deleting data:", error);
      }
    }
  };

  const handleEdit = (autor) => {
    setCurrentAutor(autor);
    setOpen(true);
  };

  const handleOpenConfirm = (pkUsuario) => {
    setAutorToDelete(pkUsuario);
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
    setAutorToDelete(null);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentAutor(null);
  };

  const handleOpenAdd = () => {
    setOpenAdd(true);
  };

  const handleCloseAdd = () => {
    setOpenAdd(false);
    setNewAutor({ pkUsuario: 0, nombre: "", usuario: "" });
  };

  const handleSave = async () => {
    try {
      await axios.put(
        `https://localhost:7141/Usuario/${currentAutor.pkUsuario}`,
        currentAutor
      );
      setRows((prevRows) =>
        prevRows.map((row) =>
          row.pkUsuario === currentAutor.pkUsuario ? currentAutor : row
        )
      );
      console.log('Algo Salio mal');
      handleClose();
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };

  const handleAdd = async () => {
    try {
      const response = await axios.post(
        "https://localhost:7141/Usuario",
        newAutor
      );
      setRows((prevRows) => [...prevRows, response.data]);
      handleCloseAdd();
    } catch (error) {
      console.error("Error adding data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (rows.length > 0) {
      setDataLoaded(true);
      console.log("Cargado Correctamente");
    } else {
      console.log("No cargado");
    }
  }, [rows]);

  return (
    <Box
      sx={{ padding: "2rem", backgroundColor: "#f5f5f5", minHeight: "100vh" }}
    >
      <Paper sx={{ padding: "2rem", backgroundColor: "#fff", boxShadow: 3 }}>
        {loading ? (
          <Typography variant="h6" color="error" sx={{ marginBottom: "1rem" }}>
            Cargando datos...
          </Typography>
        ) : (
          dataLoaded && (
            <Typography
              variant="h6"
              color="success"
              sx={{ marginBottom: "1rem" }}
            >
              Datos cargados correctamente
            </Typography>
          )
        )}
        <Button
          variant="contained"
          color="primary"
          sx={{ marginBottom: "1rem" }}
          onClick={handleOpenAdd}
        >
          Agregar Autor
        </Button>
        <DataGrid
          rows={rows}
          columns={columns}
          getRowId={(row) => row.pkUsuario}
          autoHeight
          sx={{
            "& .MuiDataGrid-root": {
              border: "none",
            },
            "& .MuiDataGrid-cell": {
              borderBottom: "1px solid #e0e0e0",
            },
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "#e0e0e0",
              borderBottom: "1px solid #e0e0e0",
            },
            "& .MuiDataGrid-columnHeaderTitle": {
              fontWeight: "bold",
              color: "#333",
            },
            "& .MuiDataGrid-row": {
              "&:nth-of-type(odd)": {
                backgroundColor: "#fafafa",
              },
            },
            "& .MuiDataGrid-footerContainer": {
              justifyContent: "center",
              padding: "1rem",
              backgroundColor: "#e0e0e0",
              borderTop: "1px solid #e0e0e0",
            },
          }}
        />
      </Paper>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Editar Autor</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Nombre"
            type="text"
            fullWidth
            variant="outlined"
            value={currentAutor?.nombre || ""}
            onChange={(e) =>
              setCurrentAutor({ ...currentAutor, nombre: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Usuario"
            type="text"
            fullWidth
            variant="outlined"
            value={currentAutor?.usuario || ""}
            onChange={(e) =>
              setCurrentAutor({ ...currentAutor, usuario: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleSave} color="primary">
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openConfirm} onClose={handleCloseConfirm}>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de que deseas eliminar este autor?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirm} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleDelete} color="secondary">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openAdd} onClose={handleCloseAdd}>
        <DialogTitle>Agregar Autor</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Nombre"
            type="text"
            fullWidth
            variant="outlined"
            value={newAutor.nombre}
            onChange={(e) =>
              setNewAutor({ ...newAutor, nombre: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Usuario"
            type="text"
            fullWidth
            variant="outlined"
            value={newAutor.usuario}
            onChange={(e) =>
              setNewAutor({ ...newAutor, usuario: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAdd} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleAdd} color="primary">
            Agregar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
