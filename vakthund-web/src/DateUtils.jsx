const getFriendlyDate = (dateString) => {
    let date = new Date(dateString);
    return `${date.toDateString()}, ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
};

export { getFriendlyDate };