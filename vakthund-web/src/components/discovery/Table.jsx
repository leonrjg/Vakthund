import React, {useCallback, useMemo, useRef, useState} from "react";
import {Link, useSearchParams} from "react-router-dom";
import PingButton from "../PingButton";
import {AgGridReact} from "ag-grid-react";
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import {useUpdateEffect} from "react-use";
import {Button, Chip, Grid, Input} from "@mui/joy";
import {Clear} from "@mui/icons-material";
import Box from "@mui/material/Box";

const Table = ({lst}) => {
    const containerStyle = useMemo(() => ({ width: "100%", height: "72vh", marginBottom: "8vh" }), []);
    const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);

    const gridRef = useRef();

    const [rowData, setRowData] = useState(lst);

    const [colDefs, setColDefs] = useState([
        {
            field: "last_updated",
            sort: "desc",
            minWidth: 100,
            flex: 1
        },
        {
            field: "url",
            minWidth: 200,
            flex: 2
        },
        {
            field: "Device.name",
            cellRenderer: params => {
                return <Link to={`/?query=${params.data.Device?.name}`}>
                    <Chip color={"primary"}>{params.data.Device?.name}</Chip>
                </Link>
            },
            flex: 1
        },
        {
            field: "tags",
            minWidth: 100,
            cellRenderer: params => {
                return params.data.tags?.split(",").map(tag => <Link to={`/?query=${tag}`}><Chip color={"neutral"} className={"me-1"}>{tag}</Chip></Link>)
            },
            flex: 3
        },
        {
            field: "",
            cellRenderer: params => {
                return <>
                    <Box>
                    <PingButton url={params.data.url}/>
                    <Link to={`/discovery/${params.data.id}`}>
                        <Button size="sm" color="neutral" className="bg-gradient">Details</Button>
                    </Link>
                    </Box>
                </>
            },
            flex: 1
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
        <div style={containerStyle}>
            <div className="mb-1">
                <Grid container spacing={2} sx={{ flexGrow: 1 }}>
                    <Grid item md={9}>
                        <Input size="md" className={"float-start"} style={{"maxWidth": "100%"}}
                               id="filter-text-box"
                               autoComplete={"off"}
                               placeholder="Filter"
                               onInput={onFilterTextBoxChanged}
                               startDecorator={<Button variant="soft" color="neutral" startDecorator={<Clear/>} onClick={() => {
                                   updateFilterTextBox(null)
                               }}></Button>}
                        />
                    </Grid>
                    <Grid item md={3}>
                        <Link as={Link} to="/discovery/new"><Button className="d-inline float-end" variant="solid">+ Add manual discovery</Button></Link>
                    </Grid>
                </Grid>
            </div>
            <div style={gridStyle} className="ag-theme-quartz my-3">
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
            </div>
        </div>
    );
};

export default Table;
