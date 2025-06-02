
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CampaignSchema, type CampaignFormValues } from '@/lib/schemas';
import type { Campaign, Segment } from '@/lib/types';
import { useState, useEffect } from 'react';
import { PlusCircle, Edit3, Trash2, Send, Mail, Sparkles, CalendarIcon, Eye, Users, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';
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
import CampaignOptimizerForm from './campaign-optimizer-form';
import { toast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

const mockCampaignsData: Campaign[] = [
  { id: '1', name: 'Summer Kick-off Sale', subject: "☀️ Summer Deals Are Here!", targetSegmentId: '1', targetSegmentName: 'High Engagement Users', status: 'Sent', sentDate: '2024-06-15', createdDate: '2024-06-10', openRate: 35.2, clickRate: 8.1, audienceSize: 1250, sentCount: 1245, failedCount: 5 },
  { id: '2', name: 'New User Welcome', subject: "Welcome to ClientPulse!", targetSegmentId: '2', targetSegmentName: 'Recent Signups', status: 'Scheduled', sentDate: '2024-07-25', createdDate: '2024-07-10', audienceSize: 300, sentCount: 0, failedCount: 0 },
  { id: '3', name: 'Re-engagement Offer', subject: "We Miss You! Here's 15% Off", targetSegmentId: '3', targetSegmentName: 'Potential Churn', status: 'Draft', createdDate: '2024-07-18', audienceSize: 150 },
  { id: '4', name: 'VIP Exclusive Preview', subject: "VIPs: Early Access to New Arrivals", targetSegmentId: '4', targetSegmentName: 'Loyal Spenders', status: 'Sent', sentDate: '2024-07-01', createdDate: '2024-06-25', openRate: 55.8, clickRate: 15.3, audienceSize: 420, sentCount: 418, failedCount: 2 },
  { id: '5', name: 'Holiday Special Early Bird', subject: "🎄 Early Access to Holiday Deals!", targetSegmentId: '1', targetSegmentName: 'High Engagement Users', status: 'Draft', createdDate: '2024-07-22', audienceSize: 1250 },
];

const mockSegments: Pick<Segment, 'id' | 'name'>[] = [
  { id: '1', name: 'High Engagement Users' },
  { id: '2', name: 'Recent Signups' },
  { id: '3', name: 'Potential Churn' },
  { id: '4', name: 'Loyal Spenders' },
];

const getStatusBadgeVariant = (status: Campaign['status']) => {
  switch (status) {
    case 'Sent': return 'default';
    case 'Scheduled': return 'secondary';
    case 'Draft': return 'outline';
    case 'Archived': return 'destructive';
    default: return 'default';
  }
}


export default function CampaignsContent() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [showOptimizer, setShowOptimizer] = useState(false);
  const [optimizerInitialData, setOptimizerInitialData] = useState<Partial<CampaignFormValues>>({});

  useEffect(() => {
    const sortedCampaigns = [...mockCampaignsData].sort((a, b) => 
      parseISO(b.createdDate).getTime() - parseISO(a.createdDate).getTime()
    );
    setCampaigns(sortedCampaigns);
  }, []);

  const form = useForm<CampaignFormValues>({
    resolver: zodResolver(CampaignSchema),
    defaultValues: {
      name: '',
      subject: '',
      targetSegmentId: '',
      emailContent: '',
      sendDate: undefined,
    },
  });

  const onSubmit: SubmitHandler<CampaignFormValues> = (data) => {
    const segment = mockSegments.find(s => s.id === data.targetSegmentId);
    let updatedCampaigns;
    if (editingCampaign) {
      const campaignToUpdate: Campaign = { 
        ...editingCampaign, 
        ...data, 
        targetSegmentName: segment?.name, 
        status: editingCampaign.status === 'Draft' && data.sendDate ? 'Scheduled' : editingCampaign.status, 
        sentDate: data.sendDate ? format(data.sendDate, 'yyyy-MM-dd') : undefined,
        audienceSize: editingCampaign.audienceSize || segment ? (mockSegments.find(s => s.id === segment?.id)?.name === 'Recent Signups' ? 300 : Math.floor(Math.random() * 1000) + 200) : undefined, // Mock audience size
      };
      updatedCampaigns = campaigns.map(c => c.id === editingCampaign.id ? campaignToUpdate : c);
      toast({ title: "Campaign Updated", description: `Campaign "${data.name}" has been successfully updated.` });
    } else {
      const newCampaign: Campaign = {
        id: String(Date.now()),
        ...data,
        targetSegmentName: segment?.name,
        status: data.sendDate ? 'Scheduled' : 'Draft',
        createdDate: format(new Date(), 'yyyy-MM-dd'),
        sentDate: data.sendDate ? format(data.sendDate, 'yyyy-MM-dd') : undefined,
        audienceSize: segment ? (mockSegments.find(s => s.id === segment?.id)?.name === 'Recent Signups' ? 300 : Math.floor(Math.random() * 1000) + 200) : undefined, // Mock audience size
        sentCount: 0, // Initial values for new campaign
        failedCount: 0,
      };
      updatedCampaigns = [newCampaign, ...campaigns];
      toast({ title: "Campaign Created", description: `Campaign "${data.name}" has been successfully created.` });
    }
    
    setCampaigns(updatedCampaigns.sort((a, b) => parseISO(b.createdDate).getTime() - parseISO(a.createdDate).getTime()));
    form.reset();
    setIsFormOpen(false);
    setEditingCampaign(null);
  };

  const handleEdit = (campaign: Campaign) => {
    setEditingCampaign(campaign);
    form.reset({
      name: campaign.name,
      subject: campaign.subject,
      targetSegmentId: campaign.targetSegmentId,
      emailContent: `This is a placeholder for the email content of campaign: ${campaign.name}. Please replace with actual content if editing.`, 
      sendDate: campaign.sentDate ? parseISO(campaign.sentDate) : undefined,
    });
    setIsFormOpen(true);
  };

  const handleDelete = (campaignId: string) => {
    const updatedCampaigns = campaigns.filter(c => c.id !== campaignId);
    setCampaigns(updatedCampaigns.sort((a, b) => parseISO(b.createdDate).getTime() - parseISO(a.createdDate).getTime()));
    toast({ title: "Campaign Deleted", description: "The campaign has been deleted.", variant: "destructive" });
  };

  const openCreateForm = () => {
    setEditingCampaign(null);
    form.reset();
    setIsFormOpen(true);
  }

  const openOptimizerForCampaign = (campaign: Campaign) => {
    setOptimizerInitialData({
      emailContent: `Subject: ${campaign.subject}\n\nBody: [Placeholder for campaign ${campaign.name} body content. Assuming it's fetched or available.]`,
    });
    setShowOptimizer(true);
  }


  return (
    <div className="space-y-6">
      <PageHeader title="Campaign History & Management" description="Review past campaigns, manage active ones, and create new marketing initiatives.">
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowOptimizer(true)}>
            <Sparkles className="mr-2 h-4 w-4" /> AI Optimizer
          </Button>
          <Button onClick={openCreateForm}>
            <PlusCircle className="mr-2 h-4 w-4" /> Create Campaign
          </Button>
        </div>
      </PageHeader>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-headline">{editingCampaign ? 'Edit Campaign' : 'Create New Campaign'}</DialogTitle>
            <DialogDescription>
              {editingCampaign ? 'Update the details for this campaign.' : 'Set up a new email campaign.'}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Campaign Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Holiday Special 2024" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Subject Line</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 🎉 Unmissable Holiday Deals Inside!" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="targetSegmentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target Segment</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a customer segment" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {mockSegments.map(segment => (
                          <SelectItem key={segment.id} value={segment.id}>
                            {segment.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="emailContent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Content (HTML or Plain Text)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Craft your email message here..." className="min-h-[200px]" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="sendDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Schedule Send Date (Optional)</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-[240px] pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date(new Date().setHours(0,0,0,0)) }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                 <DialogClose asChild>
                    <Button type="button" variant="outline">Cancel</Button>
                 </DialogClose>
                <Button type="submit">
                  {editingCampaign ? 'Save Changes' : 'Create Campaign'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog open={showOptimizer} onOpenChange={setShowOptimizer}>
        <DialogContent className="sm:max-w-2xl lg:max-w-3xl">
            <CampaignOptimizerForm 
              initialData={{ 
                campaignData: optimizerInitialData.emailContent ? "" : "Example: Past campaigns for 'Summer Sale' had 25% open rate on weekdays, 30% on weekends. Best time was Saturday 10 AM. Subject lines with emojis performed 5% better.",
                emailContent: optimizerInitialData.emailContent 
              }}
              onOptimized={(output) => {
                toast({ title: "Optimization Complete!", description: "Suggestions ready. Consider applying them to your campaign."});
              }}
            />
        </DialogContent>
      </Dialog>


      {campaigns.length === 0 && !isFormOpen && (
        <Card className="text-center py-12 shadow-lg">
          <CardContent>
            <Mail className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No Campaigns Yet</h3>
            <p className="text-muted-foreground mb-4">Start by creating your first email campaign to engage your customers.</p>
            <Button onClick={openCreateForm}>
              <PlusCircle className="mr-2 h-4 w-4" /> Create Your First Campaign
            </Button>
          </CardContent>
        </Card>
      )}

      {campaigns.length > 0 && (
        <div className="space-y-4">
          {campaigns.map((campaign) => (
            <Card key={campaign.id} className="shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                  <CardTitle className="font-headline text-xl mb-2 sm:mb-0">{campaign.name}</CardTitle>
                  <Badge variant={getStatusBadgeVariant(campaign.status)} className="text-xs">{campaign.status}</Badge>
                </div>
                <CardDescription className="text-sm">Subject: {campaign.subject}</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <p>Target: {campaign.targetSegmentName || campaign.targetSegmentId}</p>
                <p>Created: {format(parseISO(campaign.createdDate), 'PP')}</p>
                {campaign.sentDate && <p>{campaign.status === 'Scheduled' ? 'Scheduled for' : 'Sent on'}: {format(parseISO(campaign.sentDate), 'PP')}</p>}
                
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1 text-xs">
                  <div className="flex items-center">
                    <Users className="mr-1.5 h-3.5 w-3.5 text-primary/80" />
                    Audience: <strong>{campaign.audienceSize?.toLocaleString() ?? 'N/A'}</strong>
                  </div>
                  {campaign.status === 'Sent' && campaign.sentCount !== undefined && (
                    <div className="flex items-center">
                      <CheckCircle2 className="mr-1.5 h-3.5 w-3.5 text-green-600" />
                      Sent: <strong>{campaign.sentCount.toLocaleString()}</strong>
                    </div>
                  )}
                  {campaign.status === 'Sent' && campaign.failedCount !== undefined && (
                     <div className="flex items-center">
                       <AlertTriangle className="mr-1.5 h-3.5 w-3.5 text-red-600" />
                       Failed: <strong>{campaign.failedCount.toLocaleString()}</strong>
                     </div>
                  )}
                </div>

                {campaign.status === 'Sent' && (
                  <div className="flex gap-x-4 gap-y-1 pt-1 flex-wrap text-xs">
                    <span>Open Rate: <strong>{campaign.openRate?.toFixed(1) ?? 'N/A'}%</strong></span>
                    <span>Click Rate: <strong>{campaign.clickRate?.toFixed(1) ?? 'N/A'}%</strong></span>
                  </div>
                )}
              </CardContent>
              <CardFooter className="border-t pt-4 flex flex-wrap gap-2">
                <Button variant="outline" size="sm" onClick={() => handleEdit(campaign)}>
                  <Edit3 className="mr-2 h-4 w-4" /> Edit
                </Button>
                 <Button variant="outline" size="sm" onClick={() => alert(`Viewing campaign: ${campaign.name}`)}>
                  <Eye className="mr-2 h-4 w-4" /> View Details
                </Button>
                <Button variant="outline" size="sm" onClick={() => openOptimizerForCampaign(campaign)} className="text-primary hover:text-primary border-primary/50 hover:border-primary">
                  <Sparkles className="mr-2 h-4 w-4" /> AI Optimize
                </Button>
                {campaign.status === 'Draft' && (
                   <Button variant="default" size="sm" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                    <Send className="mr-2 h-4 w-4" /> Send/Schedule
                  </Button>
                )}
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
                        Are you sure you want to delete the campaign "{campaign.name}"? This action cannot be undone.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
                      <Button variant="destructive" onClick={() => handleDelete(campaign.id)}>Delete Campaign</Button>
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
