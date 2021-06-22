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
                    width={"700px"}
                    height={"500px"}
                    chartType="PieChart"
                    loader={<div>Loading Chart</div>}
                    data={this.props.pieChartData}
                    legendToggle
                />
            );
        }
    }
}

export default PieChart;