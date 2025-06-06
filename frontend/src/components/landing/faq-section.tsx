"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface FAQItem {
  question: string;
  answer: string;
}

export const FAQSection = () => {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    );
  };

  const faqs: FAQItem[] = [
    {
      question: "Who can participate in The Giving Bridge Challenge?",
      answer:
        "Anyone who wants to make a positive impact in our community! Whether you're an individual, part of a family, or representing an organization, all are welcome to join our fundraising challenge.",
    },
    {
      question: "Is there a registration fee?",
      answer:
        "No, registration is completely free! We want to remove any barriers to participation. The focus is on community engagement and raising funds for recovery programs, not on entry fees.",
    },
    {
      question: "How are the funds raised used?",
      answer:
        "100% of the funds go directly to addiction recovery programs, mental health resources, and community support services. We provide complete transparency with detailed reporting on how every dollar is used to help those in need.",
    },
    {
      question: "What if I can't attend the main event?",
      answer:
        "You can still participate! We offer virtual participation options and alternative ways to contribute throughout the challenge period. The main event is just one part of the overall fundraising initiative.",
    },
    {
      question: "Can I participate as part of a team?",
      answer:
        "Absolutely! Team participation is encouraged. You can form teams with friends, family, coworkers, or join existing teams. Team challenges add a fun, collaborative element to the fundraising effort.",
    },
    {
      question: "How will I know my impact?",
      answer:
        "We provide regular updates on the collective impact, share success stories, and send personalized impact reports to all participants. You'll see exactly how your contribution is making a difference in real lives.",
    },
  ];

  return (
    <section className="py-16 bg-white dark:bg-neutral-800">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto">
            Have questions about The Giving Bridge Challenge? Here are answers
            to the most common questions from our community.
          </p>
        </div>

        {/* FAQ Items */}
        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <Card
              key={index}
              className="border hover:shadow-md transition-shadow"
            >
              <CardContent className="p-0">
                <button
                  onClick={() => toggleItem(index)}
                  className="w-full p-6 text-left flex items-center justify-between hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors"
                >
                  <h3 className="text-lg font-semibold text-neutral-900 dark:text-white pr-4">
                    {faq.question}
                  </h3>
                  {openItems.includes(index) ? (
                    <ChevronUp className="w-5 h-5 text-neutral-500 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-neutral-500 flex-shrink-0" />
                  )}
                </button>
                {openItems.includes(index) && (
                  <div className="px-6 pb-6">
                    <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional help */}
        <div className="text-center mt-12">
          <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-4">
            Still have questions?
          </h3>
          <p className="text-neutral-600 dark:text-neutral-300 mb-6">
            Our team is here to help! Reach out to us with any additional
            questions or concerns.
          </p>
          <div className="space-y-2">
            <p className="text-sm text-neutral-500">
              Email: info@givingbridgechallenge.org
            </p>
            <p className="text-sm text-neutral-500">Phone: (555) 123-4567</p>
          </div>
        </div>
      </div>
    </section>
  );
};
