import { Action, Reducer } from 'redux';

// -----------------
// STATE - This defines the type of data maintained in the Redux store.

export type Location = {
    x: number;
    y: number;
}

export enum Orientation { Horizontal, Vertical }

export type Boat = {
    name: string;
    size: number;
}

export type BoatPosition = {
    boat: Boat;
    location: Location;
    orientation: Orientation;
}

export type Grid = {
    size: number;
    boats: Boat[];
    boatsPositions: BoatPosition[];
}

export enum Status {
    Positioning,
    Draw,
    Win,
}

export interface BattleState {
    grid: Grid;
    status: Status;
    selectedBoat: BoatPosition | undefined;
}

function isHittingTheBoat(boatPos: BoatPosition, location: Location): boolean {
    if (boatPos.orientation === Orientation.Horizontal)
        return location.y === boatPos.location.y &&
            location.x >= boatPos.location.x &&
            location.x < boatPos.location.x + boatPos.boat.size;
    return location.x === boatPos.location.x &&
        location.y >= boatPos.location.y &&
        location.y < boatPos.location.y + boatPos.boat.size;
}

export function hitBoat(grid: Grid, location: Location): BoatPosition | undefined {
    return grid.boatsPositions.find((boatPos) => isHittingTheBoat(boatPos, location));
}

function createBoats(): Boat[] {
    return [
        { name: "2", size: 2 },
        { name: "3a", size: 3 },
        { name: "3b", size: 3 },
        { name: "4", size: 4 },
        { name: "5", size: 5 },
    ];
}

function createBoatsPositions(boats: Boat[]): BoatPosition[] {
    return boats.map((boat, boatIndex) => {
        return {
            boat: boat,
            location: { y: boatIndex*2, x: boatIndex },
            orientation: Orientation.Horizontal,
        }
    });
}

function createGrid(size: number): Grid {
    const boats = createBoats();
    const boatsPositions = createBoatsPositions(boats);
    return { size: size, boats: createBoats(), boatsPositions: boatsPositions };
}

// -----------------
// ACTIONS - These are serializable (hence replayable) descriptions of state transitions.
// They do not themselves have any side-effects; they just describe something that is going to happen.
// Use @typeName and isActionType for type detection that works even after serialization/deserialization.

export interface SelectBoatAction { type: 'BATTLE_SELECT_BOAT', boat: Boat }
export interface HitAction { type: 'BATTLE_HIT', location: Location }

// Declare a 'discriminated union' type. This guarantees that all references to 'type' properties contain one of the
// declared type strings (and not any other arbitrary string).
export type KnownAction = SelectBoatAction | HitAction;

// ----------------
// ACTION CREATORS - These are functions exposed to UI components that will trigger a state transition.
// They don't directly mutate state, but they can have external side-effects (such as loading data).

export const actionCreators = {
    selectBoat: (boat: Boat) => ({ type: 'BATTLE_SELECT_BOAT', boat: boat } as SelectBoatAction),
    hit: (location: Location) => ({ type: 'BATTLE_HIT', location: location } as HitAction),
};

// ----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.

export const reducer: Reducer<BattleState> = (state: BattleState | undefined, incomingAction: Action): BattleState => {
    if (state === undefined) {
        return { grid: createGrid(10), status: Status.Positioning, selectedBoat: undefined };
    }

    const action = incomingAction as KnownAction;
    switch (action.type) {
        case 'BATTLE_HIT':
            return { grid: state.grid, status: state.status, selectedBoat: hitBoat(state.grid, action.location)};
        case 'BATTLE_SELECT_BOAT':
            return state;
        default:
            return state;
    }
};
