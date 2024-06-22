import { test } from 'vitest';
import { screen } from '@testing-library/react';
import { renderProvide } from './create-wrapper';
import { Applications } from '@/components/Application/Applications';

test('Page', () => {
    renderProvide(<Applications />);
    screen.getByText('Loading...');
});
