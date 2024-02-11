import React from "react";
import timeout from "../Utils";
import {Button} from "@mui/joy";

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
        this.state = {pingText: "Healthcheck", success: null, pinging: false}
    }

    render() {
        return (
            <Button size={"sm"} variant="soft" style={{"border": "1px solid"}} className={"bg-gradient me-1" + (this.state.pinging ? ' disabled' : '')}
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