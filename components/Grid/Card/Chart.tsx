import { Chart as ChartType, GroupBy } from '@zenstackhq/runtime/models';
import { Bar, BarChart, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { groupByTypes } from '@/components/Grid/Table/CardTableComponent';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export function Chart({ data: dataProps, chart, groupBy }: { data: any[]; chart: ChartType; groupBy: GroupBy }) {
    function getComponent() {
        if (!dataProps.length) {
            return <></>;
        }
        const dataKey = groupBy.fields[0];

        let property = '';
        let field = '';
        for (const groupByType of groupByTypes) {
            if (groupBy[groupByType]?.length) {
                property = `_${groupByType}`;
                field = groupBy[groupByType][0];
            }
        }
        if (!property || !field) {
            throw `Should define one of ${groupByTypes.join(', ')}`;
        }

        const data = dataProps.map((item) => ({ ...item, value: item[property][field] }));
        switch (chart.type) {
            case 'BarChart': {
                return (
                    <BarChart data={data}>
                        <XAxis dataKey={dataKey} stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                        <Bar dataKey="value" radius={[4, 4, 0, 0]} />
                    </BarChart>
                );
            }
            case 'PieChart': {
                return (
                    <PieChart width={800} height={400}>
                        <Pie
                            data={data}
                            cx={120}
                            cy={200}
                            innerRadius={60}
                            outerRadius={80}
                            fill="#8884d8"
                            paddingAngle={5}
                            dataKey={dataKey}
                        >
                            {data.map((_, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                    </PieChart>
                );
            }
        }
    }
    return (
        <ResponsiveContainer width="100%" height={350}>
            {getComponent()}
        </ResponsiveContainer>
    );
}
