import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useLocation} from "react-router-dom";
import {getAllDiscoveries} from "../../redux/actions/Actions";
import Table from "./Table";

function Home() {
    const [discoveryList, setDiscoveryList] = useState([]);
    const Dispatch = useDispatch();
    const location = useLocation();

    // Fetch discoveries whenever we navigate to this route
    // location.key changes on every navigation, forcing a refresh
    useEffect(() => {
        Dispatch(getAllDiscoveries());
    }, [location.key, Dispatch]);

    const data = useSelector((state) => state.discoveries);

    useEffect(() => {
        setDiscoveryList(data);
    }, [data]);

    return (
        <>
            {discoveryList?.length > 0 ? (
                <Table lst={discoveryList}/>
            ) : (
                <>
                    <Table lst={[]}/>
                </>
            )}
        </>
    );
}

export default Home;
