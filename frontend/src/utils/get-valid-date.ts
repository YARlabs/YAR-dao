
function getValidDate(timestamp: number) {
    const date = new Date(timestamp);
    return `${date.getDate()}.${date.getMonth() + 1} - ${date.getHours()}:${date.getMinutes()}`;
}

export { getValidDate };