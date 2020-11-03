import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { ApplicationState } from '../store';
import * as TictactoeStore from '../store/Tictactoe';
import './Tictactoe.css';

type TictactoeProps =
    TictactoeStore.TictactoeState &
    typeof TictactoeStore.actionCreators &
    RouteComponentProps<{}>;

function hitText(hit: TictactoeStore.Hit | undefined): string {
    switch (hit) {
        case undefined:
            return '';
        case TictactoeStore.Hit.X:
            return 'X';
        case TictactoeStore.Hit.O:
            return 'O';
    }
}

function statusText(status: TictactoeStore.Status, nextIs: TictactoeStore.Hit): string {
    switch (status) {
        case TictactoeStore.Status.Pending: return "Next is " + (nextIs === TictactoeStore.Hit.X ? 'X' : 'O');
        case TictactoeStore.Status.Draw: return "Draw";
        case TictactoeStore.Status.Win: return "Winner is " + (nextIs === TictactoeStore.Hit.X ? 'O' : 'X');
    }
}

class Tictactoe extends React.PureComponent<TictactoeProps> {
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
                <h1>TICTACTOE</h1>
                <div className="game">
                    <div className="game-board">{rows}</div>
                    <div className="game-info">Status: {statusText(this.props.status, this.props.nextIs)}</div>
                </div>
            </React.Fragment>
        );
    }
};

export default connect(
    (state: ApplicationState) => state.tictactoe,
    TictactoeStore.actionCreators
)(Tictactoe);
