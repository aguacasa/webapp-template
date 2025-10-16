export interface FAQItem {
  question: string
  answer: string
}

export const faqItems: FAQItem[] = [
  {
    question: 'How does the free trial work?',
    answer:
      "You can try our Pro plan free for 14 days. No credit card required. Cancel anytime during the trial period and you won't be charged.",
  },
  {
    question: 'Can I change my plan later?',
    answer:
      "Absolutely! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate any charges.",
  },
  {
    question: 'What payment methods do you accept?',
    answer:
      'We accept all major credit cards (Visa, MasterCard, American Express) and PayPal. Enterprise customers can also pay via invoice.',
  },
  {
    question: 'Is my data secure?',
    answer:
      "Yes! We use bank-level encryption to protect your data. All data is encrypted at rest and in transit. We're also SOC 2 Type II certified.",
  },
  {
    question: 'Do you offer refunds?',
    answer:
      "We offer a 30-day money-back guarantee. If you're not satisfied for any reason, contact us for a full refund within 30 days of purchase.",
  },
  {
    question: 'How do I get support?',
    answer:
      'All plans include email support. Pro and Enterprise customers get priority support with faster response times. Enterprise customers also get a dedicated account manager.',
  },
]
