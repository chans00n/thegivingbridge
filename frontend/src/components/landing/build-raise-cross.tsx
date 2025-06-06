import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  Target,
  Trophy,
  ArrowRight,
  Heart,
  Gift,
  Star,
} from "lucide-react";
import Link from "next/link";

export const BuildRaiseCross = () => {
  const steps = [
    {
      id: "BUILD",
      title: "BUILD",
      subtitle: "Your Fundraising Foundation",
      description:
        "Build your fundraising page and set your goal. Choose how you'll span the distance:",
      icon: Users,
      bgColor: "bg-neutral-900",
      features: [
        "Lead a Team - Become a Team Captain and create stronger support beams",
        "Join a Team - Connect with an existing group of Bridge Builders",
        "Go Individual - Create your personal fundraising page",
      ],
    },
    {
      id: "RAISE",
      title: "RAISE",
      subtitle: "Funds & Awareness",
      description:
        "Construct your bridge and earn perks. Show your support with exclusive Giving Bridge gear:",
      icon: Target,
      bgColor: "bg-neutral-800",
      tiers: [
        {
          amount: 250,
          color: "bg-neutral-100 text-neutral-800",
          reward: "Commemorative keychain",
        },
        {
          amount: 500,
          color: "bg-[#F39C9B] text-white",
          reward: "Giving Bridge bracelet",
        },
        {
          amount: 1000,
          color: "bg-[#E2241A] text-white",
          reward: "Sober hat",
        },
      ],
    },
    {
      id: "CROSS",
      title: "CROSS",
      subtitle: "The Bridge in September",
      description:
        "Cross a bridge in September (any bridge, anywhere!). Your crossing symbolizes the support that helps others on the path of recovery:",
      icon: Trophy,
      bgColor: "bg-neutral-700",
      features: [
        "Select any bridge - from iconic landmarks to neighborhood footbridges",
        "Choose your crossing date as your fundraising deadline",
        "Document your journey to share and celebrate with supporters",
      ],
    },
  ];

  return (
    <section
      id="build-raise-cross"
      className="py-20 bg-neutral-50 dark:bg-neutral-900"
    >
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 dark:text-white mb-6">
            How The Giving Bridge Works
          </h2>
          <p className="text-xl text-neutral-600 dark:text-neutral-300 max-w-3xl mx-auto">
            Recovery is a journey that no one should walk alone. Every dollar
            goes toward expanding resources for the sober community, ensuring no
            one has to face recovery alone.
          </p>
        </div>

        {/* Three-step process */}
        <div className="space-y-16">
          {steps.map((step, index) => (
            <div key={step.id} className="relative">
              {/* Step number and connector */}
              {index < steps.length - 1 && (
                <div className="absolute left-1/2 transform -translate-x-1/2 top-full mt-8 z-10">
                  <ArrowRight className="w-8 h-8 text-neutral-400 rotate-90" />
                </div>
              )}

              <Card className="overflow-hidden shadow-xl border border-neutral-200 dark:border-neutral-700">
                <div className={`${step.bgColor} text-white p-8`}>
                  <div className="flex items-center justify-center mb-6">
                    <div className="bg-white/10 backdrop-blur-sm rounded-full p-4 mr-4 border border-white/20">
                      <step.icon className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-3xl md:text-4xl font-bold">
                        {step.title}
                      </h3>
                      <p className="text-xl text-white/90">{step.subtitle}</p>
                    </div>
                  </div>
                  <p className="text-lg text-white/95 text-center max-w-2xl mx-auto">
                    {step.description}
                  </p>
                </div>

                <CardContent className="p-8 bg-white dark:bg-neutral-800">
                  {step.features && (
                    <div className="space-y-4">
                      {step.features.map((feature, featureIndex) => (
                        <div
                          key={featureIndex}
                          className="flex items-start gap-3"
                        >
                          <Heart className="w-5 h-5 text-[#E2241A] mt-1 flex-shrink-0" />
                          <p className="text-neutral-700 dark:text-neutral-300">
                            {feature}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {step.tiers && (
                    <div className="space-y-6">
                      <h4 className="text-xl font-semibold text-center text-neutral-900 dark:text-white">
                        Fundraising Tiers & Rewards
                      </h4>
                      <div className="grid md:grid-cols-3 gap-4">
                        {step.tiers.map((tier) => (
                          <div
                            key={tier.amount}
                            className={`${tier.color} rounded-full px-6 py-8 text-center font-bold relative overflow-hidden border`}
                          >
                            <div className="relative z-10">
                              <div className="text-3xl mb-2">
                                ${tier.amount}
                              </div>
                              <div className="text-sm opacity-90">
                                {tier.reward}
                              </div>
                            </div>
                            <Gift className="absolute top-2 right-2 w-6 h-6 opacity-20" />
                          </div>
                        ))}
                      </div>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400 text-center">
                        Every dollar strengthens the connection and helps people
                        cross over to recovery.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        {/* Call to action */}
        <div className="text-center mt-16">
          <div className="bg-neutral-900 rounded-2xl p-8 text-white">
            <Star className="w-12 h-12 text-[#E2241A] mx-auto mb-4" />
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Ready to Build Your Bridge?
            </h3>
            <p className="text-lg text-neutral-300 mb-6 max-w-2xl mx-auto">
              Join our community of Bridge Builders and help create lasting
              change in recovery support.
            </p>
            <Button
              asChild
              size="lg"
              className="bg-[#E2241A] hover:bg-[#B01C14] text-white px-8 py-3 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all"
            >
              <Link href="/interest-form" className="flex items-center gap-2">
                Start Building Now
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
