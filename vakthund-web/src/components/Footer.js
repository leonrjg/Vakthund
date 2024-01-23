import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import {StarBorder} from "@mui/icons-material";

const Footer = () => (
    <footer className="footer mt-auto py-3 bg-dark" style={{color: '#fff'}}>
        <Container fluid={true}>
            <Row>
                <Col>
                    <a href={"https://github.com/leonrjg/Vakthund"} target="_blank" style={{textDecoration: "none", color: "white"}} rel="noreferrer">
                        <StarBorder/> Star on GitHub
                    </a>
                </Col>
            </Row>
        </Container>
    </footer>
);

export default React.memo(Footer);