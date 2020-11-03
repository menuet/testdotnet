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

class Tictactoe extends React.PureComponent<TictactoeProps> {
    public render() {
        const rows = this.props.grid.rows.map((row, rowIndex) => {
            const cells = row.cells.map((hit, cellIndex) => {
                return (
                    <button className="square" key={cellIndex}>{hit !== undefined ? (hit == TictactoeStore.Hit.X ? 'X' : 'O') : ''}</button>
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
                    <div className="game-info"></div>
                </div>
            </React.Fragment>
        );
    }
};

export default connect(
    (state: ApplicationState) => state.tictactoe,
    TictactoeStore.actionCreators
)(Tictactoe);
