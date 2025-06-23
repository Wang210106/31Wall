export function throttle(fn, interval = 200) {
    let flag = null;
    return function(...args) {
        if (!flag) {
            flag = true;
            setTimeout(() => {
                flag = false;
                fn.call(this, ...args);
            }, interval);
        }
    }
} 

export function debounce(fn, delay = 200) {
    if (typeof fn !== 'function') { // 参数类型为函数
        throw new TypeError('fn is not a function');
    }
    
    let lastFn = null; 
    return function(...args) {
        if (lastFn) {
             clearTimeout(lastFn);
        }
        let lastFn = setTimeout(() => {
            lastFn = null;
            fn.call(this, ...args);
        }, delay);
    }
}