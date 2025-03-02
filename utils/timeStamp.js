function formatTimestamp0(timestamp) {
    const date = new Date(timestamp);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${month}-${day} ${hours}:${minutes}`;
}

function formatTimestamp1(timestamp) {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}
  
function formatDateString(isoString) {
    const [datePart, timePart] = isoString.replace(/:\d{2}\.\d{3}Z$/, '').split('T');
    return `${datePart} ${timePart}`;
}

function parseISODate(dateString) {
    const parts = dateString.match(/(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})\.(\d{3})Z/);
    if (parts) {
        const [ , year, month, day, hours, minutes, seconds, milliseconds ] = parts;
        return new Date(Date.UTC(
            parseInt(year, 10),
            parseInt(month, 10) - 1, // Months are zero-indexed in JavaScript
            parseInt(day, 10),
            parseInt(hours, 10),
            parseInt(minutes, 10),
            parseInt(seconds, 10),
            parseInt(milliseconds, 10)
        ));
    }
    return null; // Return null if the date string is not in the expected format
}

function convertUtcToUtcPlus8(utcTime) {
    // 创建一个 Date 对象
    const date = new Date(utcTime);
 
    // UTC+8 的时区偏移量（毫秒）
    const utcOffsetMilliseconds = 8 * 60 * 60 * 1000;
 
    // 计算 UTC+8 时间的毫秒数
    const utcPlus8Milliseconds = date.getTime() - utcOffsetMilliseconds;
 
    // 创建一个新的 Date 对象来表示 UTC+8 时间
    const utcPlus8Date = new Date(utcPlus8Milliseconds);
 
    // 格式化日期和时间为 'YYYY-MM-DD HH:mm:ss'
    const year = utcPlus8Date.getFullYear();
    const month = String(utcPlus8Date.getMonth() + 1).padStart(2, '0'); // 月份从0开始，需要加1
    const day = String(utcPlus8Date.getDate()).padStart(2, '0');
    const hours = String(utcPlus8Date.getHours()).padStart(2, '0');
    const minutes = String(utcPlus8Date.getMinutes()).padStart(2, '0');
    const seconds = String(utcPlus8Date.getSeconds()).padStart(2, '0');
 
    return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
}

module.exports = {
    formatTimestamp0,
    formatTimestamp1,
    formatDateString,
    parseISODate,
    convertUtcToUtcPlus8,
}