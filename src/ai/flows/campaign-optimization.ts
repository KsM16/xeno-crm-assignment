// This file uses server-side code.
'use server';

/**
 * @fileOverview Campaign optimization flow.
 *
 * - campaignOptimization - Analyzes campaign data and suggests improvements to email content and optimal send times.
 * - CampaignOptimizationInput - The input type for the campaignOptimization function.
 * - CampaignOptimizationOutput - The return type for the campaignOptimization function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CampaignOptimizationInputSchema = z.object({
  campaignData: z
    .string()
    .describe('Historical data from past campaigns, including metrics like open rates, click-through rates, and conversion rates.'),
  emailContent: z.string().describe('The current content of the email campaign.'),
});

export type CampaignOptimizationInput = z.infer<typeof CampaignOptimizationInputSchema>;

const CampaignOptimizationOutputSchema = z.object({
  suggestedImprovements: z
    .string()
    .describe('Specific suggestions for improving the email content, such as changes to the subject line, body text, or call to action.'),
  optimalSendTime: z
    .string()
    .describe('The suggested optimal time to send the email, based on the analysis of past campaign data.'),
});

export type CampaignOptimizationOutput = z.infer<typeof CampaignOptimizationOutputSchema>;

export async function campaignOptimization(input: CampaignOptimizationInput): Promise<CampaignOptimizationOutput> {
  return campaignOptimizationFlow(input);
}

const campaignOptimizationPrompt = ai.definePrompt({
  name: 'campaignOptimizationPrompt',
  input: {
    schema: CampaignOptimizationInputSchema,
  },
  output: {
    schema: CampaignOptimizationOutputSchema,
  },
  prompt: `You are an AI-powered marketing assistant. Analyze the provided campaign data and email content to suggest improvements.

Campaign Data: {{{campaignData}}}

Email Content: {{{emailContent}}}

Based on this information, provide specific suggestions for improving the email content and the optimal time to send the email to maximize engagement and ROI.

Output the suggestions and the optimal send time.`,
});

const campaignOptimizationFlow = ai.defineFlow(
  {
    name: 'campaignOptimizationFlow',
    inputSchema: CampaignOptimizationInputSchema,
    outputSchema: CampaignOptimizationOutputSchema,
  },
  async input => {
    const {output} = await campaignOptimizationPrompt(input);
    return output!;
  }
);
