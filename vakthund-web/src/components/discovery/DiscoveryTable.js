import React, {useCallback, useMemo, useRef, useState} from "react";
import {Badge, Button, CloseButton} from "react-bootstrap";
import {Link, useSearchParams} from "react-router-dom";
import PingButton from "../PingButton";
import {AgGridReact} from "ag-grid-react";
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import {useUpdateEffect} from "react-use";
import {Input} from "@mui/joy";

const DiscoveryTable = ({lst}) => {
    const gridStyle = useMemo(() => ({height: '500px', width: '100%'}), []);

    const gridRef = useRef();

    const [rowData, setRowData] = useState(lst);

    const [colDefs, setColDefs] = useState([
        {field: "last_updated"},
        {field: "url"},
        {
            field: "Device.name",
            cellRenderer: params => {
                return <Link to={`/?query=${params.data.Device?.name}`}>
                    <Badge bg="primary">{params.data.Device?.name}</Badge>
                </Link>
            }
        },
        {
            field: "tags",
            cellRenderer: params => {
                return params.data.tags?.split(",").map(tag => <Link to={`/?query=${tag}`}><Badge
                    bg="secondary" className={"me-1"}>{tag}</Badge></Link>)
            }
        },
        {
            field: "",
            cellRenderer: params => {
                return <>
                    <PingButton url={params.data.url}/>
                    <Link to={`/discovery/${params.data.id}`}><Button size={"sm"} variant="secondary"
                                                                      className="bg-gradient">Details</Button></Link>
                </>
            }
        }
    ]);

    const defaultColDef = useMemo(() => {
        return {
            flex: 1,
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
        <div className="example-wrapper">
            <div className="example-header mb-1 w-100">
                <Input size={"md"} className={"d-inline-block"} sx={{"width": "256"}}
                       id="filter-text-box"
                       autoComplete={"off"}
                       placeholder="Filter"
                       onInput={onFilterTextBoxChanged}
                />
                <CloseButton style={{verticalAlign: "text-top"}} className={"mx-1"} onClick={() => {
                    updateFilterTextBox(null)
                }}/>
                <h4 style={{"display": "inline", "position": "absolute", "right": "30px"}}>Discoveries</h4>
            </div>
            <div style={gridStyle} className="ag-theme-quartz">
                <AgGridReact
                    ref={gridRef}
                    rowData={rowData}
                    columnDefs={colDefs}
                    defaultColDef={defaultColDef}
                    pagination={true}
                    paginationAutoPageSize={true}
                    onGridReady={() => updateFilterTextBox(getQuery())}
                />
            </div>
        </div>
    );
};

export default DiscoveryTable;
