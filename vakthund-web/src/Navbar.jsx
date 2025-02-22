import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import {StarBorder} from "@mui/icons-material";
import {Link} from "react-router-dom";

const pages = ['Devices', 'Settings'];

function ResponsiveAppBar() {
    const [anchorElNav, setAnchorElNav] = React.useState(null);

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    return (
        <AppBar position="static" color={"default"} sx={{"backgroundColor": "#414141"}}>
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <Link to={"/"} style={{textDecoration: "none", color: "unset"}}>
                    <img src="/public/vakthund.svg" style={{"width":"30px", "mix-blend-mode": "softlight", "vertical-align": "top"}} />
                    <Typography
                        variant="h6"
                        noWrap
                        sx={{
                            mr: 2,
                            display: "inline",
                            fontWeight: 700,
                            letterSpacing: '.1rem',
                            marginLeft: '4px',
                            color: 'white',
                            textDecoration: 'none',
                            fontFamily: 'unset'
                        }}>Vakthund</Typography>
                    </Link>

                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                        {pages.map((page) => (
                            <Link to={"/" + page.toLowerCase()} key={page} style={{textDecoration: "none", color: "unset"}}>
                            <Button
                                key={page}
                                onClick={handleCloseNavMenu}
                                sx={{ my: 2, marginRight: 4, color: 'white', display: 'block', fontFamily: 'unset', fontSize: 'unset', margin: 0 }}
                            >{page}
                            </Button></Link>
                        ))}
                    </Box>
                    <Box sx={{flexGrow: 0}}>
                        <a href={"https://github.com/leonrjg/Vakthund"} target="_blank"
                           style={{textDecoration: "none", color: "white"}} rel="noreferrer">
                            <StarBorder sx={{verticalAlign: "sub"}}/> Star on GitHub
                        </a>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}

export default ResponsiveAppBar;