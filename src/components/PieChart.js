import * as React from "react";
import { Chart } from "react-google-charts";

class PieChart extends React.Component {
    constructor(props) {
        super(props);
        this.setState({
            pieData: []
        });
    }

    componentDidMount() {

    }

    getPieChartData(consumer) {

    }

    render() {
        console.log(this.props);
        if (this.props.error) {
            return <div>Error: {this.props.error.message}</div>;
        } else if (!this.props.isLoaded) {
            return <div>Loading...</div>;
        } else {

            this.getPieChartData(this.props.consumer);

            return (
                <Chart
                    width={"500px"}
                    height={"300px"}
                    chartType="PieChart"
                    loader={<div>Loading Chart</div>}
                    data={[
                        ['Beer Style', 'Number Consumed'],
                        ['Work', 11],
                        ['Eat', 2],
                        ['Commute', 2],
                        ['Watch TV', 2],
                        ['Sleep', 7],
                    ]}
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