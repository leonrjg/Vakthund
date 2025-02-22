import Home from "./components/discovery/Home";
import {Route, Routes} from "react-router-dom";
import View from "./components/discovery/View";
import ErrorNotFound from "./components/ErrorNotFound";
import Footer from "./components/Footer";
import Devices from "./components/device/Devices";
import Settings from "./components/Settings";
import ManageDevice from "./components/device/ManageDevice";
import ManageAction from "./components/device/ManageAction";
import ManageDiscovery from "./components/discovery/Manage";
import Navbar from "./Navbar";
import Container from "@mui/material/Container";

function App() {
    return (
        <div className="font color-body">
            <Navbar />
            <div style={{margin: "30px"}}>
                <Container maxWidth={false} className="mt-3 bg-body container-bordered card shadow"
                           style={{marginBottom: "50px", minWidth: "250px", height: "100%"}}>
                    <div className="margin">
                        <Routes>
                            <Route path="/discovery/:id" element={<View/>}/>
                            <Route path="/discovery/new" element={<ManageDiscovery/>}/>
                            <Route path="/devices" element={<Devices/>}/>
                            <Route path="/devices/:id" element={<ManageDevice/>}/>
                            <Route path="/devices/new" element={<ManageDevice/>}/>
                            <Route path="/devices/actions/:id" element={<ManageAction/>}/>
                            <Route path="/devices/actions/new" element={<ManageAction/>}/>
                            <Route path="/settings" element={<Settings/>}/>
                            <Route path="/" element={<Home/>}/>
                            <Route path="*" element={<ErrorNotFound/>}/>
                        </Routes>
                    </div>
                </Container>
            </div>
            <Footer/>
        </div>
    );
}

export default App;
