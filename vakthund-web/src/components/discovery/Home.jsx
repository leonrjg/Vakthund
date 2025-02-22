import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {getAllDiscoveries} from "../../redux/actions/Actions";
import Table from "./Table";

function Home() {
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
