import React, {useCallback, useMemo, useRef, useState} from "react";
import {Link, useSearchParams} from "react-router-dom";
import PingButton from "../PingButton";
import {AgGridReact} from "ag-grid-react";
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import {useUpdateEffect} from "react-use";
import {Button, ButtonGroup, Chip, Input} from "@mui/joy";
import Grid from "@mui/material/Grid";
import {Clear, InfoOutlined} from "@mui/icons-material";
import Box from "@mui/material/Box";

const Table = ({lst}) => {
    const containerStyle = useMemo(() => ({ width: '100%', height: '72vh', marginBottom: '8vh' }), []);
    const gridStyle = useMemo(() => ({ height: '100%', width: '100%' }), []);

    const gridRef = useRef();

    const [rowData, setRowData] = useState(lst);

    const [colDefs, setColDefs] = useState([
        {
            field: "last_updated",
            sort: "desc",
            minWidth: 150,
            flex: 2,
            wrapText: false,
            autoHeight: false
        },
        {
            field: "url",
            minWidth: 150,
            flex: 3,
            wrapText: false,
            autoHeight: false
        },
        {
            field: "Device.name",
            cellRenderer: params => {
                return <Link to={`/?query=${params.data.Device?.name}`}>
                    <Chip color={"primary"}>{params.data.Device?.name}</Chip>
                </Link>
            },
            minWidth: 120,
            flex: 2,
            wrapText: false,
            autoHeight: false
        },
        {
            field: "tags",
            minWidth: 200,
            cellRenderer: params => {
                return params.data.tags?.split(",").map(tag => <Link to={`/?query=${tag}`}><Chip color={"neutral"} sx={{ mr: 1 }}>{tag}</Chip></Link>)
            },
            flex: 3,
            wrapText: false,
            autoHeight: false
        },
        {
            field: "Toolbar",
            cellRenderer: params => {
                return (
                    <Box sx={{ display: 'flex', alignItems: 'stretch', justifyContent: 'center', height: '100%' }}>
                        <ButtonGroup variant="soft" size="sm" sx={{ '& > a': { display: 'contents' }, '& button': { height: '100%', border: '1px solid', borderColor: 'neutral.300' } }}>
                            <Link to={`/discovery/${params.data.id}`} style={{ display: 'contents' }}>
                                <Button size="sm" color="neutral"><InfoOutlined /></Button>
                            </Link>
                            <PingButton url={params.data.url}/>
                        </ButtonGroup>
                    </Box>
                )
            },
            cellStyle: { display: 'flex', alignItems: 'center', justifyContent: 'center' },
            minWidth: 180,
            flex: 2,
            wrapText: false,
            autoHeight: false
        }
    ]);

    const defaultColDef = useMemo(() => {
        return {
            resizable: true,
        };
    }, []);

    const [searchParams] = useSearchParams();

    const getQuery = () => {
        return searchParams.get("query");
    }

    const getFilterTextBox = () => {
        return document.getElementById('filter-text-box');
    }

    const onFilterTextBoxChanged = useCallback(() => {
        gridRef.current.api.setGridOption(
            'quickFilterText',
            getFilterTextBox().value
        );
    }, []);

    const updateFilterTextBox = (value) => {
        getFilterTextBox().value = value !== undefined ? value : getQuery();
        onFilterTextBoxChanged();
    }

    useUpdateEffect(() => {
        updateFilterTextBox();
    }, [getQuery()]);

    return (
        <Box sx={containerStyle}>
            <Box sx={{ mb: 1 }}>
                <Grid container spacing={2} sx={{ flexGrow: 1 }}>
                    <Grid item md={9}>
                        <Input size="md" sx={{ width: '100%' }}
                               id="filter-text-box"
                               autoComplete="off"
                               placeholder="Filter"
                               onInput={onFilterTextBoxChanged}
                               startDecorator={<Button variant="soft" color="neutral" startDecorator={<Clear/>} onClick={() => {
                                   updateFilterTextBox(null)
                               }}></Button>}
                        />
                    </Grid>
                    <Grid item md={3}>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Link to="/discovery/new"><Button variant="solid">+ Add manual discovery</Button></Link>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
            <Box sx={{ ...gridStyle, my: 3 }} className="ag-theme-quartz">
                <AgGridReact
                    ref={gridRef}
                    rowData={rowData}
                    columnDefs={colDefs}
                    defaultColDef={defaultColDef}
                    autoSizeStrategy={{
                        type: 'fitGridWidth'
                    }}
                    pagination={true}
                    paginationAutoPageSize={true}
                    enableCellTextSelection="true"
                    onGridReady={() => updateFilterTextBox(getQuery())}
                />
            </Box>
        </Box>
    );
};

export default Table;
