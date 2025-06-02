
'use client';

import PageHeader from '@/components/shared/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import type { AnalyticsData } from '@/lib/types';
import { Users, TrendingUp, MailOpen, DollarSign, Percent, Target } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePickerWithRange } from "@/components/shared/date-range-picker"; // Assume this component exists or create a simple one
import type { DateRange } from "react-day-picker";
import { useState } from 'react';
import { addDays, format } from 'date-fns';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

const campaignPerformanceData: AnalyticsData[] = [
  { date: 'Jan', value: 28, category: 'Campaign A' }, { date: 'Jan', value: 35, category: 'Campaign B' },
  { date: 'Feb', value: 32, category: 'Campaign A' }, { date: 'Feb', value: 40, category: 'Campaign B' },
  { date: 'Mar', value: 45, category: 'Campaign A' }, { date: 'Mar', value: 30, category: 'Campaign B' },
  { date: 'Apr', value: 38, category: 'Campaign A' }, { date: 'Apr', value: 55, category: 'Campaign B' },
  { date: 'May', value: 50, category: 'Campaign A' }, { date: 'May', value: 42, category: 'Campaign B' },
  { date: 'Jun', value: 42, category: 'Campaign A' }, { date: 'Jun', value: 60, category: 'Campaign B' },
];

const customerEngagementData: AnalyticsData[] = [
  { date: 'Wk 1', value: 1200 }, { date: 'Wk 2', value: 1500 },
  { date: 'Wk 3', value: 1300 }, { date: 'Wk 4', value: 1700 },
  { date: 'Wk 5', value: 1600 }, { date: 'Wk 6', value: 1900 },
];

const revenueImpactData = [
  { name: 'Q1 Direct', value: 15000, color: 'hsl(var(--chart-1))' },
  { name: 'Q1 Influenced', value: 8000, color: 'hsl(var(--chart-2))' },
  { name: 'Q2 Direct', value: 18000, color: 'hsl(var(--chart-1))' },
  { name: 'Q2 Influenced', value: 10000, color: 'hsl(var(--chart-2))' },
];


const conversionRateBySegmentData = [
  { name: 'New Users', value: 5, color: 'hsl(var(--chart-1))' },
  { name: 'Active Users', value: 15, color: 'hsl(var(--chart-2))' },
  { name: 'VIP Customers', value: 25, color: 'hsl(var(--chart-3))' },
  { name: 'Churn Risk', value: 2, color: 'hsl(var(--chart-4))' },
];


// Simple DatePickerWithRange placeholder if not available
const DatePickerWithRangePlaceholder = ({ date, onDateChange }: { date?: DateRange, onDateChange: (range?: DateRange) => void }) => (
  <div className="flex items-center gap-2 p-2 border rounded-md">
    <input 
      type="date" 
      className="p-1 border rounded text-sm"
      value={date?.from ? format(date.from, 'yyyy-MM-dd') : ''}
      onChange={(e) => onDateChange({ from: new Date(e.target.value), to: date?.to })}
    />
    <span>-</span>
    <input 
      type="date" 
      className="p-1 border rounded text-sm"
      value={date?.to ? format(date.to, 'yyyy-MM-dd') : ''}
      onChange={(e) => onDateChange({ from: date?.from, to: new Date(e.target.value) })}
    />
  </div>
);


export default function AnalyticsContent() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: addDays(new Date(), -30),
    to: new Date(),
  });

  return (
    <div className="space-y-6 md:space-y-8">
      <PageHeader title="Analytics & Reporting" description="Dive deep into your campaign performance and customer engagement." />

      <Card className="shadow-lg">
        <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <CardTitle className="font-headline text-xl">Filters</CardTitle>
            <CardDescription>Select campaign, segment, and date range for reports.</CardDescription>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 mt-4 sm:mt-0 w-full sm:w-auto">
            <Select defaultValue="all-campaigns">
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="All Campaigns" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-campaigns">All Campaigns</SelectItem>
                <SelectItem value="campaign-a">Campaign A</SelectItem>
                <SelectItem value="campaign-b">Campaign B</SelectItem>
              </SelectContent>
            </Select>
             <DatePickerWithRangePlaceholder date={dateRange} onDateChange={setDateRange} />
          </div>
        </CardHeader>
      </Card>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline text-xl flex items-center"><MailOpen className="mr-2 h-5 w-5 text-primary" />Campaign Performance (Open Rates %)</CardTitle>
            <CardDescription>Open rates for selected campaigns over time.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={campaignPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} unit="%" />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', borderRadius: 'var(--radius)'}} />
                <Legend wrapperStyle={{fontSize: "12px"}}/>
                <Bar dataKey="value" name="Campaign A" fill="hsl(var(--primary))" radius={[4,4,0,0]}/>
                {/* Add more bars for different campaigns if needed */}
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline text-xl flex items-center"><Users className="mr-2 h-5 w-5 text-primary" />Customer Engagement (Active Users)</CardTitle>
            <CardDescription>Trend of active users engaging with campaigns.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={customerEngagementData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12}/>
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', borderRadius: 'var(--radius)'}} />
                <Legend wrapperStyle={{fontSize: "12px"}}/>
                <Line type="monotone" dataKey="value" name="Active Users" stroke="hsl(var(--accent))" strokeWidth={2} dot={{ r:4, fill: 'hsl(var(--accent))' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline text-xl flex items-center"><DollarSign className="mr-2 h-5 w-5 text-primary" />Revenue Impact ($)</CardTitle>
            <CardDescription>Direct and influenced revenue from campaigns.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
               <PieChart>
                <Pie data={revenueImpactData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
                   {revenueImpactData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', borderRadius: 'var(--radius)'}} />
                <Legend wrapperStyle={{fontSize: "12px"}}/>
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline text-xl flex items-center"><Target className="mr-2 h-5 w-5 text-primary" />Conversion Rate by Segment (%)</CardTitle>
            <CardDescription>How different customer segments convert.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={conversionRateBySegmentData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={90} paddingAngle={2} label>
                  {conversionRateBySegmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', borderRadius: 'var(--radius)'}} />
                <Legend wrapperStyle={{fontSize: "12px"}}/>
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
       <Card className="shadow-lg">
          <CardHeader>
              <CardTitle className="font-headline text-xl">Export Reports</CardTitle>
              <CardDescription>Download your analytics data for offline use or further analysis.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col sm:flex-row gap-4 items-center">
              <Image src="https://placehold.co/300x200.png" alt="Reports" width={150} height={100} className="rounded-md" data-ai-hint="data report" />
              <div className="flex-1">
                <p className="text-muted-foreground mb-4">Select the type of report you'd like to generate. Data will be based on current filters.</p>
                <div className="flex gap-2 flex-wrap">
                  <Button variant="outline">Export Campaign Data (CSV)</Button>
                  <Button variant="outline">Export Engagement Trends (PDF)</Button>
                  <Button variant="outline">Export Revenue Report (XLSX)</Button>
                </div>
              </div>
          </CardContent>
      </Card>
    </div>
  );
}

