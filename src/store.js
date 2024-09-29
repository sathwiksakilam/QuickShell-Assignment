import { createStore, applyMiddleware } from "redux";
import {thunk} from "redux-thunk";
import ticketsReducer from "./redux/ticketsReducer";

const store = createStore(ticketsReducer, applyMiddleware(thunk));
export default store;