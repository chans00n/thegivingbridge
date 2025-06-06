import {
  UserPlus,
  Calendar,
  Users,
  Gift,
  Award,
  ArrowRight,
  Circle,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const HowItWorks = () => {
  const steps = [
    {
      icon: UserPlus,
      title: "Register",
      description: "Sign up through our interest form to join the challenge",
      details: "Quick registration process with basic information",
    },
    {
      icon: Calendar,
      title: "Prepare",
      description: "Receive your challenge materials and event details",
      details: "Get your participant kit and access to planning resources",
    },
    {
      icon: Users,
      title: "Participate",
      description: "Join the community event and fundraising activities",
      details: "Engage in team challenges and community building",
    },
    {
      icon: Gift,
      title: "Give Back",
      description: "Contribute to recovery programs and support services",
      details: "Multiple ways to contribute beyond financial donations",
    },
    {
      icon: Award,
      title: "Celebrate",
      description: "Join the recognition ceremony and see your impact",
      details: "Celebrate collective achievements and individual contributions",
    },
  ];

  return (
    <section className="py-16 bg-white dark:bg-neutral-800">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white mb-4">
            How It Works
          </h2>
          <p className="text-lg text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto">
            Getting involved is simple! Follow these steps to become part of our
            community-driven fundraising challenge.
          </p>
        </div>

        {/* Steps */}
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <Card className="h-full hover:shadow-lg transition-shadow border border-neutral-200 dark:border-neutral-700">
                  <CardContent className="p-6 text-center">
                    {/* Step number */}
                    <div className="bg-neutral-900 dark:bg-neutral-700 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mb-4 mx-auto">
                      {index + 1}
                    </div>

                    {/* Icon */}
                    <div className="bg-neutral-100 dark:bg-neutral-800 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                      <step.icon className="w-8 h-8 text-[#E2241A]" />
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
                      {step.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-neutral-600 dark:text-neutral-300 mb-3">
                      {step.description}
                    </p>

                    {/* Details */}
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      {step.details}
                    </p>
                  </CardContent>
                </Card>

                {/* Arrow for larger screens */}
                {index < steps.length - 1 && (
                  <div className="hidden xl:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                    <ArrowRight className="w-6 h-6 text-neutral-400" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Additional info */}
        <div className="mt-16 bg-neutral-50 dark:bg-neutral-900 rounded-xl p-8 max-w-4xl mx-auto border border-neutral-200 dark:border-neutral-700">
          <h3 className="text-2xl font-bold text-center text-neutral-900 dark:text-white mb-6">
            Multiple Ways to Participate
          </h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-semibold text-lg mb-4 text-neutral-900 dark:text-white">
                Individual Participation
              </h4>
              <ul className="space-y-3 text-neutral-600 dark:text-neutral-300">
                <li className="flex items-start gap-2">
                  <Circle className="w-4 h-4 text-[#E2241A] mt-1 flex-shrink-0 fill-current" />
                  Set personal fundraising goals
                </li>
                <li className="flex items-start gap-2">
                  <Circle className="w-4 h-4 text-[#E2241A] mt-1 flex-shrink-0 fill-current" />
                  Participate in solo challenges
                </li>
                <li className="flex items-start gap-2">
                  <Circle className="w-4 h-4 text-[#E2241A] mt-1 flex-shrink-0 fill-current" />
                  Share your story and motivation
                </li>
                <li className="flex items-start gap-2">
                  <Circle className="w-4 h-4 text-[#E2241A] mt-1 flex-shrink-0 fill-current" />
                  Connect with other participants
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-4 text-neutral-900 dark:text-white">
                Team Participation
              </h4>
              <ul className="space-y-3 text-neutral-600 dark:text-neutral-300">
                <li className="flex items-start gap-2">
                  <Circle className="w-4 h-4 text-[#E2241A] mt-1 flex-shrink-0 fill-current" />
                  Form or join fundraising teams
                </li>
                <li className="flex items-start gap-2">
                  <Circle className="w-4 h-4 text-[#E2241A] mt-1 flex-shrink-0 fill-current" />
                  Collaborate on team challenges
                </li>
                <li className="flex items-start gap-2">
                  <Circle className="w-4 h-4 text-[#E2241A] mt-1 flex-shrink-0 fill-current" />
                  Compete for team recognition
                </li>
                <li className="flex items-start gap-2">
                  <Circle className="w-4 h-4 text-[#E2241A] mt-1 flex-shrink-0 fill-current" />
                  Build lasting community connections
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
