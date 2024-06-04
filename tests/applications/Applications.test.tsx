import { test } from 'vitest';
import { screen } from '@testing-library/react';
import { renderProvide } from '../create-wrapper';
import { Applications } from '@/components/Application/Applications';

test('Should display loader when no data', async () => {
    renderProvide(
        <Applications
            space={{
                createdAt: new Date(),
                id: 'test id',
                name: 'space name',
                updatedAt: new Date(),
            }}
        />
    );
    screen.getByText('Loading...');
});
