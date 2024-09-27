jest.mock('fs');

expect.extend({
    // This will only work with objects having max depth of one.
    toHaveChanged(received, fromValue, toValue) {
        const hasDifference = Object.keys(toValue).every(key => {
            return JSON.stringify(received[key]) === JSON.stringify(toValue[key]) &&
                JSON.stringify(fromValue[key]) !== JSON.stringify(received[key]);
        });

        const allKeysMatch = Object.keys(toValue).every(key =>
            received.hasOwnProperty(key)
        );

        const totalFromValue = { ...fromValue, ...toValue };

        const matched_result = JSON.stringify(totalFromValue) === JSON.stringify(received)

        const pass = hasDifference && allKeysMatch && matched_result;

        const message = pass
            ? () => `expected ${JSON.stringify(received)} not to have changed from ${JSON.stringify(fromValue)} to ${JSON.stringify(totalFromValue)}`
            : () => `expected ${JSON.stringify(received)} to have changed from ${JSON.stringify(fromValue)} to ${JSON.stringify(totalFromValue)}`;

        return { message, pass };
    },
});