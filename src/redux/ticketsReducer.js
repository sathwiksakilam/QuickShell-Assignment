import {
    FETCH_TICKETS_REQUEST,
    FETCH_TICKETS_SUCCESS,
    FETCH_TICKETS_FAILURE,
  } from "./actions";
  
  const initialState = {
    loading: false,
    tickets: [],
    users: [],
    error: "",
  };
  
  const ticketsReducer = (state = initialState, action) => {
    switch (action.type) {
      case FETCH_TICKETS_REQUEST:
        return {
          ...state,
          loading: true,
        };
      case FETCH_TICKETS_SUCCESS:
        return {
          ...state,
          loading: false,
          tickets: action.payload.tickets,
          users: action.payload.users,
        };
      case FETCH_TICKETS_FAILURE:
        return {
          ...state,
          loading: false,
          error: action.payload,
        };
      case "SORT_TICKETS_BY_PRIORITY":
        return {
          ...state,
          tickets: state.tickets.slice().sort((a, b) => b.priority - a.priority),
        };
      case "SORT_TICKETS_BY_TITLE":
        return {
          ...state,
          tickets: state.tickets.slice().sort((a, b) => a.title.localeCompare(b.title)),
        };
      default:
        return state;
    }
  };
  
  export default ticketsReducer;
  