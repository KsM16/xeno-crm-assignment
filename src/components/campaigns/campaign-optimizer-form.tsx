'use client';

import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { CampaignOptimizerSchema, type CampaignOptimizerFormValues } from '@/lib/schemas';
import { campaignOptimization, type CampaignOptimizationOutput } from '@/ai/flows/campaign-optimization';
import { useState } from 'react';
import { Sparkles, Wand2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import LoadingSpinner from '../shared/loading-spinner';

interface CampaignOptimizerFormProps {
  initialData?: Partial<CampaignOptimizerFormValues>;
  onOptimized?: (output: CampaignOptimizationOutput) => void;
}

export default function CampaignOptimizerForm({ initialData, onOptimized }: CampaignOptimizerFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [optimizationResult, setOptimizationResult] = useState<CampaignOptimizationOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<CampaignOptimizerFormValues>({
    resolver: zodResolver(CampaignOptimizerSchema),
    defaultValues: {
      campaignData: initialData?.campaignData || '',
      emailContent: initialData?.emailContent || '',
    },
  });

  const onSubmit: SubmitHandler<CampaignOptimizerFormValues> = async (data) => {
    setIsLoading(true);
    setError(null);
    setOptimizationResult(null);
    try {
      const result = await campaignOptimization(data);
      setOptimizationResult(result);
      if (onOptimized) {
        onOptimized(result);
      }
    } catch (e) {
      console.error("Optimization failed:", e);
      setError(e instanceof Error ? e.message : "An unknown error occurred during optimization.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="shadow-lg w-full">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-primary" />
          <CardTitle className="font-headline text-xl">AI Campaign Optimizer</CardTitle>
        </div>
        <CardDescription>
          Leverage AI to get suggestions for improving your email content and finding the optimal send time based on historical data.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="campaignData"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Historical Campaign Data</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Paste relevant historical data here: open rates, click rates, conversion rates, send times, audience responses, etc."
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="emailContent"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Email Content</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Paste your current email subject line and body content here."
                      className="min-h-[150px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <LoadingSpinner/>
              ) : (
                <>
                  <Wand2 className="mr-2 h-4 w-4" /> Optimize Campaign
                </>
              )}
            </Button>
          </form>
        </Form>

        {error && (
          <Alert variant="destructive" className="mt-6">
            <AlertTitle>Optimization Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {optimizationResult && !error && (
          <Alert className="mt-6 bg-green-50 border-green-200">
             <Sparkles className="h-5 w-5 text-green-600" />
            <AlertTitle className="text-green-700 font-headline">Optimization Suggestions</AlertTitle>
            <AlertDescription className="text-green-600 space-y-3">
              <div>
                <h4 className="font-semibold">Suggested Improvements:</h4>
                <p className="whitespace-pre-wrap">{optimizationResult.suggestedImprovements}</p>
              </div>
              <div>
                <h4 className="font-semibold">Optimal Send Time:</h4>
                <p>{optimizationResult.optimalSendTime}</p>
              </div>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
