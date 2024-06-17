import { test } from 'vitest';
import { screen } from '@testing-library/react';
import { renderProvide } from './create-wrapper';
import ManageMembers from '@/components/Space/ManageMembers';

test('Page', () => {
    renderProvide(<ManageMembers />);
    screen.getByText('Profiles');
});
