import { render, screen } from '@testing-library/react-native';
import { describe, expect, it } from '@jest/globals';
import React from 'react';

import { NotesEmptyState } from '@/src/features/notes/components/NotesEmptyState';

describe('NotesEmptyState', () => {
  it('renders expected empty-state message', () => {
    render(<NotesEmptyState />);

    expect(screen.getByText('When a passage confuses you, resolve it here instead of reading past it.')).toBeTruthy();
  });
});
