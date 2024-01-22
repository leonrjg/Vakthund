import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {getAllDiscoveries} from "../../redux/actions/Actions";
import DiscoveryTable from "./DiscoveryTable";
import {Skeleton} from "@mui/joy";

function DiscoveryList({total_pages}) {
    const [devicesData, setdevicesData] = useState([]);
    const Dispatch = useDispatch();

    useEffect(() => {
        Dispatch(getAllDiscoveries());
    }, []);

    const devicesDatas = (useSelector((state) => state.discoveries) || []);

    useEffect(() => {
        setdevicesData(devicesDatas);
    }, [devicesDatas]);

    return (
        <>
            {devicesData.length > 0 ? (
                <DiscoveryTable lst={devicesData}/>
            ) : (
                <>
                    <h2 className="text-center mt-4">Loading...</h2>
                </>
            )}
        </>
    );
}

export default DiscoveryList;
