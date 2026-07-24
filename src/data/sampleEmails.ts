import { SampleEmail } from "../types";

export const SAMPLE_EMAILS: SampleEmail[] = [
  {
    id: "phishing-bank",
    title: "Bank Security Alert (Phishing)",
    category: "phishing",
    subject: "URGENT: Your Bank Account Access Has Been Suspended!",
    body: `Dear Customer,

We detected unauthorized login attempts from an unknown device in Moscow, Russia on your online banking account. For your protection, your access has been temporarily suspended.

ACTION REQUIRED: You must verify your identity immediately to prevent permanent account closure.

Click here to confirm your account and update payment credentials:
https://bit.ly/bank-security-update-2026

Failure to complete verification within 24 hours will result in a total asset lock and $50.00 late compliance fee.

Sincerely,
Global Security Risk Department`,
    expectedSpam: true,
  },
  {
    id: "ceo-fraud",
    title: "Executive CEO Wire Request (BEC)",
    category: "ceo_fraud",
    subject: "CONFIDENTIAL: Urgent Wire Transfer Required for Project Alpha",
    body: `Hi Team,

I am currently in an emergency executive meeting with offshore stakeholders and cannot take phone calls right now.

We need to finalize the deposit for Project Alpha immediately. Please execute a wire transfer of $48,500 to the attached vendor account right away.

Send me the transaction receipt as soon as it is processed. Do not mention this to anyone else as it is under strict NDA.

Thanks,
Chief Executive Officer`,
    expectedSpam: true,
  },
  {
    id: "crypto-lottery",
    title: "Crypto / Inheritance Scam",
    category: "scam",
    subject: "Congratulations! You have been selected to claim 2.5 Bitcoin ($150,000 USD)",
    body: `CONGRATULATIONS WINNER!

You have been selected in the 2026 Global Crypto Lottery Giveaway! You have won 2.5 Bitcoin ($150,000 USD).

To claim your prize, please send a processing fee of $250 via Bitcoin or Apple Giftcard to verify your wallet address.

Claim your reward immediately: http://tinyurl.com/claim-btc-now

Hurry, prize expires in 12 hours!`,
    expectedSpam: true,
  },
  {
    id: "legit-meeting",
    title: "Legitimate Business Meeting",
    category: "legitimate",
    subject: "Quarterly ML Architecture Review - Agenda & Slides",
    body: `Hi Sarah,

Here is the updated deck for tomorrow's ML Architecture & Code Review meeting at 10:00 AM PST.

We will cover:
1. TF-IDF vs Embedding feature performance on spam datasets
2. Latency benchmarks for Gemini API streaming responses
3. CI/CD automated test coverage in GitHub Actions

Please let me know if you have any feedback on slide 4 before the meeting.

Best regards,
Alex Chen
Senior AI Engineer`,
    expectedSpam: false,
  },
  {
    id: "legit-newsletter",
    title: "Tech Newsletter Digest",
    category: "newsletter",
    subject: "PyTorch 2.5 Released, AI Engineering Weekly #142",
    body: `Welcome to this week's edition of AI Developer Weekly!

In this issue:
- PyTorch 2.5 introduces optimized compilation for transformer layers.
- How Scikit-learn Logistic Regression models scale on 10M rows.
- Deep Dive into Gemini 3.6 Flash structured schema mode.

Thank you for being a subscriber. You can update your email preferences or unsubscribe anytime using your account settings link.

Happy Coding!`,
    expectedSpam: false,
  },
];
