import React, {useCallback, useMemo, useRef, useState} from "react";
import {Badge} from "react-bootstrap";
import {Link, useSearchParams} from "react-router-dom";
import PingButton from "../PingButton";
import {AgGridReact} from "ag-grid-react";
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import {useUpdateEffect} from "react-use";
import {Button, Grid, Input} from "@mui/joy";
import {Clear} from "@mui/icons-material";

const DiscoveryTable = ({lst}) => {
    const gridStyle = useMemo(() => ({height: '500px', width: '100%'}), []);

    const gridRef = useRef();

    const [rowData, setRowData] = useState(lst);

    const [colDefs, setColDefs] = useState([
        {field: "last_updated", sort: "desc", minWidth: 100},
        {field: "url", minWidth: 200},
        {
            field: "Device.name",
            minWidth: 100,
            cellRenderer: params => {
                return <Link to={`/?query=${params.data.Device?.name}`}>
                    <Badge bg="primary">{params.data.Device?.name}</Badge>
                </Link>
            }
        },
        {
            field: "tags",
            minWidth: 100,
            cellRenderer: params => {
                return params.data.tags?.split(",").map(tag => <Link to={`/?query=${tag}`}><Badge
                    bg="secondary" className={"me-1"}>{tag}</Badge></Link>)
            }
        },
        {
            field: "",
            minWidth: 250,
            cellRenderer: params => {
                return <>
                    <PingButton url={params.data.url}/>
                    <Link to={`/discovery/${params.data.id}`}><Button size="sm" color="neutral"
                                                                      className="bg-gradient">Details</Button></Link>
                </>
            }
        }
    ]);

    const defaultColDef = useMemo(() => {
        return {
            resizable: true
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
        <div>
            <div className="mb-1">
                <Grid container spacing={2} sx={{ flexGrow: 1 }}>
                    <Grid item md={10}>
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
                    <Grid item md={2}>
                        <center><h4 className={"text-nowrap float-end"}>Discoveries</h4></center>
                    </Grid>
                </Grid>
            </div>
            <div style={gridStyle} className="ag-theme-quartz my-3">
                <AgGridReact
                    ref={gridRef}
                    rowData={rowData}
                    columnDefs={colDefs}
                    defaultColDef={defaultColDef}
                    pagination={true}
                    paginationSize={50}
                    autoSizeStrategy={{
                        type: 'fitGridWidth'
                    }}
                    enableCellTextSelection="true"
                    onGridReady={() => updateFilterTextBox(getQuery())}
                />
            </div>
        </div>
    );
};

export default DiscoveryTable;
