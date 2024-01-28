import {Button} from "react-bootstrap";
import React from "react";
import timeout from "../Utils";

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
        this.state = {pingText: "Ping", success: null, pinging: false}
    }

    render() {
        return (
            <Button size={"sm"} className={"bg-gradient me-1" + (this.state.pinging ? ' disabled' : '')}
                    onClick={async () => {
                        this.setState({pingText: "...", pinging: true});
                        let isSuccess = await ping(this.props.url);
                        this.setState({pingText: isSuccess ? "Online" : "Offline", success: isSuccess, pinging: false});
                    }}
                    variant={this.state.success ? "success" : "outline-dark"}>
                {this.state.pingText}
            </Button>
        )
    }
}

export default PingButton;