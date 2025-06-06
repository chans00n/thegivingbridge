import { Card, CardContent } from "@/components/ui/card";
import { Quote, Users, Heart, TrendingUp } from "lucide-react";

export const ImpactStory = () => {
  const impactStats = [
    {
      number: "150+",
      label: "Lives Changed Through Bridge Building",
      icon: Users,
      color: "text-[#E2241A]",
    },
    {
      number: "25",
      label: "Families Reunited Across the Bridge",
      icon: Heart,
      color: "text-[#E2241A]",
    },
    {
      number: "85%",
      label: "Success Rate in Bridge Crossings",
      icon: TrendingUp,
      color: "text-[#E2241A]",
    },
  ];

  return (
    <section className="py-16 bg-neutral-50 dark:bg-neutral-900">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white mb-4">
            Our Impact & Stories
          </h2>
          <p className="text-lg text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto">
            Every bridge built creates real change. Here&apos;s how your
            participation transforms lives.
          </p>
        </div>

        {/* Impact statistics */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {impactStats.map((stat, index) => (
            <Card
              key={index}
              className="text-center border border-neutral-200 dark:border-neutral-700"
            >
              <CardContent className="p-6">
                <div className="bg-neutral-100 dark:bg-neutral-800 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                </div>
                <div className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">
                  {stat.number}
                </div>
                <div className="text-neutral-600 dark:text-neutral-300">
                  {stat.label}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Featured testimonial */}
        <div className="bg-white dark:bg-neutral-800 rounded-xl p-8 border border-neutral-200 dark:border-neutral-700">
          <div className="flex items-start gap-4">
            <Quote className="w-8 h-8 text-[#E2241A] flex-shrink-0 mt-2" />
            <div>
              <blockquote className="text-xl text-neutral-700 dark:text-neutral-300 mb-6 leading-relaxed">
                &quot;The Giving Bridge Challenge gave me hope when I needed it
                most. Building my fundraising page and crossing that bridge
                wasn&apos;t just about raising money – it was about proving to
                myself that I could overcome anything. The community support was
                incredible.&quot;
              </blockquote>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-neutral-200 dark:bg-neutral-700 rounded-full flex items-center justify-center">
                  <span className="text-lg font-bold text-neutral-600 dark:text-neutral-400">
                    S
                  </span>
                </div>
                <div>
                  <div className="font-semibold text-neutral-900 dark:text-white">
                    Sarah M.
                  </div>
                  <div className="text-sm text-neutral-600 dark:text-neutral-400">
                    Bridge Builder, Recovery Program Graduate
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
