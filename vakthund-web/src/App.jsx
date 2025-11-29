import Home from "./components/discovery/Home";
import {Route, Routes} from "react-router-dom";
import View from "./components/discovery/View";
import ErrorNotFound from "./components/ErrorNotFound";
import Footer from "./components/Footer";
import Devices from "./components/device/Devices";
import Settings from "./components/Settings";
import Logs from "./components/Logs";
import ManageDevice from "./components/device/ManageDevice";
import ManageAction from "./components/device/ManageAction";
import ManageDiscovery from "./components/discovery/Manage";
import Navbar from "./Navbar";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";

function App() {
    return (
        <Box className="font color-body" sx={{ bgcolor: 'background.body', minHeight: '100vh' }}>
            <Navbar />
            <Box sx={{ p: '30px' }}>
                <Container
                    maxWidth={false}
                    className="container-bordered"
                    sx={{
                        bgcolor: 'white',
                        boxShadow: 1,
                        mb: '50px',
                        minWidth: '250px',
                        borderRadius: '5px',
                        p: 3
                    }}
                >
                    <Routes>
                            <Route path="/discovery/:id" element={<View/>}/>
                            <Route path="/discovery/new" element={<ManageDiscovery/>}/>
                            <Route path="/devices" element={<Devices/>}/>
                            <Route path="/devices/:id" element={<ManageDevice/>}/>
                            <Route path="/devices/new" element={<ManageDevice/>}/>
                            <Route path="/devices/actions/:id" element={<ManageAction/>}/>
                            <Route path="/devices/actions/new" element={<ManageAction/>}/>
                            <Route path="/settings" element={<Settings/>}/>
                            <Route path="/logs" element={<Logs/>}/>
                            <Route path="/" element={<Home/>}/>
                            <Route path="*" element={<ErrorNotFound/>}/>
                    </Routes>
                </Container>
            </Box>
            <Footer/>
        </Box>
    );
}

export default App;
