
'use client';

import PageHeader from '@/components/shared/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import type { MetricCardProps, Segment } from '@/lib/types';
import { Users, TrendingUp, MailOpen, Target, DollarSign, ArrowUpCircle, ArrowDownCircle, Activity, BarChartBig } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

const MetricCard = ({ title, value, icon: Icon, trend, trendDirection }: MetricCardProps) => (
  <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      <Icon className="h-5 w-5 text-primary" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold text-foreground">{value}</div>
      {trend && (
        <p className={`text-xs mt-1 ${trendDirection === 'up' ? 'text-green-600' : 'text-red-600'} flex items-center`}>
          {trendDirection === 'up' ? <ArrowUpCircle className="h-4 w-4 mr-1" /> : <ArrowDownCircle className="h-4 w-4 mr-1" />}
          {trend}
        </p>
      )}
    </CardContent>
  </Card>
);

const campaignPerformanceData = [
  { name: 'Jan', відкриття: 4000, кліки: 2400, конверсії: 1200 },
  { name: 'Feb', відкриття: 3000, кліки: 1398, конверсії: 900 },
  { name: 'Mar', відкриття: 2000, кліки: 9800, конверсії: 1500 },
  { name: 'Apr', відкриття: 2780, кліки: 3908, конверсії: 1800 },
  { name: 'May', відкриття: 1890, кліки: 4800, конверсії: 2100 },
  { name: 'Jun', відкриття: 2390, кліки: 3800, конверсії: 2500 },
];

const customerSegmentData = [
  { name: 'New Users', value: 400, color: 'hsl(var(--chart-1))' },
  { name: 'Active Users', value: 1200, color: 'hsl(var(--chart-2))'  },
  { name: 'VIP Customers', value: 300, color: 'hsl(var(--chart-3))'  },
  { name: 'Churn Risk', value: 150, color: 'hsl(var(--chart-4))'  },
];

const recentActivity = [
  { id: 1, description: "Campaign 'Summer Sale' launched.", time: "2 hours ago", icon: MailOpen },
  { id: 2, description: "New segment 'High Value Customers' created.", time: "1 day ago", icon: Users },
  { id: 3, description: "Analytics report for Q2 generated.", time: "3 days ago", icon: BarChartBig },
];

const mockSegments: Segment[] = [
  { id: '1', name: 'High Engagement Users', description: 'Users who frequently open emails and click links.', customerCount: 1250, criteria:{} },
  { id: '2', name: 'Recent Signups', description: 'Users who signed up in the last 30 days.', customerCount: 300, criteria:{} },
  { id: '3', name: 'Potential Churn', description: 'Users with decreasing activity.', customerCount: 150, criteria:{} },
];


export default function DashboardContent() {
  return (
    <div className="space-y-6 md:space-y-8">
      <PageHeader title="Dashboard" description="Welcome! Here's an overview of your customer engagement." />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard title="Total Customers" value="1,875" icon={Users} trend="+5.2% this month" trendDirection="up" />
        <MetricCard title="Active Campaigns" value="12" icon={MailOpen} />
        <MetricCard title="Overall Engagement" value="28.5%" icon={TrendingUp} trend="-1.1% this week" trendDirection="down" />
        <MetricCard title="Revenue Generated" value="$12,450" icon={DollarSign} trend="+$800 this month" trendDirection="up" />
      </div>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
        <Card className="lg:col-span-2 shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline text-xl">Campaign Performance</CardTitle>
            <CardDescription>Monthly overview of email opens, clicks, and conversions.</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={campaignPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip
                  contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', borderRadius: 'var(--radius)'}}
                  labelStyle={{ color: 'hsl(var(--foreground))' }}
                  itemStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <Legend wrapperStyle={{fontSize: "12px"}}/>
                <Bar dataKey="відкриття" fill="hsl(var(--primary))" name="Opens" radius={[4, 4, 0, 0]} />
                <Bar dataKey="кліки" fill="hsl(var(--accent))" name="Clicks" radius={[4, 4, 0, 0]} />
                <Bar dataKey="конверсії" fill="hsl(var(--chart-3))" name="Conversions" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline text-xl">Customer Segments</CardTitle>
            <CardDescription>Distribution of customers across key segments.</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={customerSegmentData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} labelLine={false}
                  label={({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
                    const RADIAN = Math.PI / 180;
                    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                    const x = cx + radius * Math.cos(-midAngle * RADIAN);
                    const y = cy + radius * Math.sin(-midAngle * RADIAN);
                    return (
                      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize={12}>
                        {`${(percent * 100).toFixed(0)}%`}
                      </text>
                    );
                  }}
                >
                  {customerSegmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', borderRadius: 'var(--radius)'}}
                />
                <Legend wrapperStyle={{fontSize: "12px"}}/>
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline text-xl">Quick Segments Overview</CardTitle>
             <CardDescription>Key customer groups and their sizes.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {mockSegments.map(segment => (
                <li key={segment.id} className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                  <div>
                    <h3 className="font-medium text-foreground">{segment.name}</h3>
                    <p className="text-xs text-muted-foreground">{segment.description}</p>
                  </div>
                  <div className="text-sm font-semibold text-primary">{segment.customerCount.toLocaleString()} users</div>
                </li>
              ))}
            </ul>
             <Button variant="outline" className="mt-4 w-full">View All Segments</Button>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline text-xl">Recent Activity</CardTitle>
            <CardDescription>Latest updates and actions in your workspace.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {recentActivity.map(activity => (
                <li key={activity.id} className="flex items-start gap-3">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <activity.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-foreground">{activity.description}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-xl">Need Help or Inspiration?</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-4">
            <div className="flex flex-col items-center justify-center p-6 bg-secondary/30 rounded-lg text-center">
                <Image src="https://placehold.co/600x400.png" alt="Tutorials" width={150} height={100} className="rounded-md mb-3" data-ai-hint="education tutorial" />
                <h3 className="font-semibold text-foreground mb-1">Watch Tutorials</h3>
                <p className="text-xs text-muted-foreground mb-2">Learn how to maximize ClientPulse features.</p>
                <Button variant="outline" size="sm">Browse Videos</Button>
            </div>
            <div className="flex flex-col items-center justify-center p-6 bg-secondary/30 rounded-lg text-center">
                <Image src="https://placehold.co/600x400.png" alt="Community" width={150} height={100} className="rounded-md mb-3" data-ai-hint="community forum" />
                <h3 className="font-semibold text-foreground mb-1">Join Community</h3>
                <p className="text-xs text-muted-foreground mb-2">Connect with other users and share tips.</p>
                <Button variant="outline" size="sm">Visit Forum</Button>
            </div>
        </CardContent>
      </Card>

    </div>
  );
}

