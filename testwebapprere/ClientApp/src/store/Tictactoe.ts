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

export enum Status {
    Pending,
    Draw,
    Win,
}

export interface TictactoeState {
    grid: Grid;
    nextIs: Hit;
    status: Status;
}

function createGrid(size: number): Grid {
    const grid: Grid = { rows: [], size: size };
    for (let i = 0; i < grid.size; ++i) {
        grid.rows.push({ cells: Array(grid.size).fill(undefined) });
    }
    return grid;
}

function hitGrid(state: TictactoeState, location: Location): TictactoeState {
    if (state.status !== Status.Pending)
        return state;
    const previous_hit = state.grid.rows[location.y].cells[location.x];
    if (previous_hit !== undefined)
        return state;
    const new_grid: Grid = { rows: state.grid.rows, size: state.grid.size };
    new_grid.rows[location.y].cells = new_grid.rows[location.y].cells.slice();
    new_grid.rows[location.y].cells[location.x] = state.nextIs;
    return {
        grid: new_grid,
        nextIs: state.nextIs === Hit.X ? Hit.O : Hit.X,
        status: computeStatus(state.nextIs, new_grid, location),
    };
}

function isRowWin(hit: Hit, grid: Grid, location: Location): boolean {
    for (let x = 0; x < grid.size; ++x) {
        if (grid.rows[location.y].cells[x] !== hit)
            return false;
    }
    return true;
}

function isColWin(hit: Hit, grid: Grid, location: Location): boolean {
    for (let y = 0; y < grid.size; ++y) {
        if (grid.rows[y].cells[location.x] !== hit)
            return false;
    }
    return true;
}

function isDiagDescending(hit: Hit, grid: Grid, location: Location): boolean {
    if (location.x != location.y)
        return false;
    for (let i = 0; i < grid.size; ++i)
        if (grid.rows[i].cells[i] !== hit)
            return false;
    return true;
}

function isDiagAscending(hit: Hit, grid: Grid, location: Location): boolean {
    if (location.x != grid.size - 1 - location.y)
        return false;
    for (let i = 0; i < grid.size; ++i)
        if (grid.rows[grid.size - 1 - i].cells[i] !== hit)
            return false;
    return true;
}

function isFull(grid: Grid): boolean {
    for (let y = 0; y < grid.rows.length; ++y) {
        for (let x = 0; x < grid.rows.length; ++x) {
            if (grid.rows[y].cells[x] == undefined)
                return false;
        }
    }
    return true;
}

function computeStatus(hit: Hit, grid: Grid, location: Location): Status {
    if (isRowWin(hit, grid, location))
        return Status.Win;
    if (isColWin(hit, grid, location))
        return Status.Win;
    if (isDiagDescending(hit, grid, location))
        return Status.Win;
    if (isDiagAscending(hit, grid, location))
        return Status.Win;
    if (isFull(grid))
        return Status.Draw;
    return Status.Pending;
}

// -----------------
// ACTIONS - These are serializable (hence replayable) descriptions of state transitions.
// They do not themselves have any side-effects; they just describe something that is going to happen.
// Use @typeName and isActionType for type detection that works even after serialization/deserialization.

export interface HitAction { type: 'HIT', location : Location }

// Declare a 'discriminated union' type. This guarantees that all references to 'type' properties contain one of the
// declared type strings (and not any other arbitrary string).
export type KnownAction = HitAction;

// ----------------
// ACTION CREATORS - These are functions exposed to UI components that will trigger a state transition.
// They don't directly mutate state, but they can have external side-effects (such as loading data).

export const actionCreators = {
    hit: (location: Location) => ({ type: 'HIT', location : location } as HitAction)
};

// ----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.

export const reducer: Reducer<TictactoeState> = (state: TictactoeState | undefined, incomingAction: Action): TictactoeState => {
    if (state === undefined) {
        return { grid: createGrid(3), nextIs: Hit.X, status: Status.Pending };
    }

    const action = incomingAction as KnownAction;
    switch (action.type) {
        case 'HIT':
            return hitGrid(state, action.location);
        default:
            return state;
    }
};
