import * as React from 'react';
import {Link} from "react-router-dom";
import {Button, Typography} from "@mui/joy";
import Box from "@mui/material/Box";

function ErrorNotFound() {
    return (
        <Box sx={{ textAlign: 'center', m: 3 }}>
            <Typography level="h2">404 Not Found</Typography>
            <Link to="/">
                <Button
                    sx={{
                        backgroundColor: '#b45b35',
                        mx: 2,
                        '&:hover': {
                            backgroundColor: '#a04d2e'
                        }
                    }}
                >
                    Home page
                </Button>
            </Link>
        </Box>
    );
}

export default ErrorNotFound;
