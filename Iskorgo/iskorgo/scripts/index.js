/**
 * This is to load each JS file one-by-one in the order desired.
 */

(async () => {
    await import('./backend.js');  
    await import('./delegator.js');
    await import('./navigation.js');
})();