import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { ApplicationState } from '../store';
import * as BattleStore from '../store/Battle';
import './Battle.css';

type BattleProps =
    BattleStore.BattleState &
    typeof BattleStore.actionCreators &
    RouteComponentProps<{}>;

function createGridPanel(props: Readonly<BattleProps>): any {
    const rows = [];
    for (let y = 0; y < props.grid.size; ++y) {
        const cells = [];
        for (let x = 0; x < props.grid.size; ++x) {
            cells.push(
                <button
                    className="square"
                    key={x}
                >
                    {BattleStore.isHittingBoat(props.grid, { x: x, y: y }) ? 'O' : ''}
                </button>
            );
        }
        rows.push(<div className="board-row" key={y}>{cells}</div>);
    }
    return <div className="game-board">{rows}</div>
}

function createBoatsPanel(props: Readonly<BattleProps>): any {
    //const remainingBoats = this.props.grid.boats.filter((boat) => boat.location === undefined).map((boat) => {
    //    return (
    //        <button className="square"
    //            key={boat.name}
    //            onClick={() => this.props.selectBoat(boat)}
    //        >
    //            {boat.name}
    //        </button>
    //    );
    //});
    return <div className="game-info"></div>
}

class Battle extends React.PureComponent<BattleProps> {
    public render() {
        return (
            <React.Fragment>
                <h1>BATTLE</h1>
                <div className="game">
                    {createGridPanel(this.props)}
                    {createBoatsPanel(this.props)}
                </div>
            </React.Fragment>
        );
    }
};

export default connect(
    (state: ApplicationState) => state.battle,
    BattleStore.actionCreators
)(Battle);
