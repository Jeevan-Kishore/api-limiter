/*
Please ensure that before submitting, you do not have any console logs in your solution.
 */

const {rateData, rateLimit} =  require("./rate_limiter_data");

const getRateLimiter = (apiService, limit) => {
    // Your code here...
    const send = requestId => {
        const response = apiService(requestId);
        return new Promise(resolve => {
            // Your code here...
            resolve(response);
        });
    };

    return { send }; // Do not change the return  type
};



const runner = (limit, requestTuples) => {
    const batchLog = [];

    const apiService = requestID => {
        const log = `START ${requestID}`;
        console.log(log);
        return new Promise((resolve, reject) => {
            const info = requestTuples.find(item => item.id === requestID);
            setTimeout(function() {
                const finishLog = `FINISH ${info.id}`;
                resolve(finishLog);
            }, info.duration * 100);
        });
    };
    const rateLimiter = getRateLimiter(apiService, limit);

    // Runner is going to call send for all API requests at once and in the same order
    // as input testcase
    Promise.all(
        requestTuples.map(r => {
            const requestID = r.id;

            // The send function is the one returned from getRateLimiter()
            return rateLimiter.send(requestID).then(response => console.log(response));
        })
    );
};



// Call runner method
runner(rateLimit, rateData);
