import "./probes.css"
import React, { useState, useEffect } from "react";
import { DataGrid, GridToolbar, GridActionsCellItem } from "@mui/x-data-grid";
import TextField from '@mui/material/TextField';
import UpdateIcon from '@mui/icons-material/Update';
import ListIcon from '@mui/icons-material/List';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';
import MuiAlert from '@mui/material/Alert';
import Snackbar from "@mui/material/Snackbar";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { Button, Chip, Paper, autocompleteClasses } from "@mui/material";

const Probes = () => {

    const Alert = React.forwardRef(function Alert(props, ref) {
        return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
    })

    const [open, setOpen] = useState(false);
    const [severity, setSeverity] = useState('');
    const [loading, setLoading] = useState(false);
    const [probes, setProbes]  = useState([]);
    const [message, setMessage] = useState('');
    const [showDeviceList, setShowDeviceList] = useState(false);
    const [deviceData, setDeviceData] = useState([]);
    const [showInputPage, setShowInputPage] = useState(false);
    const [dest, setDest] = useState('');
    const [targetIP, setTargetIP] = useState('');

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    const handleInput = (event) => {
        setDest(event.target.value);
    };

    // Probes Info and Settings
    const getProbes = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/raspberries`);
            const jsonProbes = await response.json();

            setProbes(jsonProbes);
        }  catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        getProbes();
    }, []);

    const showProbes = (id) => {
        setShowDeviceList(true);
    };

    const changeDestIP = (targetIP) => {
        setTargetIP(targetIP);
        setShowInputPage(true);
    };

    const handleResponse = (status) => {
        if (status === 200) {
            setSeverity('success');
            setMessage('Update request sent');
        }
        else {
            setSeverity('error');
            setMessage('An error occurred');
        }
    };

    const sendUpdateDestinationRequest = async (new_ip) => {
        try{
            setShowInputPage(false);
            setLoading(true);
            const response = await fetch(`http://localhost:8080/api/update-dest-ping/${new_ip}`);
            handleResponse(response.status);
        } catch (err) {
            handleResponse(-1);
            console.error(err);
        }
        setLoading(false);
        setOpen(true);
    };

    const updateEvents = async (id) => {
        try {
            setLoading(true);
            const response = await fetch(`http://localhost:8080/api/events/update/${id}`);
            handleResponse(response.status);
        } catch (err) {
            handleResponse(-1);
            console.error(err);
        }
        setLoading(false);
        setOpen(true);
    };

    const columns = [
        {field: 'id_pi', headerName: 'ID', headerAlign: 'center', align: 'center', flex: 1},
        {field: 'ip', headerName: 'IP Address', headerAlign: 'center', align: 'center', flex: 1},
        {field: 'model', headerName: 'Model', headerAlign: 'center', align: 'center', flex: 1},
        {field: 'location', headerName: 'Location', headerAlign: 'center',align: 'center',  flex: 1},
        {field: 'destination_ping', headerName: 'Ping Dest. Address', headerAlign: 'center', align: 'center', maxWidth: 200, flex: 1},
        {
            field: 'update',
            type: 'actions',
            headerName: 'Update',
            width: 80,
            getActions: (params) => [
                <GridActionsCellItem
                icon={<UpdateIcon />}
                label="Update"
                onClick={ () => updateEvents(params.row.ip)}
                sx={{color: 'black'}}
                />
            ]
        },
        /*{
            field: 'list',
            type: 'actions',
            headerName: 'List Data',
            width: 100,
            getActions: (params) => [
                <GridActionsCellItem
                icon={<ListIcon />}
                label="List"
                onClick={ () => showData(params.row.id_pi)}
                sx={{color: 'black'}}
                />
            ]
        },*/
        {
            field: 'update_dest_ping',
            type: 'actions',
            headerName: 'Change Ping Dest. Address',
            flex: 1,
            getActions: (params) => [
                <GridActionsCellItem
                icon={<GpsFixedIcon />}
                label="Destination"
                onClick={ () => changeDestIP(params.row.ip) }
                sx={{color: 'black'}}
                />
            ]
        },
    ];

    return (
        <div className="probes">
            <DataGrid
                autoHeight
                rows={probes}
                columns={columns}
                id="_id"
                components={{Toolbar: GridToolbar}}
                getRowId={(row) => (row.id_pi + row.creation_date) }
                sx={{ 
                    '& .css-1knaqv7-MuiButtonBase-root-MuiButton-root': {
                        color: '#343434',
                    },
                    '& .css-1j9kmqg-MuiDataGrid-toolbarContainer': {
                        marginLeft: 'auto',
                        marginRight: 0
                    },
                    '& .MuiDataGrid-columnHeader': {
                        fontSize: '1vw',
                    },
                    '& .MuiDataGrid-cell': {
                        fontSize: '1vw',
                    }
                }}
            />

            <Snackbar anchorOrigin={{vertical:'top', horizontal:'center'}} open={open} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
                    {message}
                </Alert>
            </Snackbar>

            <Backdrop // backdrop for the update button
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={loading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
    
            {/*<Backdrop // backdrop for the device datagrid
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1, padding: '30px', verticalAlign: 'middle'}}
                open={showDeviceList}
            >
                <DataGrid
                    rows={deviceData}
                    columns={deviceData}
                    id="_id"
                    components={{Toolbar: GridToolbar}}
                    getRowId={(row) => ((row.id_pi + row.creation_date)) }
                    sx={{backgroundColor: '#fff'}}
                />
                <Button 
                sx={{
                    color: '#000',
                    backgroundColor: '#fff',
                    marginLeft: '5px',
                    marginRight: '5px',
                }}
                variant="Contained" 
                onClick={() => {
                    setShowDeviceList(false)
                    setDeviceData([])
                }
                }>Close</Button>
            </Backdrop>*/}
            <Backdrop
                open={showInputPage}
            >
                <Paper elevation={24} sx={{padding: '16px'}}>
                    <TextField 
                    id="outlined-required" 
                    label="New Destination Address"
                    value={dest}
                    onChange={handleInput}
                    sx={{padding: '10px'}}
                    />
                    <div>
                        <Button
                            onClick={() => {
                                sendUpdateDestinationRequest(dest);
                            }}
                        >
                        Update</Button>
                        <Button
                            onClick={() => {
                                setShowInputPage(false);
                            }}
                        >Cancel</Button>
                    </div>
                </Paper>
            </Backdrop>
        </div>
    );
};

export default Probes;