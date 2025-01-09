import React from 'react';
import Content from '../components/Content';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  BarChart, Bar,
  AreaChart, Area,
  PieChart, Pie, Cell,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ScatterChart, Scatter,
  ComposedChart,
  Treemap,
  ResponsiveContainer
} from 'recharts';

const data = [
  { name: 'Jan', value: 4000, value2: 2400, value3: 100 },
  { name: 'Feb', value: 3000, value2: 1398, value3: 200 },
  { name: 'Mar', value: 2000, value2: 9800, value3: 300 },
  { name: 'Apr', value: 2780, value2: 3908, value3: 400 },
  { name: 'May', value: 1890, value2: 4800, value3: 500 },
  { name: 'Jun', value: 2390, value2: 3800, value3: 600 },
  { name: 'Jul', value: 3490, value2: 4300, value3: 700 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF69B4', '#00FFFF', '#ADFF2F', '#FFA500', '#800080'];

const ChartPage = () => {
  const styles = {
    chartContainer: { width: '100%', height: 300, marginBottom: '20px', border: "1px solid #ccc", padding: "10px", borderRadius: "10px" },
    page: { padding: "20px" }
  };

  return (
    <Content title="Chart Page">
    <div style={styles.page}>
      <h1>10 Different Types of Charts</h1>

      {/* 1. Line Chart */}
      <div style={styles.chartContainer}>
        <h2>Line Chart</h2>
        <ResponsiveContainer>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="value" stroke={COLORS[0]} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* 2. Bar Chart */}
      <div style={styles.chartContainer}>
        <h2>Bar Chart</h2>
        <ResponsiveContainer>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill={COLORS[1]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 3. Area Chart */}
      <div style={styles.chartContainer}>
        <h2>Area Chart</h2>
        <ResponsiveContainer>
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Area type="monotone" dataKey="value" stroke={COLORS[2]} fill={COLORS[2]} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* 4. Pie Chart */}
        <div style={styles.chartContainer}>
            <h2>Pie Chart</h2>
            <ResponsiveContainer>
                <PieChart>
                    <Pie dataKey="value" isAnimationActive={false} data={data} cx="50%" cy="50%" outerRadius={80} label>
                        {
                            data.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)
                        }
                    </Pie>
                    <Tooltip/>
                </PieChart>
            </ResponsiveContainer>
        </div>

      {/* 5. Radar Chart */}
      <div style={styles.chartContainer}>
        <h2>Radar Chart</h2>
        <ResponsiveContainer>
          <RadarChart outerRadius={90} data={data}>
            <PolarGrid />
            <PolarAngleAxis dataKey="name" />
            <PolarRadiusAxis />
            <Radar name="Value" dataKey="value" stroke={COLORS[4]} fill={COLORS[4]} fillOpacity={0.6} />
            <Tooltip />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* 6. Scatter Chart */}
      <div style={styles.chartContainer}>
        <h2>Scatter Chart</h2>
        <ResponsiveContainer>
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid />
            <XAxis type="number" dataKey="value2" name="Value 2" unit="units" />
            <YAxis type="number" dataKey="value" name="Value" unit="units" />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} />
            <Scatter name="A school" data={data} fill={COLORS[5]} />
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      {/* 7. Composed Chart */}
      <div style={styles.chartContainer}>
        <h2>Composed Chart</h2>
        <ResponsiveContainer>
          <ComposedChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid stroke="#f5f5f5" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area type="monotone" dataKey="value" fill={COLORS[6]} stroke={COLORS[6]} />
            <Bar dataKey="value2" barSize={20} fill={COLORS[7]} />
            <Line type="monotone" dataKey="value3" stroke={COLORS[8]} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* 8. Treemap */}
      <div style={styles.chartContainer}>
        <h2>Treemap</h2>
        <ResponsiveContainer>
          <Treemap
            data={data}
            dataKey="value"
            ratio={4 / 3}
            stroke="#fff"
            fill={COLORS[9]}
          />
        </ResponsiveContainer>
      </div>

        {/* 9. Another Line Chart (Stacked) */}
        <div style={styles.chartContainer}>
            <h2>Stacked Line Chart</h2>
            <ResponsiveContainer>
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3"/>
                    <XAxis dataKey="name"/>
                    <YAxis/>
                    <Tooltip/>
                    <Legend />
                    <Line type="monotone" dataKey="value" stroke={COLORS[0]} fill={COLORS[0]}/>
                    <Line type="monotone" dataKey="value2" stroke={COLORS[1]} fill={COLORS[1]}/>
                </LineChart>
            </ResponsiveContainer>
        </div>

        {/* 10. Another Bar Chart (Stacked) */}
        <div style={styles.chartContainer}>
            <h2>Stacked Bar Chart</h2>
            <ResponsiveContainer>
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3"/>
                    <XAxis dataKey="name"/>
                    <YAxis/>
                    <Tooltip/>
                    <Legend />
                    <Bar dataKey="value" stackId="a" fill={COLORS[0]} />
                    <Bar dataKey="value2" stackId="a" fill={COLORS[1]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    </div>
    </Content>
  );
};

export default ChartPage;