import { atom } from 'recoil';
import { Deck } from '@deck.gl/core/typed';

export const ViewState = atom<Record<string, any>>({
  key: 'viewState',
  dangerouslyAllowMutability: true,
  default: [],
});

export const MapClickPositionState = atom<{ x: number; y: number } | undefined>({
  key: 'mapClickPositionState',
  dangerouslyAllowMutability: true,
  default: undefined,
});

export const DeckState = atom<Deck | undefined>({
  key: 'deckState',
  dangerouslyAllowMutability: true,
  default: undefined,
});
