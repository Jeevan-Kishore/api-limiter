/*
Please ensure that before submitting, you do not have any console logs in your solution.
 */

const {rateData, rateLimit} =  require("./rate_limiter_data");

const getRateLimiter = (apiService, limit) => {
    /* Counter for keeping track on the number of current executing api, outer scope to facilitate currying */
    let counter = 0;
    const send = requestId => {
        return new Promise(resolve => {
            /* Preserve and clear intervalID to avoid memory leaks */
            const intervalID = setInterval( () => {
                /*
                The API call should be made only if there is a slot available
                i.e number of processes should be less than that of the limit
                */
                if(counter < limit){
                    clearInterval(intervalID);
                    counter = counter + 1;
                    const response =  apiService(requestId).then((res) => {
                        counter = counter - 1;
                        return res;
                    });
                    resolve(response);
                }
                /* Run it at 0 ms for accuracy of results */
            }, 0);

        });
    };

    return { send }; // Do not change the return  type
};




/* Anything below this remains unchanged */

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
