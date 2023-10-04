/* Autogenerated file. Do not edit manually. */

import { Type as RecsType } from "@latticexyz/recs";
import { GetTransactionReceiptResponse, Contract } from "starknet";

export enum WorldEvents {
  GameCreated = "0x230f942bb2087887c3b1dd964c716614bb6df172214f22409fefb734d96a4d2",
  PlayerJoined = "0x214916ce0265d355fd91110809ffba7b5e672b108a8beea3dd235818431264b",
  Bought = "0x20cb8131637de1953a75938db3477cc6b648e5ed255f5b3fe3f0fb9299f0afc",
  Sold = "0x123e760cef925d0b4f685db5e1ac87aadaf1ad9f8069122a5bb03353444c386",
  Traveled = "0x2c4d9d5da873550ed167876bf0bc2ae300ce1db2eeff67927a85693680a2328",
  AdverseEvent = "0x3605d6af5b08d01a1b42fa16a5f4dc202724f1664912948dcdbe99f5c93d0a0",
  MarketEvent = "0x255825b8769ab99d6c1bd893b440a284a39d8db18c76b91e8e6a70ef5c7a8e0",
  Decision = "0xc9315f646a66dd126a564fa76bfdc00bdb47abe0d8187e464f69215dbf432a",
  Consequence = "0x1335a57b72e0bcb464f40bf1f140f691ec93e4147b91d0760640c19999b841d",
  Event0 = "0x3afb3b58bf8e783fbdb6e86c3ce32687fa2b0ab2150271d34182b6f880b8d6b",
  Event1 = "0xf162b534b1ed5 dbffafa76c1965da8a0597c8b6d5e469f9e603736977852f1",
}

export interface GameCreatedData {
  game_id: RecsType.Number;
  game_mode: RecsType.String;
  creator: RecsType.String;
  start_time: RecsType.Number;
  max_turns: RecsType.Number;
  max_players: RecsType.Number;
}

export interface PlayerJoinedData {
  game_id: RecsType.Number;
  player_id: RecsType.String;
  player_name: RecsType.BigInt;
}

export interface BoughtData {
  game_id: RecsType.Number;
  player_id: RecsType.String;
  drug_id: RecsType.BigInt;
  quantity: RecsType.Number;
  cost: RecsType.BigInt;
}

export interface SoldData {
  game_id: RecsType.Number;
  player_id: RecsType.String;
  drug_id: RecsType.BigInt;
  quantity: RecsType.Number;
  payout: RecsType.BigInt;
}

export interface TraveledData {
  game_id: RecsType.Number;
  player_id: RecsType.String;
  from_location: RecsType.BigInt;
  to_location: RecsType.BigInt;
}

export interface AdverseEventData {
  game_id: RecsType.Number;
  player_id: RecsType.String;
  player_status: RecsType.String;
}

export interface MarketEventData {
  game_id: RecsType.Number;
  location_id: RecsType.BigInt;
  drug_id: RecsType.BigInt;
  increase: RecsType.Boolean;
}

export interface DecisionData {
  game_id: RecsType.Number;
  player_id: RecsType.String;
  action: RecsType.String;
}

export interface ConsequenceData {
  game_id: RecsType.Number;
  player_id: RecsType.String;
  outcome: RecsType.String;
  health_loss: RecsType.Number;
  drug_loss: RecsType.Number;
  cash_loss: RecsType.BigInt;
}

export interface Event0Data {
  caller: RecsType.String;
}

export interface Event1Data {
  caller: RecsType.String;
  id: RecsType.Number;
  value: RecsType.BigInt;
}
