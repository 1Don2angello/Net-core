/**
 * Importaciones
Material-UI: Componentes como Box, Button, Typography, Paper, Dialog, etc., son usados para construir la interfaz de usuario.
React Hooks: useEffect, useState para manejar el estado y efectos secundarios del componente.
DataGrid: Un componente de Material-UI que muestra los datos en formato de tabla.
Axios: Utilizado para hacer solicitudes HTTP a la API.
 */
import { Box, Button, Typography, Paper, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import axios from "axios";

// Definición de la interfaz Autor
interface Autores {
    pkAutor: number;
    nombre: string;
    nacionalidad: string;
}

// Definición de la interfaz Usuario
interface Rol {
    pkRol: number;
    nombre: string;
}

interface Usuario {
    pkUsuario: number;
    nombre: string;
    user: string;
    password: string;
    fkRol: number;
    roles: Rol;
}
/**
 * Componente DataGridDemo
Estados:
rows: Almacena los datos de los autores.
dataLoaded, loading: Controlan la visualización de carga y el estado de los datos.
open, openConfirm, openAdd: Controlan la visibilidad de los diálogos para editar, confirmar eliminación y agregar nuevos autores.
currentAutor, newAutor, autorToDelete: Manejan el autor actual en edición, un nuevo autor para agregar y el autor a eliminar, respectivamente.
 */
export default function DataGridDemo() {
    // Estado para Autores
    const [autorRows, setAutorRows] = useState<Autores[]>([]);
    const [autorLoading, setAutorLoading] = useState(true);
    const [autorOpen, setAutorOpen] = useState(false);
    const [autorCurrent, setAutorCurrent] = useState<Autores | null>(null);
    const [autorNew, setAutorNew] = useState<Autores>({ pkAutor: 0, nombre: "", nacionalidad: "" });
/**
 * Estados y Hooks de React
Estados con useState:

rows: Almacena los datos de los autores obtenidos de la API.
dataLoaded: Indica si los datos se han cargado completamente.
loading: Controla si se está en proceso de carga de datos.
open, openConfirm, openAdd: Controlan la visibilidad de diversos diálogos (edición, confirmación de eliminación, y adición de nuevos autores).
currentAutor, newAutor, autorToDelete: Almacenan información sobre el autor actualmente seleccionado para editar, los detalles del nuevo autor a agregar y el autor seleccionado para eliminar, respectivamente.
 */
    // Estado para Usuarios
    const [usuarioRows, setUsuarioRows] = useState<Usuario[]>([]);
    const [usuarioLoading, setUsuarioLoading] = useState(true);
    const [usuarioOpen, setUsuarioOpen] = useState(false);
    const [usuarioCurrent, setUsuarioCurrent] = useState<Usuario | null>(null);
    const [usuarioAddOpen, setUsuarioAddOpen] = useState(false);
    const [usuarioNew, setUsuarioNew] = useState<Usuario>({ pkUsuario: 0, nombre: "", user: "", password: "", fkRol: 0, roles: { pkRol: 0, nombre: "" } });

    // Columnas para Autores
    const autorColumns: GridColDef[] = [
        { field: 'pkAutor', headerName: 'ID', width: 70 },
        { field: 'nombre', headerName: 'Nombre', width: 200 },
        { field: 'nacionalidad', headerName: 'Nacionalidad', width: 130 },
        {
            field: 'actions',
            headerName: 'Acciones',
            width: 150,
            renderCell: (params) => (
                <Box display="flex" justifyContent="space-between" width="100%">
                    <Button variant="contained" color="primary" size="small" onClick={() => handleEditAutor(params.row)}>Editar</Button>
                    <Button variant="contained" color="secondary" size="small" onClick={() => handleDeleteAutor(params.row.pkAutor)} style={{ marginLeft: 8 }}>Eliminar</Button>
                </Box>
            ),
        },
    ];

    // Columnas para Usuarios
    const usuarioColumns: GridColDef[] = [
        { field: 'pkUsuario', headerName: 'ID', width: 70 },
        { field: 'nombre', headerName: 'Nombre', width: 200 },
        { field: 'user', headerName: 'Usuario', width: 130 },
        { field: 'password', headerName: 'Contraseña', width: 130 },
        { field: 'fkRol', headerName: 'ID Rol', width: 70 },
        { field: 'roles.nombre', headerName: 'Rol', width: 130 },
        {
            field: 'actions',
            headerName: 'Acciones',
            width: 150,
            renderCell: (params) => (
                <Box display="flex" justifyContent="space-between" width="100%">
                    <Button variant="contained" color="primary" size="small" onClick={() => handleEditUsuario(params.row)}>Editar</Button>
                    <Button variant="contained" color="secondary" size="small" onClick={() => handleDeleteUsuario(params.row.pkUsuario)} style={{ marginLeft: 8 }}>Eliminar</Button>
                </Box>
            ),
        },
    ];

    // Fetch de datos para Autores
    const fetchAutores = async () => {
        try {
            const response = await axios.get('https://localhost:7141/api/Autor');
            const data = response.data.result;
            setAutorRows(data);
            setAutorLoading(false);
        } catch (error) {
            console.error('Error fetching authors:', error);
            setAutorLoading(false);
        }
    };

    // Fetch de datos para Usuarios
/**
 * Funciones de Interacción con la API
fetchData: Realiza una solicitud GET a la API para obtener los datos de los autores y los almacena en el estado rows.
handleDelete: Realiza una solicitud DELETE para eliminar un autor específico basado en su ID y actualiza el estado rows para reflejar los cambios.
handleEdit: Prepara los datos de un autor seleccionado para su edición y abre el diálogo correspondiente.
handleOpenConfirm y handleCloseConfirm: Abren y cierran el diálogo de confirmación para la eliminación de un autor, respectivamente.
 */
    const fetchUsuarios = async () => {
        try {
            const response = await axios.get('https://localhost:7141/Usuario');
            const data = response.data.result;
            setUsuarioRows(data);
            setUsuarioLoading(false);
        } catch (error) {
            console.error('Error fetching users:', error);
            setUsuarioLoading(false);
        }
    };

    // Handlers para Autores
    const handleEditAutor = (autor: Autores) => {
        setAutorCurrent(autor);
        setAutorOpen(true);
    };

    const handleDeleteAutor = async (pkAutor: number) => {
        try {
            await axios.delete(`https://localhost:7141/api/Autor/${pkAutor}`);
            setAutorRows((prevRows) => prevRows.filter((row) => row.pkAutor !== pkAutor));
        } catch (error) {
            console.error('Error deleting author:', error);
        }
    };

    const handleSaveAutor = async () => {
        if (autorCurrent !== null) {
            try {
                await axios.put(`https://localhost:7141/api/Autor/${autorCurrent.pkAutor}`, autorCurrent);
                setAutorRows((prevRows) => prevRows.map((row) => (row.pkAutor === autorCurrent.pkAutor ? autorCurrent : row)));
                setAutorOpen(false);
                setAutorCurrent(null);
            } catch (error) {
                console.error('Error updating author:', error);
            }
        }
    };

    const handleAddAutor = async () => {
        try {
            const response = await axios.post('https://localhost:7141/api/Autor', {
                nombre: autorNew.nombre,
                nacionalidad: autorNew.nacionalidad
            });
            const addedAutor = response.data.result;
            setAutorRows((prevRows) => [...prevRows, addedAutor]);
            setAutorNew({ pkAutor: 0, nombre: "", nacionalidad: "" });
            setAutorOpen(false);
        } catch (error) {
            console.error('Error adding author:', error);
        }
    };

    // Handlers para Usuarios
    const handleEditUsuario = (usuario: Usuario) => {
        setUsuarioCurrent(usuario);
        setUsuarioOpen(true);
    };

    const handleDeleteUsuario = async (pkUsuario: number) => {
        try {
            await axios.delete(`https://localhost:7141/Usuario/${pkUsuario}`);
            setUsuarioRows((prevRows) => prevRows.filter((row) => row.pkUsuario !== pkUsuario));
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    const handleSaveUsuario = async () => {
        if (usuarioCurrent !== null) {
            try {
                await axios.put(`https://localhost:7141/Usuario/${usuarioCurrent.pkUsuario}`, usuarioCurrent);
                setUsuarioRows((prevRows) => prevRows.map((row) => (row.pkUsuario === usuarioCurrent.pkUsuario ? usuarioCurrent : row)));
                setUsuarioOpen(false);
                setUsuarioCurrent(null);
            } catch (error) {
                console.error('Error updating user:', error);
            }
        }
    };

    const handleAddUsuario = async () => {
        try {
            const response = await axios.post('https://localhost:7141/Usuario/CrearUser', {
                nombre: usuarioNew.nombre,
                user: usuarioNew.user,
                password: usuarioNew.password,
                fkRol: usuarioNew.fkRol
            });
            const addedUsuario = response.data.result;
            setUsuarioRows((prevRows) => [...prevRows, addedUsuario]);
            setUsuarioNew({ pkUsuario: 0, nombre: "", user: "", password: "", fkRol: 0, roles: { pkRol: 0, nombre: "" } });
            setUsuarioAddOpen(false);
        } catch (error) {
            console.error('Error adding user:', error);
        }
    };

/**
* Estados y Hooks de React
Estados con useState:

rows: Almacena los datos de los autores obtenidos de la API.
dataLoaded: Indica si los datos se han cargado completamente.
loading: Controla si se está en proceso de carga de datos.
open, openConfirm, openAdd: Controlan la visibilidad de diversos diálogos (edición, confirmación de eliminación, y adición de nuevos autores).
currentAutor, newAutor, autorToDelete: Almacenan información sobre el autor actualmente seleccionado para editar, los detalles del nuevo autor a agregar y el autor seleccionado para eliminar, respectivamente.
     */
    useEffect(() => {
        fetchAutores();
        fetchUsuarios();
    }, []);

    return (
/**
 * Columnas del DataGrid
Define las columnas de la tabla y cómo se deben renderizar, incluyendo botones para editar y eliminar autores.

Funciones de Manejo
fetchData: Carga los datos de los autores desde la API.
handleDelete: Elimina un autor especificado.
handleEdit: Prepara un autor para edición.
handleOpenConfirm: Abre el diálogo de confirmación para eliminar.
handleSave: Guarda los cambios realizados a un autor.
handleAdd: Agrega un nuevo autor a la base de datos.
 */
        <Box sx={{ padding: '2rem', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
            <Paper sx={{ padding: '2rem', backgroundColor: '#fff', boxShadow: 3, marginBottom: '2rem' }}>
                <Typography variant="h4" sx={{ marginBottom: '1rem' }}>Gestión de Autores</Typography>
                {autorLoading ? (
                    <Typography variant="h6" color="error" sx={{ marginBottom: '1rem' }}>Cargando datos...</Typography>
                ) : (
                    <DataGrid
                        rows={autorRows}
                        columns={autorColumns}
                        getRowId={(row) => row.pkAutor}
                        autoHeight
                        sx={{
                            '& .MuiDataGrid-root': {
                                border: 'none',
                            },
                            '& .MuiDataGrid-cell': {
                                borderBottom: '1px solid #e0e0e0',
                            },
                            '& .MuiDataGrid-columnHeaders': {
                                backgroundColor: '#0000',
                                borderBottom: '1px solid #e0e0e0',
                            },
                            '& .MuiDataGrid-columnHeaderTitle': {
                                fontWeight: 'bold',
                                color: '#333',
                            },
                            '& .MuiDataGrid-row': {
                                '&:nth-of-type(odd)': {
                                    backgroundColor: '#fafafa',
                                },
                            },
                            '& .MuiDataGrid-footerContainer': {
                                justifyContent: 'center',
                                padding: '1rem',
                                backgroundColor: '#e0e0e0',
                                borderTop: '1px solid #e0e0e0',
                            },
                        }}
                    />
                )}
                <Button variant="contained" color="primary" sx={{ marginTop: '1rem' }} onClick={() => setAutorOpen(true)}>
                    Agregar Autor
                </Button>
            </Paper>

            <Paper sx={{ padding: '2rem', backgroundColor: '#fff', boxShadow: 3 }}>
                <Typography variant="h4" sx={{ marginBottom: '1rem' }}>Gestión de Usuarios</Typography>
                {usuarioLoading ? (
                    <Typography variant="h6" color="error" sx={{ marginBottom: '1rem' }}>Cargando datos...</Typography>
                ) : (
                    <DataGrid
                        rows={usuarioRows}
                        columns={usuarioColumns}
                        getRowId={(row) => row.pkUsuario}
                        autoHeight
                        sx={{
                            '& .MuiDataGrid-root': {
                                border: 'none',
                            },
                            '& .MuiDataGrid-cell': {
                                borderBottom: '1px solid #e0e0e0',
                            },
                            '& .MuiDataGrid-columnHeaders': {
                                backgroundColor: '#e0e0e0',
                                borderBottom: '1px solid #e0e0e0',
                            },
                            '& .MuiDataGrid-columnHeaderTitle': {
                                fontWeight: 'bold',
                                color: '#333',
                            },
                            '& .MuiDataGrid-row': {
                                '&:nth-of-type(odd)': {
                                    backgroundColor: '#fafafa',
                                },
                            },
                            '& .MuiDataGrid-footerContainer': {
                                justifyContent: 'center',
                                padding: '1rem',
                                backgroundColor: '#e0e0e0',
                                borderTop: '1px solid #e0e0e0',
                            },
                        }}
                    />
                )}
                <Button variant="contained" color="primary" sx={{ marginTop: '1rem' }} onClick={() => setUsuarioAddOpen(true)}>
                    Agregar Usuario
                </Button>
            </Paper>

            <Dialog open={autorOpen} onClose={() => setAutorOpen(false)}>
                <DialogTitle>{autorCurrent ? "Editar Autor" : "Agregar Autor"}</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        label="Nombre"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={autorCurrent ? autorCurrent.nombre : autorNew.nombre}
                        onChange={(e) => autorCurrent ? setAutorCurrent({ ...autorCurrent, nombre: e.target.value }) : setAutorNew({ ...autorNew, nombre: e.target.value })}
                        sx={{ marginBottom: '1rem' }}
                    />
                    <TextField
                        margin="dense"
                        label="Nacionalidad"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={autorCurrent ? autorCurrent.nacionalidad : autorNew.nacionalidad}
                        onChange={(e) => autorCurrent ? setAutorCurrent({ ...autorCurrent, nacionalidad: e.target.value }) : setAutorNew({ ...autorNew, nacionalidad: e.target.value })}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setAutorOpen(false)} color="primary">Cancelar</Button>
                    <Button onClick={autorCurrent ? handleSaveAutor : handleAddAutor} color="primary">{autorCurrent ? "Guardar" : "Agregar"}</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={usuarioOpen} onClose={() => setUsuarioOpen(false)}>
                <DialogTitle>Editar Usuario</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        label="Nombre"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={usuarioCurrent?.nombre || ''}
                        onChange={(e) => setUsuarioCurrent({ ...usuarioCurrent, nombre: e.target.value })}
                        sx={{ marginBottom: '1rem' }}
                    />
                    <TextField
                        margin="dense"
                        label="Usuario"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={usuarioCurrent?.user || ''}
                        onChange={(e) => setUsuarioCurrent({ ...usuarioCurrent, user: e.target.value })}
                        sx={{ marginBottom: '1rem' }}
                    />
                    <TextField
                        margin="dense"
                        label="Contraseña"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={usuarioCurrent?.password || ''}
                        onChange={(e) => setUsuarioCurrent({ ...usuarioCurrent, password: e.target.value })}
                        sx={{ marginBottom: '1rem' }}
                    />
                    <TextField
                        margin="dense"
                        label="ID Rol"
                        type="number"
                        fullWidth
                        variant="outlined"
                        value={usuarioCurrent?.fkRol || 0}
                        onChange={(e) => setUsuarioCurrent({ ...usuarioCurrent, fkRol: parseInt(e.target.value) })}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setUsuarioOpen(false)} color="primary">Cancelar</Button>
                    <Button onClick={handleSaveUsuario} color="primary">Guardar</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={usuarioAddOpen} onClose={() => setUsuarioAddOpen(false)}>
                <DialogTitle>Agregar Usuario</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        label="Nombre"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={usuarioNew.nombre}
                        onChange={(e) => setUsuarioNew({ ...usuarioNew, nombre: e.target.value })}
                        sx={{ marginBottom: '1rem' }}
                    />
                    <TextField
                        margin="dense"
                        label="Usuario"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={usuarioNew.user}
                        onChange={(e) => setUsuarioNew({ ...usuarioNew, user: e.target.value })}
                        sx={{ marginBottom: '1rem' }}
                    />
                    <TextField
                        margin="dense"
                        label="Contraseña"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={usuarioNew.password}
                        onChange={(e) => setUsuarioNew({ ...usuarioNew, password: e.target.value })}
                        sx={{ marginBottom: '1rem' }}
                    />
                    <TextField
                        margin="dense"
                        label="ID Rol"
                        type="number"
                        fullWidth
                        variant="outlined"
                        value={usuarioNew.fkRol}
                        onChange={(e) => setUsuarioNew({ ...usuarioNew, fkRol: parseInt(e.target.value) })}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setUsuarioAddOpen(false)} color="primary">Cancelar</Button>
                    <Button onClick={handleAddUsuario} color="primary">Agregar</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
