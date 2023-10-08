import { create } from "zustand";
import { Drug, Outcome, PlayerStatus } from "../dojo/types";

export type DrugType = {
  [key in Drug]: {
    quantity: number;
  };
};

export enum TradeDirection {
  Buy,
  Sell,
}

export type TradeType = {
  quantity: number;
  direction: TradeDirection;
};

export type Encounter = {
  status: PlayerStatus;
  outcome: Outcome;
};

export type HistoryItem =
  | {
      type: "trade";
      data: TradeType & { drug: Drug };
    }
  | {
      type: "encounter";
      data: Encounter;
    };

export type DayHistory = {
  locationId: string;
  items: HistoryItem[];
};

export interface PlayerStore {
  encounters: Encounter[];
  lastEncounter: Encounter | null;
  trades: Map<Drug, TradeType>;
  history: DayHistory[];
  addEncounter: (status: PlayerStatus, outcome: Outcome) => void;
  addTrade: (drug: Drug, trade: TradeType) => void;
  resetTurn: (playerLocationId: string) => void;
  resetAll: () => void;
}

export const usePlayerStore = create<PlayerStore>((set) => ({
  encounters: [],
  lastEncounter: null,
  trades: new Map(),
  history: [],

  addEncounter: (status: PlayerStatus, outcome: Outcome) => {
    const encounter = { status, outcome };
    set((state) => ({
      encounters: [...state.encounters, encounter],
      lastEncounter: encounter,
    }));
  },
  addTrade: (drug: Drug, trade: TradeType) =>
    set((state) => {
      const existingTrade = state.trades.get(drug);

      if (!existingTrade) {
        state.trades.set(drug, trade);
        return { trades: new Map(state.trades) };
      }

      let quantity = existingTrade.quantity;
      let direction = existingTrade.direction;

      // if the existing trade has the same direction, add quantities
      if (quantity === trade.direction) {
        quantity += trade.quantity;
      } else {
        // if the existing trade has the opposite direction, subtract quantities
        quantity -= trade.quantity;

        // if negative quantity, reverse the direction and make the quantity positive
        if (quantity < 0) {
          quantity = -quantity;
          direction = trade.direction;
        }

        if (quantity === 0) {
          state.trades.delete(drug);
          return { trades: new Map(state.trades) };
        }
      }

      state.trades.set(drug, { quantity, direction });
      return { trades: new Map(state.trades) };
    }),
  resetTurn: (playerLocationId: string) =>
    set((state) => {
      const tradesForDay: HistoryItem[] = Array.from(
        state.trades.entries(),
      ).map(([drug, trade]) => ({
        type: "trade",
        data: { ...trade, drug },
      }));

      const currentDayItems: HistoryItem[] = tradesForDay;

      if (state.lastEncounter) {
        currentDayItems.push({
          type: "encounter",
          data: state.lastEncounter,
        });
      }

      const newDayHistory: DayHistory = {
        locationId: playerLocationId,
        items: currentDayItems,
      };

      return {
        trades: new Map(),
        lastEncounter: null,
        history: [...state.history, newDayHistory],
      };
    }),
  resetAll: () => {
    set({
      trades: new Map(),
      lastEncounter: null,
      encounters: [],
      history: [],
    });
  },
}));
