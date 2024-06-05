import { test } from 'vitest';
import { screen } from '@testing-library/react';
import { renderProvide } from './create-wrapper';
import { SpaceHomeComponent } from '@/components/Space/SpaceHomeComponent';

test('Page', () => {
    renderProvide(<SpaceHomeComponent />);
    screen.getByText('Components');
});
