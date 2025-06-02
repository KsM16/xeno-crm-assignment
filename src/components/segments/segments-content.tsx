'use client';

import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import PageHeader from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { SegmentSchema, type SegmentFormValues } from '@/lib/schemas';
import type { Segment } from '@/lib/types';
import { useState } from 'react';
import { PlusCircle, Edit3, Trash2, Users, BarChartHorizontalBig, ShoppingBag } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { toast } from '@/hooks/use-toast';

const mockSegments: Segment[] = [
  { id: '1', name: 'High Engagement Users', description: 'Users who frequently open emails and click links.', customerCount: 1250, criteria: { demographics: 'Age 25-45', purchaseHistory: '>= 3 purchases', engagementBehavior: 'Opened 5+ emails in last 30 days' } },
  { id: '2', name: 'Recent Signups', description: 'Users who signed up in the last 30 days.', customerCount: 300, criteria: { demographics: 'All', purchaseHistory: 'Any', engagementBehavior: 'Signed up < 30 days ago' } },
  { id: '3', name: 'Potential Churn', description: 'Users with decreasing activity.', customerCount: 150, criteria: { engagementBehavior: 'Last active > 60 days ago' } },
  { id: '4', name: 'Loyal Spenders', description: 'Customers with high purchase frequency and value.', customerCount: 420, criteria: { purchaseHistory: 'Total spend > $500 AND > 5 purchases' } },
];


export default function SegmentsContent() {
  const [segments, setSegments] = useState<Segment[]>(mockSegments);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSegment, setEditingSegment] = useState<Segment | null>(null);

  const form = useForm<SegmentFormValues>({
    resolver: zodResolver(SegmentSchema),
    defaultValues: {
      name: '',
      description: '',
      criteria: {
        demographics: '',
        purchaseHistory: '',
        engagementBehavior: '',
      },
    },
  });

  const onSubmit: SubmitHandler<SegmentFormValues> = (data) => {
    if (editingSegment) {
      setSegments(segments.map(s => s.id === editingSegment.id ? { ...editingSegment, ...data, customerCount: s.customerCount } : s));
      toast({ title: "Segment Updated", description: `Segment "${data.name}" has been successfully updated.` });
    } else {
      const newSegment: Segment = {
        id: String(Date.now()),
        ...data,
        customerCount: Math.floor(Math.random() * 1000) + 50, // Mock customer count
      };
      setSegments([...segments, newSegment]);
      toast({ title: "Segment Created", description: `Segment "${data.name}" has been successfully created.` });
    }
    form.reset();
    setIsFormOpen(false);
    setEditingSegment(null);
  };

  const handleEdit = (segment: Segment) => {
    setEditingSegment(segment);
    form.reset({
      name: segment.name,
      description: segment.description || '',
      criteria: {
        demographics: segment.criteria.demographics || '',
        purchaseHistory: segment.criteria.purchaseHistory || '',
        engagementBehavior: segment.criteria.engagementBehavior || '',
      }
    });
    setIsFormOpen(true);
  };

  const handleDelete = (segmentId: string) => {
    setSegments(segments.filter(s => s.id !== segmentId));
    toast({ title: "Segment Deleted", description: "The segment has been deleted.", variant: "destructive" });
  };
  
  const openCreateForm = () => {
    setEditingSegment(null);
    form.reset();
    setIsFormOpen(true);
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Customer Segments" description="Create and manage your customer segments.">
        <Button onClick={openCreateForm}>
          <PlusCircle className="mr-2 h-4 w-4" /> Create Segment
        </Button>
      </PageHeader>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-headline">{editingSegment ? 'Edit Segment' : 'Create New Segment'}</DialogTitle>
            <DialogDescription>
              {editingSegment ? 'Update the details for this segment.' : 'Define criteria for a new customer segment.'}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Segment Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., High Value Customers" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Briefly describe this segment" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-headline">Criteria</CardTitle>
                  <CardDescription>Define rules for this segment. Use plain language.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="criteria.demographics"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center"><Users className="mr-2 h-4 w-4 text-primary" />Demographics</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Age 25-35, Location: New York" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="criteria.purchaseHistory"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center"><ShoppingBag className="mr-2 h-4 w-4 text-primary" />Purchase History</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Purchased > 3 items, Total spend > $100" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="criteria.engagementBehavior"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center"><BarChartHorizontalBig className="mr-2 h-4 w-4 text-primary" />Engagement Behavior</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Opened last 3 emails, Clicked specific link" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit">
                  {editingSegment ? 'Save Changes' : 'Create Segment'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {segments.length === 0 && !isFormOpen && (
        <Card className="text-center py-12 shadow-lg">
          <CardContent>
            <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No Segments Yet</h3>
            <p className="text-muted-foreground mb-4">Start by creating your first customer segment to personalize campaigns.</p>
            <Button onClick={openCreateForm}>
              <PlusCircle className="mr-2 h-4 w-4" /> Create Your First Segment
            </Button>
          </CardContent>
        </Card>
      )}

      {segments.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {segments.map((segment) => (
            <Card key={segment.id} className="flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="font-headline text-xl">{segment.name}</CardTitle>
                    <CardDescription className="mt-1 text-xs">{segment.customerCount.toLocaleString()} customers</CardDescription>
                  </div>
                  <Users className="h-6 w-6 text-primary" />
                </div>
                
              </CardHeader>
              <CardContent className="flex-grow space-y-2">
                <p className="text-sm text-muted-foreground h-10 overflow-hidden">{segment.description || 'No description provided.'}</p>
                <div className="text-xs space-y-1">
                  {segment.criteria.demographics && <p><strong>Demo:</strong> {segment.criteria.demographics}</p>}
                  {segment.criteria.purchaseHistory && <p><strong>Purchase:</strong> {segment.criteria.purchaseHistory}</p>}
                  {segment.criteria.engagementBehavior && <p><strong>Engagement:</strong> {segment.criteria.engagementBehavior}</p>}
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4">
                <Button variant="ghost" size="sm" onClick={() => handleEdit(segment)} className="text-primary hover:text-primary">
                  <Edit3 className="mr-2 h-4 w-4" /> Edit
                </Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive ml-auto">
                      <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Confirm Deletion</DialogTitle>
                      <DialogDescription>
                        Are you sure you want to delete the segment "{segment.name}"? This action cannot be undone.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
                      <Button variant="destructive" onClick={() => handleDelete(segment.id)}>Delete Segment</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
