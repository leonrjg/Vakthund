import * as React from 'react';
import timeout from "../Utils";
import {Button} from "@mui/joy";
import {MonitorHeart} from "@mui/icons-material";

const ping = async (url) => {
    return await timeout(3000, fetch(url, {mode: "no-cors", referrerPolicy: "no-referrer"}))
        .then((response) => {
            return !!response;
        })
        .catch((error) => {
            console.log(error);
            return false;
        })
}

class PingButton extends React.Component {
    constructor(props) {
        super(props)
        this.props = props;
        this.state = {pingText: <MonitorHeart fontSize="medium" />, success: null, pinging: false}
    }

    render() {
        return (
            <Button
                size="sm"
                variant="soft"
                sx={{
                    minWidth: 'auto',
                    ...this.props.sx,
                    ...(this.state.pinging && {
                        opacity: 0.5,
                        pointerEvents: 'none'
                    })
                }}
                onClick={async () => {
                    this.setState({pingText: "...", pinging: true});
                    let isSuccess = await ping(this.props.url);
                    this.setState({pingText: isSuccess ? "Online" : "Offline", success: isSuccess, pinging: false});
                }}
                color={this.state.success ? "success" : "neutral"}>
                {this.state.pingText}
            </Button>
        )
    }
}

export default PingButton;