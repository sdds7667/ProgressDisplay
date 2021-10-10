import React from 'react';
import './App.css';
import {Calendar} from "./components/Calendar/Calendar";
import {ClientApi} from "./api/client.api";
import {CalendarUtility} from "./utility/CalendarUtility";

type AppProps = {};
type AppState = {
    data?: [string, number][]
};
class App extends React.Component<AppProps, AppState> {
    clientAPI: ClientApi;
    constructor(props: AppProps) {
        super(props);
        this.state = {
            data : undefined
        }
        this.clientAPI = new ClientApi();
    }

    componentDidMount() {
        this.clientAPI.pullData().then(() => {
            this.setState({data: this.clientAPI.data})
        });
    }

    static toDayList(data?: [string, number][]) : number[] {
        let ret =  Array.from(new Int8Array(CalendarUtility.getDaysInMonth()));
        data = data || [];
        data.forEach((value => {
            let dayValue: string[]= value[0].split("-");
            ret[parseInt(dayValue[2]) - 1] = value[1];
        }))
        return ret;
    }

    render() {
        return (
            <div className="App">
                <Calendar problemsSolved={App.toDayList(this.state.data)}/>
            </div>
        );
    }
}

export default App;
