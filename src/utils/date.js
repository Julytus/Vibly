import moment from "moment";

export const dateHandler = (date) => {
    // let now = moment();
    let momentDate = moment(date);
    let time = momentDate.fromNow(true);
    let dateByHourAndMin = momentDate.format("HH:mm");
    const getDay = () => {
        let days = time.split(" ")[0];
        if (Number(days) === 0) {
            return "Today";
        }
        if (Number(days) === 1) {
            return "Yesterday";
        }
        return momentDate.format("DD/MM/YYYY");
    }
    if( time === "a few seconds" ) {
        return "Now";
    }
    if( time.search("minute") !== -1 ) {
        let mins = time.split(" ")[0];
        return `${mins}m ago`;
    }
    if( time.search("hour") !== -1 ) {
        return dateByHourAndMin;
    }
    return `${getDay()} at ${dateByHourAndMin}`;
}