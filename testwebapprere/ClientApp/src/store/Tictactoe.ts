import { Action, Reducer } from 'redux';

// -----------------
// STATE - This defines the type of data maintained in the Redux store.

export enum Hit { X, O }

export type Row = {
    cells: (Hit | undefined)[];
}

export type Grid = {
    rows: Row[];
    size: number;
}

export type Location = {
    x: number;
    y: number;
}

export interface TictactoeState {
    grid: Grid;
}

function createGrid(size: number): Grid {
    const grid: Grid = { rows: [], size: size };
    for (let i = 0; i < grid.size; ++i) {
        grid.rows.push({ cells: Array(grid.size).fill(undefined) });
    }
    return grid;
}

function hitGrid(grid: Grid, hit: Hit, location: Location): Grid {
    const previous_hit = grid.rows[location.y].cells[location.x];
    if (previous_hit !== undefined)
        return grid;
    const new_grid: Grid = { rows: grid.rows, size: grid.size };
    new_grid.rows[location.y].cells = new_grid.rows[location.y].cells.slice();
    new_grid.rows[location.y].cells[location.x] = hit;
    return new_grid;
}

// -----------------
// ACTIONS - These are serializable (hence replayable) descriptions of state transitions.
// They do not themselves have any side-effects; they just describe something that is going to happen.
// Use @typeName and isActionType for type detection that works even after serialization/deserialization.

export interface HitAction { type: 'HIT', hit : Hit, location : Location }

// Declare a 'discriminated union' type. This guarantees that all references to 'type' properties contain one of the
// declared type strings (and not any other arbitrary string).
export type KnownAction = HitAction;

// ----------------
// ACTION CREATORS - These are functions exposed to UI components that will trigger a state transition.
// They don't directly mutate state, but they can have external side-effects (such as loading data).

export const actionCreators = {
    hit: (hit: Hit, location: Location) => ({ type: 'HIT', hit : hit, location : location } as HitAction)
};

// ----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.

export const reducer: Reducer<TictactoeState> = (state: TictactoeState | undefined, incomingAction: Action): TictactoeState => {
    if (state === undefined) {
        return { grid: createGrid(2) };
    }

    const action = incomingAction as KnownAction;
    switch (action.type) {
        case 'HIT':
            return { grid: hitGrid(state.grid, action.hit, action.location) };
        default:
            return state;
    }
};
