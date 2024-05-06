// 미들웨어
export const print1 = (storeAPI) => (next) => (action) => {
    console.log('1', storeAPI.getState().selling);
    // 비동기로 실행되고 밑에 return 문은 그대로 실행된다.
    // setTimeout(() => {
    //     console.log("2초 후 출력...");
    // }, 2000);
    return next(action);
};

export const print2 = (storeAPI) => (next) => (action) => {
    console.log('2', storeAPI.getState().selling);
    // return storeAPI.dispatch(action); // 이렇게 하면 무한 루프에 빠진다. 지금 현재 print1, print2 미들웨어만 계속 반복적으로 호출되고 print3 으로 action이 전달되지 못한다.
    return next(action);
};

export const print3 = (storeAPI) => (next) => (action) => {
    console.log('3', storeAPI.getState().selling);
    return next(action);
};