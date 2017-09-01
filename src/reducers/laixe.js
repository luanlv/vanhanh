import { LAIXE_DO_LOADED, LAIXE_PHUPHI_LOADED } from '../constants/actionTypes';

const initState = {
  status: {
    listDO: false,
    listPhuPhi: false,
  },
  listDO: [],
  listPhuPhi: []
};

export default (state = initState, action) => {
  switch (action.type) {
    case LAIXE_DO_LOADED:
      return {
        ...state,
        status: {
          ...state.status,
          listDO: true
        },
        listDO: action.payload[0]
      };
    case LAIXE_PHUPHI_LOADED:
      return {
        ...state,
        status: {
          ...state.status,
          listPhuPhi: true
        },
        listPhuPhi: action.payload[0]
      }
    default:
      return state;
  }
};
