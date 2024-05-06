import axios from "axios";

// 초기 State 중에 community 키값의 예시
const communityInitialState = {
    // 어떤 커뮤니티 게시판의 댓글 기능이 하위 댓글을 여러 단계로 작성할 수 있다고 가정해보자 상상해보자면 다음과 같은 모양이다.
    /*
    ├─댓글
    ├─댓글
    │ ├─댓글
    │ ├─댓글
    │ │ └─댓글
    │ │   └─댓글
    │ └─댓글
    ├─댓글
    └─댓글
    */
    replys: [
        {reply_code: "001000000000000", up_reply_code: "000000000000000", level: 1, content: "댓글A", down_replys: [
            {reply_code: "001001000000000", up_reply_code: "001000000000000", level: 2, content: "댓글AA", down_replys: [
                {reply_code: "001001001000000", up_reply_code: "001001000000000", level: 3, content: "댓글AAA", down_replys: []},
                {reply_code: "001001002000000", up_reply_code: "001001000000000", level: 3, content: "댓글AAB", down_replys: [
                    {reply_code: "001001002001000", up_reply_code: "001001002000000", level: 4, content: "댓글AABA", down_replys: []},
                    {reply_code: "001001002002000", up_reply_code: "001001002000000", level: 4, content: "댓글AABB", down_replys: []},
                ]},
                {reply_code: "001001003000000", up_reply_code: "001001000000000", level: 3, content: "댓글AAC", down_replys: [
                    {reply_code: "001001003001000", up_reply_code: "001001003000000", level: 4, content: "댓글AACA", down_replys: []},
                    {reply_code: "001001003002000", up_reply_code: "001001003000000", level: 4, content: "댓글AACB", down_replys: [
                        {reply_code: "001001003002001", up_reply_code: "001001003002000", level: 5, content: "댓글AACBA", down_replys: []},
                        {reply_code: "001001003002002", up_reply_code: "001001003002000", level: 5, content: "댓글AACBB", down_replys: []},
                        {reply_code: "001001003002003", up_reply_code: "001001003002000", level: 5, content: "댓글AACBC", down_replys: []},
                        {reply_code: "001001003002004", up_reply_code: "001001003002000", level: 5, content: "댓글AACBD", down_replys: []},
                    ]},
                ]},
            ]},
            {reply_code: "001002000000000", up_reply_code: "001000000000000", level: 2, content: "댓글AB", down_replys: [
                {reply_code: "001002001000000", up_reply_code: "001002000000000", level: 3, content: "댓글ABA", down_replys: []},
                {reply_code: "001002002000000", up_reply_code: "001002000000000", level: 3, content: "댓글ABB", down_replys: []},
            ]},
        ]},
        {reply_code: "002000000000000", up_reply_code: "000000000000000", level: 1, content: "댓글B", down_replys: [
            {reply_code: "002001000000000", up_reply_code: "002000000000000", level: 2, content: "댓글BA", down_replys: [
                {reply_code: "002001001000000", up_reply_code: "002001000000000", level: 3, content: "댓글BAA", down_replys: []},
                {reply_code: "002001002000000", up_reply_code: "002001000000000", level: 3, content: "댓글BAB", down_replys: []},
            ]},
            {reply_code: "002002000000000", up_reply_code: "002000000000000", level: 2, content: "댓글BB", down_replys: [
                {reply_code: "002002001000000", up_reply_code: "002002000000000", level: 3, content: "댓글BBA", down_replys: [
                    {reply_code: "002002001001000", up_reply_code: "002002001000000", level: 4, content: "댓글BBAA", down_replys: []},
                ]},
                {reply_code: "002002002000000", up_reply_code: "002002000000000", level: 3, content: "댓글BBB", down_replys: [
                    {reply_code: "002002002001000", up_reply_code: "002002002000000", level: 4, content: "댓글BBBA", down_replys: []},
                ]},
                {reply_code: "002002003000000", up_reply_code: "002002000000000", level: 3, content: "댓글BBC", down_replys: [
                    {reply_code: "002002003001000", up_reply_code: "002002003000000", level: 4, content: "댓글BBCA", down_replys: [
                        {reply_code: "002002003001001", up_reply_code: "002002003001000", level: 5, content: "댓글BBCAA", down_replys: []},
                        {reply_code: "002002003001002", up_reply_code: "002002003001000", level: 5, content: "댓글BBCAB", down_replys: []},
                        {reply_code: "002002003001003", up_reply_code: "002002003001000", level: 5, content: "댓글BBCAC", down_replys: []},
                        {reply_code: "002002003001004", up_reply_code: "002002003001000", level: 5, content: "댓글BBCAD", down_replys: []},
                        {reply_code: "002002003001005", up_reply_code: "002002003001000", level: 5, content: "댓글BBCAE", down_replys: []},
                        {reply_code: "002002003001006", up_reply_code: "002002003001000", level: 5, content: "댓글BBCAF", down_replys: []},
                        {reply_code: "002002003001007", up_reply_code: "002002003001000", level: 5, content: "댓글BBCAG", down_replys: []},
                    ]},
                ]},
                {reply_code: "002002004000000", up_reply_code: "002002000000000", level: 3, content: "댓글BBD", down_replys: [
                    {reply_code: "002002004001000", up_reply_code: "002002004000000", level: 4, content: "댓글BBDA", down_replys: [
                        {reply_code: "002002004001001", up_reply_code: "002002004001000", level: 5, content: "댓글BBDAA", down_replys: []},
                        {reply_code: "002002004001002", up_reply_code: "002002004001000", level: 5, content: "댓글BBDAB", down_replys: []},
                    ]},
                ]},
            ]},
            {reply_code: "002003000000000", up_reply_code: "002000000000000", level: 2, content: "댓글BC", down_replys: []},
        ]},
        {reply_code: "003000000000000", up_reply_code: "000000000000000", level: 1, content: "댓글C", down_replys: [
            {reply_code: "003001000000000", up_reply_code: "003000000000000", level: 2, content: "댓글CA", down_replys: []},
            {reply_code: "003002000000000", up_reply_code: "003000000000000", level: 2, content: "댓글CB", down_replys: []},
            {reply_code: "003003000000000", up_reply_code: "003000000000000", level: 2, content: "댓글CC", down_replys: []},
            {reply_code: "003004000000000", up_reply_code: "003000000000000", level: 2, content: "댓글CD", down_replys: []},
            {reply_code: "003005000000000", up_reply_code: "003000000000000", level: 2, content: "댓글CE", down_replys: []},
        ]},
    ]
};


// 커뮤니티 리듀서
const communityReducer = (state = {replys : []} /* communityInitialState */, action) => {
    switch(action.type) {
        case "REPLY/RESET_REPLYS":
            return {
                ...state,
                replys: [
                    ...action.payload.replys
                ]
            };
        case "REPLY/ADD_REPLY_LEVEL1":
            return {
                ...state,
                replys: [
                    ...state.replys,
                    {
                        "sell_id" : action.payload.SELL_ID,
                        "checked" : false,
                        "reply_code": action.payload.NEW_REPLY_CODE,
                        "up_reply_code": "",
                        "level": 1,
                        "content": action.payload.NEW_CONTENT,
                        "down_replys": []
                    }
                ]
            };
        case "REPLY/ADD_REPLY_LEVEL2":
            return {
                ...state,
                replys: [
                    ...state.replys.slice(0, action.payload.LV1_IDX),
                    {
                        ...state.replys[action.payload.LV1_IDX],
                        down_replys: [
                            ...state.replys[action.payload.LV1_IDX].down_replys,
                            {
                                "sell_id" : action.payload.SELL_ID,
                                "checked" : false,
                                "reply_code": action.payload.NEW_REPLY_CODE,
                                "up_reply_code": state.replys[action.payload.LV1_IDX].reply_code,
                                "level": 2,
                                "content": action.payload.NEW_CONTENT,
                                "down_replys": []
                            }
                        ],
                    },
                    ...state.replys.slice(action.payload.LV1_IDX + 1)
                ]
            };
        case "REPLY/ADD_REPLY_LEVEL3":
            return {
                ...state,
                replys: [
                    ...state.replys.slice(0, action.payload.LV1_IDX),
                    {
                        ...state.replys[action.payload.LV1_IDX],
                        down_replys: [
                            ...state.replys[action.payload.LV1_IDX].down_replys.slice(0, action.payload.LV2_IDX),
                            {
                                ...state.replys[action.payload.LV1_IDX].down_replys[action.payload.LV2_IDX],
                                down_replys: [
                                    ...state.replys[action.payload.LV1_IDX].down_replys[action.payload.LV2_IDX].down_replys,
                                    {
                                        "sell_id" : action.payload.SELL_ID,
                                        "checked" : false,
                                        "reply_code": action.payload.NEW_REPLY_CODE,
                                        "up_reply_code": state.replys[action.payload.LV1_IDX].down_replys[action.payload.LV2_IDX].reply_code,
                                        "level": 3,
                                        "content": action.payload.NEW_CONTENT,
                                        "down_replys": []
                                    }
                                ]
                            },
                            ...state.replys[action.payload.LV1_IDX].down_replys.slice(action.payload.LV2_IDX + 1)
                        ]
                    },
                    ...state.replys.slice(action.payload.LV1_IDX + 1)
                ]
            };
        case "REPLY/ADD_REPLY_LEVEL4":
            return {
                ...state,
                replys: [
                    ...state.replys.slice(0, action.payload.LV1_IDX),
                    {
                        ...state.replys[action.payload.LV1_IDX],
                        down_replys: [
                            ...state.replys[action.payload.LV1_IDX].down_replys.slice(0, action.payload.LV2_IDX),
                            {
                                ...state.replys[action.payload.LV1_IDX].down_replys[action.payload.LV2_IDX],
                                down_replys: [
                                    ...state.replys[action.payload.LV1_IDX].down_replys[action.payload.LV2_IDX].down_replys.slice(0, action.payload.LV3_IDX),
                                    {
                                        ...state.replys[action.payload.LV1_IDX].down_replys[action.payload.LV2_IDX].down_replys[action.payload.LV3_IDX],
                                        down_replys: [
                                            // 기존 하위 댓글들 spread
                                            ...state.replys[action.payload.LV1_IDX].down_replys[action.payload.LV2_IDX].down_replys[action.payload.LV3_IDX].down_replys,
                                            // 새 댓글 추가
                                            {
                                                "sell_id" : action.payload.SELL_ID,
                                                "checked" : false,
                                                "reply_code" : action.payload.NEW_REPLY_CODE,
                                                "up_reply_code" : state.replys[action.payload.LV1_IDX].down_replys[action.payload.LV2_IDX].down_replys[action.payload.LV3_IDX].reply_code,
                                                "level" : 4,
                                                "content" : action.payload.NEW_CONTENT,
                                                "down_replys" : []
                                            }
                                        ]
                                    },
                                    ...state.replys[action.payload.LV1_IDX].down_replys[action.payload.LV2_IDX].down_replys.slice(action.payload.LV3_IDX + 1)
                                ]
                            },
                            ...state.replys[action.payload.LV1_IDX].down_replys.slice(action.payload.LV2_IDX + 1)
                        ]
                    },
                    ...state.replys.slice(action.payload.LV1_IDX + 1)
                ]
            };
        case "REPLY/ADD_REPLY_LEVEL5":
            return {
                ...state,
                replys: [
                    ...state.replys.slice(0, action.payload.LV1_IDX),
                    {
                        ...state.replys[action.payload.LV1_IDX],
                        down_replys: [
                            ...state.replys[action.payload.LV1_IDX].down_replys.slice(0, action.payload.LV2_IDX),
                            {
                                ...state.replys[action.payload.LV1_IDX].down_replys[action.payload.LV2_IDX],
                                down_replys: [
                                    ...state.replys[action.payload.LV1_IDX].down_replys[action.payload.LV2_IDX].down_replys.slice(0, action.payload.LV3_IDX),
                                    {
                                        ...state.replys[action.payload.LV1_IDX].down_replys[action.payload.LV2_IDX].down_replys[action.payload.LV3_IDX],
                                        down_replys: [
                                            ...state.replys[action.payload.LV1_IDX].down_replys[action.payload.LV2_IDX].down_replys[action.payload.LV3_IDX].down_replys.slice(0, action.payload.LV4_IDX),
                                            {
                                                ...state.replys[action.payload.LV1_IDX].down_replys[action.payload.LV2_IDX].down_replys[action.payload.LV3_IDX].down_replys[action.payload.LV4_IDX],
                                                down_replys: [
                                                    // 기존 하위 댓글들 spread
                                                    ...state.replys[action.payload.LV1_IDX].down_replys[action.payload.LV2_IDX].down_replys[action.payload.LV3_IDX].down_replys[action.payload.LV4_IDX].down_replys,
                                                    // 새 댓글 추가
                                                    {
                                                        "sell_id" : action.payload.SELL_ID,
                                                        "checked" : false,
                                                        "reply_code" : action.payload.NEW_REPLY_CODE,
                                                        "up_reply_code" : state.replys[action.payload.LV1_IDX].down_replys[action.payload.LV2_IDX].down_replys[action.payload.LV3_IDX].down_replys[action.payload.LV4_IDX].reply_code,
                                                        "level" : 5,
                                                        "content" : action.payload.NEW_CONTENT,
                                                        "down_replys" : []
                                                    }
                                                ]
                                            },
                                            ...state.replys[action.payload.LV1_IDX].down_replys[action.payload.LV2_IDX].down_replys[action.payload.LV3_IDX].down_replys.slice(action.payload.LV4_IDX + 1)
                                        ],
                                    },
                                    ...state.replys[action.payload.LV1_IDX].down_replys[action.payload.LV2_IDX].down_replys.slice(action.payload.LV3_IDX + 1),
                                ],
                            },
                            ...state.replys[action.payload.LV1_IDX].down_replys.slice(action.payload.LV2_IDX + 1),
                        ],
                    },
                    ...state.replys.slice(action.payload.LV1_IDX + 1)
                ]
            };
        // 1. If a checkbox is checked / unchecked, all of its descendants should become checked / unchecked.
        // 번역) 체크박스를 [선택/취소]하면 해당 하위 항목도 모두 [선택/취소]되어야 합니다.
        // 2. If all descendants of a checkbox are checked, that checkbox should be checked
        // 번역) 체크박스의 모든 하위 항목이 선택되어 있으면 해당 체크박스도 선택되어야 합니다.
        // 3. If any of the descendants of a checkbox is unchecked, that checkbox should also be unchecked
        // 번역) 체크박스의 하위 항목 중 하나라도 선택 해제된 경우 해당 체크박스도 선택 해제되어야 합니다. (즉, LV4 댓글을 false(uncheck) 로 하면 해당 댓글을 포함하는 상위 댓글 LV1 ~ LV3 도 false(uncheck)로 변경, true(check)인 경우 기존값 그대로)
        case "REPLY/RECURSIVELY_CHECK_UNCHECK_LV1": // LV1은 상위 댓글의 체크 여부를 신경 쓸 필요가 없음
            return {
                ...state,
                replys: [
                    ...state.replys.slice(0, action.payload.LV1_IDX),
                    {
                        ...state.replys[action.payload.LV1_IDX],
                        checked: action.payload.checked, // !state.replys[action.payload.LV1_IDX].checked,
                        down_replys: [
                            ...state.replys[action.payload.LV1_IDX].down_replys.map((OBJ_LV2, IDX_LV2) => (
                                {
                                    // ...state.replys[action.payload.LV1_IDX].down_replys[IDX_LV2],
                                    ...OBJ_LV2,
                                    checked: action.payload.checked,
                                    down_replys: [
                                        ...OBJ_LV2.down_replys.map((OBJ_LV3, IDX_LV3) => (
                                        // ...state.replys[action.payload.LV1_IDX].down_replys[IDX_LV2].down_replys.map((OBJ_LV3, IDX_LV3) => (
                                            {
                                                ...OBJ_LV3,
                                                checked: action.payload.checked,
                                                down_replys: [
                                                    ...OBJ_LV3.down_replys.map((OBJ_LV4, IDX_LV4) => (
                                                    // ...state.replys[action.payload.LV1_IDX].down_replys[IDX_LV2].down_replys[IDX_LV3].down_replys.map((OBJ_LV4, IDX_LV4) => (
                                                        {
                                                            ...OBJ_LV4,
                                                            checked: action.payload.checked,
                                                            down_replys: [
                                                                ...OBJ_LV4.down_replys.map((OBJ_LV5, IDX_LV5) => (
                                                                // ...state.replys[action.payload.LV1_IDX].down_replys[IDX_LV2].down_replys[IDX_LV3].down_replys[IDX_LV4].down_replys.map((OBJ_LV5, IDX_LV5) => (
                                                                    {
                                                                        ...OBJ_LV5,
                                                                        checked: action.payload.checked,
                                                                    }
                                                                )),
                                                            ]
                                                        }
                                                    )),
                                                ],
                                            }
                                        )),
                                    ],
                                }
                            )),
                            // ...state.replys[action.payload.LV1_IDX].down_replys.map(ObjLV2 => ({...ObjLV2, checked: action.payload.checked})),
                        ],
                    },
                    ...state.replys.slice(action.payload.LV1_IDX + 1)
                ],
            };
        case "REPLY/RECURSIVELY_CHECK_UNCHECK_LV2":
            return {
                ...state,
                replys: [
                    ...state.replys.slice(0, action.payload.LV1_IDX),
                    {
                        ...state.replys[action.payload.LV1_IDX],
                        down_replys: [
                            ...state.replys[action.payload.LV1_IDX].down_replys.slice(0, action.payload.LV2_IDX),
                            {
                                ...state.replys[action.payload.LV1_IDX].down_replys[action.payload.LV2_IDX],
                                checked: action.payload.checked,
                                down_replys: [
                                    ...state.replys[action.payload.LV1_IDX].down_replys[action.payload.LV2_IDX].down_replys.map((OBJ_LV3, IDX_LV3) => (
                                        {
                                            ...OBJ_LV3,
                                            checked: action.payload.checked,
                                            down_replys: [
                                                ...OBJ_LV3.down_replys.map((OBJ_LV4, IDX_LV4) => (
                                                    {
                                                        ...OBJ_LV4,
                                                        checked: action.payload.checked,
                                                        down_replys: [
                                                            ...OBJ_LV4.down_replys.map((OBJ_LV5, IDX_LV5) => (
                                                                {
                                                                    ...OBJ_LV5,
                                                                    checked: action.payload.checked,
                                                                }
                                                            )),
                                                        ],
                                                    }
                                                )),
                                            ],
                                        }
                                    )),
                                ],
                            },
                            ...state.replys[action.payload.LV1_IDX].down_replys.slice(action.payload.LV2_IDX + 1),
                        ],
                        // LV1
                        checked: (action.payload.checked === false ? false : state.replys[action.payload.LV1_IDX].checked),
                    },
                    ...state.replys.slice(action.payload.LV1_IDX + 1),
                ],
            };
        case "REPLY/RECURSIVELY_CHECK_UNCHECK_LV3":
            return {
                ...state,
                replys: [
                    ...state.replys.slice(0, action.payload.LV1_IDX),
                    {
                        ...state.replys[action.payload.LV1_IDX],
                        down_replys: [
                            ...state.replys[action.payload.LV1_IDX].down_replys.slice(0, action.payload.LV2_IDX),
                            {
                                ...state.replys[action.payload.LV1_IDX].down_replys[action.payload.LV2_IDX],
                                down_replys: [
                                    ...state.replys[action.payload.LV1_IDX].down_replys[action.payload.LV2_IDX].down_replys.slice(0, action.payload.LV3_IDX),
                                    {
                                        ...state.replys[action.payload.LV1_IDX].down_replys[action.payload.LV2_IDX].down_replys[action.payload.LV3_IDX],
                                        checked: action.payload.checked,
                                        down_replys: [
                                            ...state.replys[action.payload.LV1_IDX].down_replys[action.payload.LV2_IDX].down_replys[action.payload.LV3_IDX].down_replys.map((OBJ_LV4, IDX_LV4) => (
                                                {
                                                    ...OBJ_LV4,
                                                    checked: action.payload.checked,
                                                    down_replys: [
                                                        ...OBJ_LV4.down_replys.map((OBJ_LV5, IDX_LV5) => (
                                                            {
                                                                ...OBJ_LV5,
                                                                checked: action.payload.checked,
                                                            }
                                                        )),
                                                    ],
                                                }
                                            )),
                                        ],
                                    },
                                    ...state.replys[action.payload.LV1_IDX].down_replys[action.payload.LV2_IDX].down_replys.slice(action.payload.LV3_IDX + 1),
                                ],
                                // LV2
                                checked: (action.payload.checked === false ? false : state.replys[action.payload.LV1_IDX].down_replys[action.payload.LV2_IDX].checked),
                            },
                            ...state.replys[action.payload.LV1_IDX].down_replys.slice(action.payload.LV2_IDX + 1),
                        ],
                        // LV1
                        checked: (action.payload.checked === false ? false : state.replys[action.payload.LV1_IDX].checked),
                    },
                    ...state.replys.slice(action.payload.LV1_IDX + 1),
                ],
            };
        case "REPLY/RECURSIVELY_CHECK_UNCHECK_LV4":
            return {
                ...state,
                replys: [
                    ...state.replys.slice(0, action.payload.LV1_IDX),
                    {
                        ...state.replys[action.payload.LV1_IDX],
                        down_replys: [
                            ...state.replys[action.payload.LV1_IDX].down_replys.slice(0, action.payload.LV2_IDX),
                            {
                                ...state.replys[action.payload.LV1_IDX].down_replys[action.payload.LV2_IDX],
                                down_replys: [
                                    ...state.replys[action.payload.LV1_IDX].down_replys[action.payload.LV2_IDX].down_replys.slice(0, action.payload.LV3_IDX),
                                    {
                                        ...state.replys[action.payload.LV1_IDX].down_replys[action.payload.LV2_IDX].down_replys[action.payload.LV3_IDX],
                                        down_replys: [
                                            ...state.replys[action.payload.LV1_IDX].down_replys[action.payload.LV2_IDX].down_replys[action.payload.LV3_IDX].down_replys.slice(0, action.payload.LV4_IDX),
                                            {
                                                ...state.replys[action.payload.LV1_IDX].down_replys[action.payload.LV2_IDX].down_replys[action.payload.LV3_IDX].down_replys[action.payload.LV4_IDX],
                                                checked: action.payload.checked,
                                                down_replys: [
                                                    ...state.replys[action.payload.LV1_IDX].down_replys[action.payload.LV2_IDX].down_replys[action.payload.LV3_IDX].down_replys[action.payload.LV4_IDX].down_replys.map((OBJ_LV5, IDX_LV5) => (
                                                        {
                                                            ...OBJ_LV5,
                                                            checked: action.payload.checked,
                                                        }
                                                    )),
                                                ],
                                            },
                                            ...state.replys[action.payload.LV1_IDX].down_replys[action.payload.LV2_IDX].down_replys[action.payload.LV3_IDX].down_replys.slice(action.payload.LV4_IDX + 1),
                                        ],
                                        // LV3
                                        checked: (action.payload.checked === false ? false : state.replys[action.payload.LV1_IDX].down_replys[action.payload.LV2_IDX].down_replys[action.payload.LV3_IDX].checked),
                                    },
                                    ...state.replys[action.payload.LV1_IDX].down_replys[action.payload.LV2_IDX].down_replys.slice(action.payload.LV3_IDX + 1),
                                ],
                                // LV2
                                checked: (action.payload.checked === false ? false : state.replys[action.payload.LV1_IDX].down_replys[action.payload.LV2_IDX].checked),
                            },
                            ...state.replys[action.payload.LV1_IDX].down_replys.slice(action.payload.LV2_IDX + 1),
                        ],
                        // LV1
                        checked: (action.payload.checked === false ? false : state.replys[action.payload.LV1_IDX].checked),
                    },
                    ...state.replys.slice(action.payload.LV1_IDX + 1),
                ],
            };
        case "REPLY/RECURSIVELY_CHECK_UNCHECK_LV5":
            return {
                ...state,
                replys: [
                    ...state.replys.slice(0, action.payload.LV1_IDX),
                    {
                        ...state.replys[action.payload.LV1_IDX],
                        down_replys: [
                            ...state.replys[action.payload.LV1_IDX].down_replys.slice(0, action.payload.LV2_IDX),
                            {
                                ...state.replys[action.payload.LV1_IDX].down_replys[action.payload.LV2_IDX],
                                down_replys: [
                                    ...state.replys[action.payload.LV1_IDX].down_replys[action.payload.LV2_IDX].down_replys.slice(0, action.payload.LV3_IDX),
                                    {
                                        ...state.replys[action.payload.LV1_IDX].down_replys[action.payload.LV2_IDX].down_replys[action.payload.LV3_IDX],
                                        down_replys: [
                                            ...state.replys[action.payload.LV1_IDX].down_replys[action.payload.LV2_IDX].down_replys[action.payload.LV3_IDX].down_replys.slice(0, action.payload.LV4_IDX),
                                            {
                                                ...state.replys[action.payload.LV1_IDX].down_replys[action.payload.LV2_IDX].down_replys[action.payload.LV3_IDX].down_replys[action.payload.LV4_IDX],
                                                down_replys: [
                                                    ...state.replys[action.payload.LV1_IDX].down_replys[action.payload.LV2_IDX].down_replys[action.payload.LV3_IDX].down_replys[action.payload.LV4_IDX].down_replys.slice(0, action.payload.LV5_IDX),
                                                    {
                                                        ...state.replys[action.payload.LV1_IDX].down_replys[action.payload.LV2_IDX].down_replys[action.payload.LV3_IDX].down_replys[action.payload.LV4_IDX].down_replys[action.payload.LV5_IDX],
                                                        checked: action.payload.checked,
                                                    },
                                                    ...state.replys[action.payload.LV1_IDX].down_replys[action.payload.LV2_IDX].down_replys[action.payload.LV3_IDX].down_replys[action.payload.LV4_IDX].down_replys.slice(action.payload.LV5_IDX + 1),
                                                ],
                                                // LV4
                                                checked: (action.payload.checked === false ? false : state.replys[action.payload.LV1_IDX].down_replys[action.payload.LV2_IDX].down_replys[action.payload.LV3_IDX].down_replys[action.payload.LV4_IDX].checked),
                                            },
                                            ...state.replys[action.payload.LV1_IDX].down_replys[action.payload.LV2_IDX].down_replys[action.payload.LV3_IDX].down_replys.slice(action.payload.LV4_IDX + 1),
                                        ],
                                        // LV3
                                        checked: (action.payload.checked === false ? false : state.replys[action.payload.LV1_IDX].down_replys[action.payload.LV2_IDX].down_replys[action.payload.LV3_IDX].checked),
                                    },
                                    ...state.replys[action.payload.LV1_IDX].down_replys[action.payload.LV2_IDX].down_replys.slice(action.payload.LV3_IDX + 1),
                                ],
                                // LV2
                                checked: (action.payload.checked === false ? false : state.replys[action.payload.LV1_IDX].down_replys[action.payload.LV2_IDX].checked),
                            },
                            ...state.replys[action.payload.LV1_IDX].down_replys.slice(action.payload.LV2_IDX + 1),
                        ],
                        // LV1
                        checked: (action.payload.checked === false ? false : state.replys[action.payload.LV1_IDX].checked),
                    },
                    ...state.replys.slice(action.payload.LV1_IDX + 1),
                ],
            };
        case "REPLY/ELIMINATE_REPLY_LV1":
            return {
                ...state,
                replys: [
                    ...state.replys.filter(OBJ_LV1 => OBJ_LV1.reply_code !== action.payload.REPLY_CODE)
                ],
            };
        case "REPLY/ELIMINATE_REPLY_LV2":
            return {
                ...state,
                replys: [
                    ...state.replys.slice(0, action.payload.LV1_IDX),
                    {
                        ...state.replys[action.payload.LV1_IDX],
                        down_replys: [
                            ...state.replys[action.payload.LV1_IDX].down_replys.filter(OBJ_LV2 => OBJ_LV2.reply_code !== action.payload.REPLY_CODE)
                        ],
                    },
                    ...state.replys.slice(action.payload.LV1_IDX + 1),
                ],
            };
        case "REPLY/ELIMINATE_REPLY_LV3":
            return {
                ...state,
                replys: [
                    ...state.replys.slice(0, action.payload.LV1_IDX),
                    {
                        ...state.replys[action.payload.LV1_IDX],
                        down_replys: [
                            ...state.replys[action.payload.LV1_IDX].down_replys.slice(0, action.payload.LV2_IDX),
                            {
                                ...state.replys[action.payload.LV1_IDX].down_replys[action.payload.LV2_IDX],
                                down_replys: [
                                    ...state.replys[action.payload.LV1_IDX].down_replys[action.payload.LV2_IDX].down_replys.filter(OBJ_LV3 => OBJ_LV3.reply_code !== action.payload.REPLY_CODE)
                                ],
                            },
                            ...state.replys[action.payload.LV1_IDX].down_replys.slice(action.payload.LV2_IDX + 1),
                        ],
                    },
                    ...state.replys.slice(action.payload.LV1_IDX + 1),
                ],
            };
        case "REPLY/ELIMINATE_REPLY_LV4":
            return {
                ...state,
                replys: [
                    ...state.replys.slice(0, action.payload.LV1_IDX),
                    {
                        ...state.replys[action.payload.LV1_IDX],
                        down_replys: [
                            ...state.replys[action.payload.LV1_IDX].down_replys.slice(0, action.payload.LV2_IDX),
                            {
                                ...state.replys[action.payload.LV1_IDX].down_replys[action.payload.LV2_IDX],
                                down_replys: [
                                    ...state.replys[action.payload.LV1_IDX].down_replys[action.payload.LV2_IDX].down_replys.slice(0, action.payload.LV3_IDX),
                                    {
                                        ...state.replys[action.payload.LV1_IDX].down_replys[action.payload.LV2_IDX].down_replys[action.payload.LV3_IDX],
                                        down_replys: [
                                            ...state.replys[action.payload.LV1_IDX].down_replys[action.payload.LV2_IDX].down_replys[action.payload.LV3_IDX].down_replys.filter(OBJ_LV4 => OBJ_LV4.reply_code !== action.payload.REPLY_CODE)
                                        ],
                                    },
                                    ...state.replys[action.payload.LV1_IDX].down_replys[action.payload.LV2_IDX].down_replys.slice(action.payload.LV3_IDX + 1),
                                ],
                            },
                            ...state.replys[action.payload.LV1_IDX].down_replys.slice(action.payload.LV2_IDX + 1),
                        ],
                    },
                    ...state.replys.slice(action.payload.LV1_IDX + 1),
                ],
            };
        case "REPLY/ELIMINATE_REPLY_LV5":
            return {
                ...state,
                replys: [
                    ...state.replys.slice(0, action.payload.LV1_IDX),
                    {
                        ...state.replys[action.payload.LV1_IDX],
                        down_replys: [
                            ...state.replys[action.payload.LV1_IDX].down_replys.slice(0, action.payload.LV2_IDX),
                            {
                                ...state.replys[action.payload.LV1_IDX].down_replys[action.payload.LV2_IDX],
                                down_replys: [
                                    ...state.replys[action.payload.LV1_IDX].down_replys[action.payload.LV2_IDX].down_replys.slice(0, action.payload.LV3_IDX),
                                    {
                                        ...state.replys[action.payload.LV1_IDX].down_replys[action.payload.LV2_IDX].down_replys[action.payload.LV3_IDX],
                                        down_replys: [
                                            ...state.replys[action.payload.LV1_IDX].down_replys[action.payload.LV2_IDX].down_replys[action.payload.LV3_IDX].down_replys.slice(0, action.payload.LV4_IDX),
                                            {
                                                ...state.replys[action.payload.LV1_IDX].down_replys[action.payload.LV2_IDX].down_replys[action.payload.LV3_IDX].down_replys[action.payload.LV4_IDX],
                                                down_replys: [
                                                    ...state.replys[action.payload.LV1_IDX].down_replys[action.payload.LV2_IDX].down_replys[action.payload.LV3_IDX].down_replys[action.payload.LV4_IDX].down_replys.filter(OBJ_LV5 => OBJ_LV5.reply_code !== action.payload.REPLY_CODE)
                                                ],
                                            },
                                            ...state.replys[action.payload.LV1_IDX].down_replys[action.payload.LV2_IDX].down_replys[action.payload.LV3_IDX].down_replys.slice(action.payload.LV4_IDX + 1),
                                        ],
                                    },
                                    ...state.replys[action.payload.LV1_IDX].down_replys[action.payload.LV2_IDX].down_replys.slice(action.payload.LV3_IDX + 1),
                                ],
                            },
                            ...state.replys[action.payload.LV1_IDX].down_replys.slice(action.payload.LV2_IDX + 1),
                        ],
                    },
                    ...state.replys.slice(action.payload.LV1_IDX + 1),
                ],
            };
        default:
            return {
                ...state,
            };
    }
};

export default communityReducer;

// Thunk function
export async function resetReplys(dispatch, getState) {
    const result = await axios({
        method: 'get',
        url: "http://localhost:8080/MyWeb1/SelectAllReplys.jsp",
        headers: {
            "Content-Type": "application/json;charset=UTF-8",
        }
    });
    // 서버에서 가져온 댓글 데이터를 Redux 스토어의 state값을 초기화시킨다.
    dispatch({type: "REPLY/RESET_REPLYS", payload: {replys: result.data}});
}
export function resetReplysBySellId(sell_id) {
    return async function resetReplysThunk(dispatch, getState) {
        const result = await axios({
            method : 'post',
            // url : "http://localhost:8080/MyWeb1/SelectAllReplys.jsp?sell_id="+sell_id,
            url : 'http://localhost:8080/MyWeb1/selling/SellingDetail.jsp',
            data : {'sell_id' : sell_id, 'TYPE' : 'Selling/Replys'},
            headers : {
                "Content-Type" : "application/x-www-form-urlencoded;charset=utf-8",
            }
        });
        // 서버에서 가져온 댓글 데이터를 Redux 스토어의 state값을 초기화시킨다.
        dispatch({type: "REPLY/RESET_REPLYS", payload: {replys: result.data}});
    };
}
/*
@sell_id       : 판매글아이디
@up_reply_code : 상위댓글코드
@level         : 추가하려는 댓글의 레벨(1 ~ 5)
@content       : 추가하려는 댓글의 내용
*/
export function saveNewReply(sell_id, up_reply_code, level, content) {
    return async function saveNewReplyThunk(dispatch, getState) {
        try{
            const result = await axios.post(
                // "http://localhost:8080/MyWeb1/SaveNewReply.jsp",
                "http://localhost:8080/MyWeb1/selling/RegisterNewReply.jsp",
                JSON.stringify({
                    "sell_id": sell_id,
                    "up_reply_code": up_reply_code,
                    "level": level,
                    "content": content,
                })
            );
            
            dispatch({type: `REPLY/ADD_REPLY_LEVEL${result.data.level}`, payload: {
                // 배열인덱스라서 -1씩 차감
                LV1_IDX: result.data.LV1 - 1,
                LV2_IDX: result.data.LV2 - 1,
                LV3_IDX: result.data.LV3 - 1,
                LV4_IDX: result.data.LV4 - 1,
                SELL_ID: sell_id,
                NEW_CONTENT: result.data.content,
                NEW_REPLY_CODE: result.data.NEW_REPLY_CODE,
            }});
        }catch(error) {
            console.error(error);
        }
    };
}
/*
@sell_id    : 판매글아이디
@reply_code : 댓글코드
@level      : 댓글레벨
@P_LV1_IDX  : 1레벨 댓글 인덱스
@P_LV2_IDX  : 2레벨 댓글 인덱스
@P_LV3_IDX  : 3레벨 댓글 인덱스
@P_LV4_IDX  : 4레벨 댓글 인덱스
*/
export function deleteReplyByOneCode(sell_id, reply_code, level, P_LV1_IDX, P_LV2_IDX, P_LV3_IDX, P_LV4_IDX) {
    return async function deleteReplyThunk(dispatch, getState) {
        try{
            const result = await axios.post(
                // "http://localhost:8080/MyWeb1/community/reply/DeleteReply.jsp",
                "http://localhost:8080/MyWeb1/selling/DeleteReply.jsp",
                JSON.stringify({
                    "sell_id": sell_id,
                    "reply_code": reply_code,
                    "level": level,
                })
            );

            dispatch({
                type: `REPLY/ELIMINATE_REPLY_LV${result.data.level}`,
                payload: {
                    REPLY_CODE: result.data.reply_code,
                    LV1_IDX: P_LV1_IDX,
                    LV2_IDX: P_LV2_IDX,
                    LV3_IDX: P_LV3_IDX,
                    LV4_IDX: P_LV4_IDX,
                }
            });
        }catch(error) {
            console.error(error);
        }
    };
};
