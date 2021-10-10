import React from "react";
import "./Calendar.css"

type CalendarProps = {
    problemsSolved: number[];
}

class Calendar extends React.Component<CalendarProps, {}> {

    render() {
        let cy = new Date().getFullYear();
        let cm = new Date().getMonth();
        let maxProblems = Math.max(...this.props.problemsSolved);
        let paddingDays: number = new Date(cy, cm, 1).getDay() - 1;
        let cd = new Date().getDate();
        return <div className={"calendar-container"}>
            {["Ma", "Di", "Wo", "Do", "Vr", "Za", "Zo"].map((day) => <div className={"calendar-square-day"}>
                {day}
            </div>)}
            {Array.from(new Int8Array(paddingDays)).map((day, index) => {
                 return <div key={index + paddingDays} className={"calendar-square-padding"}>

                </div>
            })}
            {this.props.problemsSolved.map((problems, index) => {
                let color = "#708090";
                let red = 34;
                let blue = 34;
                let green = Math.floor((problems / maxProblems) * 200);
                if (problems) {
                    color = `rgb(${red}, ${green},${blue})`;
                }
                if (index < cd) {
                    return <div key={index + paddingDays} style={{backgroundColor: color}}
                                className={"calendar-square"}>

                    </div>
                } else {
                    return <div key={index + paddingDays} className={"calendar-square calendar-square-highlighted"} />
                }
            })}
        </div>;
    }
}

export {Calendar};