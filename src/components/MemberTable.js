import * as React from "react";
import {
    Table
} from 'react-bootstrap';

class MemberTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            members: []
        };
    }

    componentDidMount() {
        fetch("https://localhost:3000/members")
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        isLoaded: true,
                        members: result.members
                    });
                },
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
                (error) => {
                    this.setState({
                        isLoaded: true,
                        error
                    });
                }
            )
    }

    render() {
        const { error, isLoaded, members } = this.state;
        if (error) {
            return <div>Error: {error.message}</div>;
        } else if (!isLoaded) {
            return <div>Loading...</div>;
        } else {
            return (
                <Table striped bordered hover size="sm">
                    <thead>
                        <tr>
                            <th>Person</th>
                            <th>Consumption</th>
                        </tr>
                    </thead>
                    <tbody>
                        {members.map(member => (
                            <tr>
                                <td>member.member</td>
                                <td>member.consumptions</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            );
        }
    }
}