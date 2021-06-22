import * as React from "react";
import { Chart } from "react-google-charts";

class PieChart extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {

    }

    render() {
        if (this.props.error) {
            return <div>Error: {this.props.error.message}</div>;
        } else if (!this.props.isLoaded) {
            return <div>Loading...</div>;
        } else {
            return (
                <Chart
                    width={"500px"}
                    height={"300px"}
                    chartType="PieChart"
                    loader={<div>Loading Chart</div>}
                    data={this.props.pieChartData}
                    options={
                        // Chart options
                        {
                            title: "Beer Consumed by " + this.props.consumer.name
                        }
                    }

                    legendToggle
                />
            );
        }
    }
}

export default PieChart;