import { useCurrentGrid } from '@/hooks/useCurrentGrid';
import { GridCard } from './Card/GridCard';
import { GridTabs } from './Tabs/GridTabs';
import { colSpans } from './utils';
import { FallbackError } from '../layout/FallbackError';
import { ErrorBoundary } from 'react-error-boundary';
import { useScopedI18n } from '@/locales';

export const Grid = () => {
    const grid = useCurrentGrid();

    if (!grid?.elements.length) {
        return <></>;
    }

    return (
        <div className={`grid gap-4 sm:grid-cols-12 md:grid-cols-12 lg:grid-cols-12 `}>
            {grid.elements.map((element) => {
                function getComponentRender() {
                    switch (element.type) {
                        case 'Card': {
                            return element.card ? <GridCard key={element.id} card={element.card} /> : <></>;
                        }
                        case 'Tabs': {
                            return element.tabs ? <GridTabs key={element.id} tabs={element.tabs} /> : <></>;
                        }
                        default:
                            throw 'Unsupport element type';
                    }
                }

                return (
                    <div
                        key={element.id}
                        className={`
                            ${element.colSpan ? colSpans[element.colSpan] : ''}
                            overflow-x-auto
                            `}
                    >
                        <ErrorBoundary fallback={<FallbackError />}>{getComponentRender()}</ErrorBoundary>
                    </div>
                );
            })}
        </div>
    );
};
