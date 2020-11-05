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

function hitText(hit: BattleStore.Hit | undefined): string {
    switch (hit) {
        case undefined:
            return '';
        case BattleStore.Hit.X:
            return 'X';
        case BattleStore.Hit.O:
            return 'O';
    }
}

function statusText(status: BattleStore.Status, nextIs: BattleStore.Hit): string {
    switch (status) {
        case BattleStore.Status.Pending: return "Next is " + (nextIs === BattleStore.Hit.X ? 'X' : 'O');
        case BattleStore.Status.Draw: return "Draw";
        case BattleStore.Status.Win: return "Winner is " + (nextIs === BattleStore.Hit.X ? 'O' : 'X');
    }
}

class Battle extends React.PureComponent<BattleProps> {
    public render() {
        const rows = this.props.grid.rows.map((row, rowIndex) => {
            const cells = row.cells.map((hit, cellIndex) => {
                return (
                    <button
                        className="square"
                        key={cellIndex}
                        onClick={() => this.props.hit({ x: cellIndex, y: rowIndex })}
                    >
                        {hitText(hit)}
                    </button>
                );
            });
            return (
                <div className="board-row" key={rowIndex}>{cells}</div>
            );
        });
        return (
            <React.Fragment>
                <h1>BATTLE</h1>
                <div className="game">
                    <div className="game-board">{rows}</div>
                    <div className="game-info">Status: {statusText(this.props.status, this.props.nextIs)}</div>
                </div>
            </React.Fragment>
        );
    }
};

export default connect(
    (state: ApplicationState) => state.battle,
    BattleStore.actionCreators
)(Battle);
