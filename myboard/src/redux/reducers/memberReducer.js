const memberInitialState = {
    login : {
        SEQ : null,
        ID : null,
        NAME : null,
    },
};


const memberReducer = (state = memberInitialState, action) => {
    switch(action.type){
        case "MEMBER/JOIN_SUCCESS":
            return {
                ...state,
                login : {
                    SEQ : action.payload.SEQ,
                    ID : action.payload.ID,
                    NAME : action.payload.NAME,
                }
            };
        case "MEMBER/LOGIN_SUCCESS":
            return {
                ...state,
                login : {
                    SEQ : action.payload.SEQ,
                    ID : action.payload.ID,
                    NAME : action.payload.NAME,
                }
            };
        case "MEMBER/LOGOUT":
            return {
                ...state,
                login : {
                    SEQ : null,
                    ID : null,
                    NAME : null,
                }
            }
        default:
            return {
                ...state,
            };
    }
};

export default memberReducer;