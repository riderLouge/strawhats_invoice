import { createStore } from "redux";
import reducer from "./reducer";

// ==============================|| REDUX - MAIN STORE ||============================== //

const store = createStore(reducer);
const persister = "login";

export { store, persister };
