export const FETCH_TICKETS_REQUEST = "FETCH_TICKETS_REQUEST";
export const FETCH_TICKETS_SUCCESS = "FETCH_TICKETS_SUCCESS";
export const FETCH_TICKETS_FAILURE = "FETCH_TICKETS_FAILURE";

const fetchTicketsRequest = () => {
  return {
    type: FETCH_TICKETS_REQUEST,
  };
};

const fetchTicketsSuccess = (data) => {
  return {
    type: FETCH_TICKETS_SUCCESS,
    payload: data,
  };
};

const fetchTicketsFailure = (error) => {
  return {
    type: FETCH_TICKETS_FAILURE,
    payload: error,
  };
};

// Async action to fetch tickets
export const fetchTickets = () => {
  return (dispatch) => {
    dispatch(fetchTicketsRequest());
    fetch("https://api.quicksell.co/v1/internal/frontend-assignment")
      .then((response) => response.json())
      .then((data) => {
        dispatch(fetchTicketsSuccess(data));
      })
      .catch((error) => {
        dispatch(fetchTicketsFailure(error.message));
      });
  };
};
