import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { getSystemLogs, getActionLogs } from "../redux/actions/Actions";
import { Button, Card, Chip, Tab, TabList, TabPanel, Tabs } from "@mui/joy";
import { SCAN_RUN_URL } from "../redux/types/Types";

function Logs() {
    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();
    const [activeTab, setActiveTab] = useState(0);
    const [scanOutput, setScanOutput] = useState("");
    const [isScanning, setIsScanning] = useState(false);

    const systemLogs = useSelector((state) => state.systemLogs) || [];
    const actionLogs = useSelector((state) => state.actionLogs) || [];

    // Check if we should start a scan (navigated from Settings with scan=true)
    useEffect(() => {
        if (searchParams.get("scan") === "true") {
            runScan();
        }
    }, [searchParams]);

    useEffect(() => {
        dispatch(getSystemLogs());
        dispatch(getActionLogs());
    }, []);

    const runScan = async () => {
        if (isScanning) return;

        setIsScanning(true);
        setScanOutput("");
        setActiveTab(0); // Switch to System Logs tab

        try {
            // Use fetch with streaming for POST request
            const response = await fetch(SCAN_RUN_URL, {
                method: 'POST',
                headers: {
                    'Accept': 'text/event-stream',
                },
            });

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let output = "";

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value);
                // Parse SSE format: "data: ...\n\n"
                const lines = chunk.split('\n');
                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        try {
                            const data = JSON.parse(line.substring(6));
                            if (data.error) {
                                output += `Error: ${data.error}\n`;
                            } else {
                                output += data + "\n";
                            }
                            setScanOutput(output);
                        } catch (e) {
                            // Ignore parse errors for incomplete chunks
                        }
                    }
                }
            }
        } catch (error) {
            setScanOutput(prev => prev + `\nError: ${error.message}`);
        } finally {
            setIsScanning(false);
            // Refresh logs after scan completes
            dispatch(getSystemLogs());
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString();
    };

    const getStatusChip = (execution) => {
        if (execution.status === "running") {
            return <Chip color="warning">RUNNING</Chip>;
        }
        return execution.success ?
            <Chip color="success">SUCCESS</Chip> :
            <Chip color="danger">FAILED</Chip>;
    };

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="d-inline m-0">Logs</h2>
                <Button
                    color="success"
                    onClick={runScan}
                    disabled={isScanning}
                >
                    {isScanning ? "Scanning..." : "Run Scan"}
                </Button>
            </div>

            <Tabs value={activeTab} onChange={(e, val) => setActiveTab(val)}>
                <TabList>
                    <Tab>System Logs</Tab>
                    <Tab>Action Logs</Tab>
                </TabList>

                <TabPanel value={0}>
                    {/* Live scan output panel */}
                    {(isScanning || scanOutput) && (
                        <Card className="bg-dark text-white-50 mb-3 overflow-auto display-flex flex-column-reverse" style={{ maxHeight: "300px" }}>
                            <p style={{ whiteSpace: "pre-line", margin: 0, fontFamily: "monospace" }}>
                                {scanOutput || "Starting scan..."}
                            </p>
                        </Card>
                    )}

                    {/* System logs table */}
                    <Card className="shadow">
                    <table className="table w-100 mb-0 text-center" style={{ tableLayout: 'fixed' }}>
                        <thead>
                            <tr>
                                <th style={{ width: '25%' }}>Date</th>
                                <th style={{ width: '25%' }}>Type</th>
                                <th style={{ width: '25%' }}>Status</th>
                                <th style={{ width: '25%' }}>Log</th>
                            </tr>
                        </thead>
                        <tbody>
                            {systemLogs.length === 0 ? (
                                <tr>
                                    <td colSpan={4} style={{textAlign: "center"}}>No system logs yet. Run a scan to see logs here.</td>
                                </tr>
                            ) : (
                                systemLogs.map((execution) => (
                                    <tr key={execution.id}>
                                        <td>{formatDate(execution.execution_date)}</td>
                                        <td><Chip variant="outlined">Scan</Chip></td>
                                        <td>{getStatusChip(execution)}</td>
                                        <td>
                                            <Button
                                                color="neutral"
                                                disabled={!execution.result}
                                                onClick={() => window.open(
                                                    window.URL.createObjectURL(
                                                        new Blob([execution.result], { type: "text/plain;charset=utf8" })
                                                    )
                                                )}
                                            >
                                                View log
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                    </Card>
                </TabPanel>

                <TabPanel value={1}>
                    <Card className="shadow">
                    <table className="table w-100 mb-0 text-center" style={{ tableLayout: 'fixed' }}>
                        <thead>
                            <tr>
                                <th style={{ width: '16.66%' }}>Date</th>
                                <th style={{ width: '16.66%' }}>Action</th>
                                <th style={{ width: '16.66%' }}>Device</th>
                                <th style={{ width: '16.66%' }}>Discovery</th>
                                <th style={{ width: '16.66%' }}>Result</th>
                                <th style={{ width: '16.66%' }}>Log</th>
                            </tr>
                        </thead>
                        <tbody>
                            {actionLogs.length === 0 ? (
                                <tr>
                                    <td colSpan={6} style={{textAlign: "center"}}>No action logs yet.</td>
                                </tr>
                            ) : (
                                actionLogs.map((execution) => (
                                    <tr key={execution.id}>
                                        <td>{formatDate(execution.execution_date)}</td>
                                        <td>{execution.Action?.title || "N/A"}</td>
                                        <td>
                                            {execution.Action?.Device?.name ? (
                                                <Chip color="primary">{execution.Action.Device.name}</Chip>
                                            ) : "N/A"}
                                        </td>
                                        <td>{execution.Discovery?.url || execution.Discovery?.ip || "N/A"}</td>
                                        <td>{getStatusChip(execution)}</td>
                                        <td>
                                            <Button
                                                color="neutral"
                                                disabled={!execution.result}
                                                onClick={() => window.open(
                                                    window.URL.createObjectURL(
                                                        new Blob([execution.result], { type: "text/plain;charset=utf8" })
                                                    )
                                                )}
                                            >
                                                View log
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                    </Card>
                </TabPanel>
            </Tabs>
        </div>
    );
}

export default Logs;
