import {applyMiddleware, createStore} from "redux";
import thunk from "redux-thunk";
import {devicesReducer} from "../reducer/Reducer";

export const store = createStore(
    devicesReducer,
    applyMiddleware(thunk)
    //   composeWithDevTools()
);
