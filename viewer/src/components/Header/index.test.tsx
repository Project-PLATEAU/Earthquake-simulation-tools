/**
 * @jest-environment jsdom
 */
import React, { useState } from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { renderHook } from '@testing-library/react-hooks';
import Header from '.';
import { context } from '@/pages/_app';
import { Preferences } from '../LayerFilter/loader';
import { RecoilRoot } from 'recoil';

jest.mock('@/components/Map', () => {
  return function DummyPages(props) {
    return <div>page</div>;
  };
});

jest.mock('@/components/Tooltip/content', () => {
  return function DummyPages(props) {
    return <div>Tooltip</div>;
  };
});

describe('Rendering', () => {
  const _context: any = {};
  const mockSettings = {
    title: 'test title',
    background_color: '#00BEBE',
  };
  _context.preferences = { settings: mockSettings };
  it('title in json', () => {
    const {
      result: {
        current: [_preferences, setPreferences],
      },
    } = renderHook(() => useState<Preferences | null>(null));
    const {
      result: {
        current: [],
      },
    } = renderHook(() => useState<string>(''));
    const header = render(
      <RecoilRoot>
        <context.Provider value={_context}>
          <Header setPreferrence={setPreferences} />
        </context.Provider>
      </RecoilRoot>
    );

    // jsonから取得したtitleが表示されている
    expect(header.getByText(mockSettings.title) instanceof HTMLElement).toBeTruthy();
  });
});
