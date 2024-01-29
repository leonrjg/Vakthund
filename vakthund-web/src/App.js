import {Container, Nav, Navbar} from "react-bootstrap";
import DiscoveryList from "./components/discovery/DiscoveryList";
import {Link, Route, Routes} from "react-router-dom";
import Discovery from "./components/discovery/Discovery";
import ErrorNotFound from "./components/ErrorNotFound";
import Footer from "./components/Footer";
import Devices from "./components/device/Devices";
import Settings from "./components/Settings";
import ManageDevice from "./components/device/ManageDevice";
import ManageAction from "./components/device/ManageAction";

function App() {
    return (
        <div className="font color-body">
            <Navbar className={"bg-dark bg-gradient"} variant="dark" expand="lg">
                <Container fluid>
                    <Navbar.Brand as={Link} to="/">Vakthund</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ml-auto">
                            <Nav.Link as={Link} to="/devices">Devices</Nav.Link>
                            <Nav.Link as={Link} to="/settings" className="float-right">Settings</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <div style={{margin: "30px"}}>
                <Container fluid className="mt-3 bg-body container-bordered card shadow"
                           style={{marginBottom: "100px"}}>
                    <div className="margin">
                        <Routes>
                            <Route path="/discovery/:id" element={<Discovery/>}/>
                            <Route path="/devices" element={<Devices/>}/>
                            <Route path="/devices/:id" element={<ManageDevice/>}/>
                            <Route path="/devices/new" element={<ManageDevice/>}/>
                            <Route path="/devices/actions/:id" element={<ManageAction/>}/>
                            <Route path="/devices/actions/new" element={<ManageAction/>}/>
                            <Route path="/settings" element={<Settings/>}/>
                            <Route path="/" element={<DiscoveryList/>}/>
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
