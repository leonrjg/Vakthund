import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { getSystemLogs, getActionLogs } from "../redux/actions/Actions";
import { Button, Card, Chip, Tab, TabList, TabPanel, Tabs, Table, Typography } from "@mui/joy";
import { SCAN_RUN_URL, NEXT_SCAN_URL } from "../redux/types/Types";
import Box from "@mui/material/Box";
import OutputCard from "./OutputCard";

function Logs() {
    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();
    const [activeTab, setActiveTab] = useState(0);
    const [scanOutput, setScanOutput] = useState("");
    const [isScanning, setIsScanning] = useState(false);
    const [nextScanDate, setNextScanDate] = useState(null);

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
        fetchNextScanDate();
    }, []);

    const fetchNextScanDate = async () => {
        try {
            const response = await fetch(NEXT_SCAN_URL);
            const data = await response.json();
            setNextScanDate(data.nextRun);
        } catch (error) {
            console.error('Failed to fetch next scan date:', error);
        }
    };

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
            // Refresh logs and next scan date after scan completes
            dispatch(getSystemLogs());
            fetchNextScanDate();
        }
    };

    const formatDate = (dateString) => {
        let date = new Date(dateString);
        return `${date.toDateString()}, ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
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
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box>
                    <Typography level="h2" sx={{ m: 0 }}>Logs</Typography>
                    {nextScanDate && (
                        <Typography level="body-sm" sx={{ mt: 0.5, color: 'text.secondary' }}>
                            Next scheduled scan: {formatDate(nextScanDate)}
                        </Typography>
                    )}
                </Box>
                <Button
                    color="success"
                    onClick={runScan}
                    disabled={isScanning}
                >
                    {isScanning ? "Scanning..." : "Run Scan"}
                </Button>
            </Box>

            <Tabs value={activeTab} onChange={(e, val) => setActiveTab(val)}>
                <TabList>
                    <Tab>System Logs</Tab>
                    <Tab>Action Logs</Tab>
                </TabList>

                <TabPanel value={0}>
                    {/* Live scan output panel */}
                    {(isScanning || scanOutput) && (
                        <OutputCard
                            output={scanOutput || "Starting scan..."}
                            sx={{ mb: 3, maxHeight: '300px' }}
                        />
                    )}

                    {/* System logs table */}
                    <Table borderAxis="both" hoverRow sx={{ textAlign: 'center', mt: 0, '& th': { py: 0.1, px: 0.5 }, '& td': { py: 0.1, px: 0.5 } }}>
                        <thead>
                            <tr>
                                <th style={{ width: '25%', textAlign: 'center' }}>Date</th>
                                <th style={{ width: '25%', textAlign: 'center' }}>Type</th>
                                <th style={{ width: '25%', textAlign: 'center' }}>Status</th>
                                <th style={{ width: '25%', textAlign: 'center' }}>Log</th>
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
                    </Table>
                </TabPanel>

                <TabPanel value={1}>
                    <Table borderAxis="both" hoverRow sx={{ textAlign: 'center', mt: 0, '& th': { py: 0.1, px: 1 }, '& td': { py: 0.1, px: 1 } }}>
                        <thead>
                            <tr>
                                <th style={{ width: '16.66%', textAlign: 'center' }}>Date</th>
                                <th style={{ width: '16.66%', textAlign: 'center' }}>Action</th>
                                <th style={{ width: '16.66%', textAlign: 'center' }}>Device</th>
                                <th style={{ width: '16.66%', textAlign: 'center' }}>Discovery</th>
                                <th style={{ width: '16.66%', textAlign: 'center' }}>Result</th>
                                <th style={{ width: '16.66%', textAlign: 'center' }}>Log</th>
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
                    </Table>
                </TabPanel>
            </Tabs>
        </Box>
    );
}

export default Logs;
