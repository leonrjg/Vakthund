import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {getAllDiscoveries} from "../../redux/actions/Actions";
import DiscoveryTable from "./DiscoveryTable";
import {Skeleton} from "@mui/joy";

function DiscoveryList() {
    const [discoveryList, setDiscoveryList] = useState([]);
    const Dispatch = useDispatch();

    useEffect(() => {
        Dispatch(getAllDiscoveries());
    }, []);

    const data = useSelector((state) => state.discoveries);

    useEffect(() => {
        setDiscoveryList(data);
    }, [data]);

    return (
        <>
            {discoveryList?.length > 0 ? (
                <DiscoveryTable lst={discoveryList}/>
            ) : (
                <>
                    <DiscoveryTable lst={[]}/>
                </>
            )}
        </>
    );
}

export default DiscoveryList;
