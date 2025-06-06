import { Quote, Heart, TrendingUp, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const ImpactStory = () => {
  const impactStats = [
    {
      icon: Users,
      number: "150+",
      label: "Lives Changed",
      description: "Individuals supported through recovery programs",
    },
    {
      icon: Heart,
      number: "25",
      label: "Families Reunited",
      description: "Families brought back together through healing",
    },
    {
      icon: TrendingUp,
      number: "85%",
      label: "Success Rate",
      description: "Participants maintaining long-term recovery",
    },
  ];

  return (
    <section className="py-16 bg-white dark:bg-neutral-800">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white mb-4">
            Stories of Hope & Recovery
          </h2>
          <p className="text-lg text-neutral-600 dark:text-neutral-300 max-w-3xl mx-auto">
            Every donation, every participant, every moment of support creates
            ripple effects that transform lives. Here are the real impacts of
            our community&apos;s generosity.
          </p>
        </div>

        {/* Impact statistics */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {impactStats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <stat.icon className="w-10 h-10 text-blue-500" />
              </div>
              <div className="text-4xl font-bold text-neutral-900 dark:text-white mb-2">
                {stat.number}
              </div>
              <div className="text-lg font-semibold text-neutral-700 dark:text-neutral-200 mb-2">
                {stat.label}
              </div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                {stat.description}
              </p>
            </div>
          ))}
        </div>

        {/* Featured story */}
        <div className="max-w-4xl mx-auto">
          <Card className="border-l-4 border-l-blue-500 shadow-lg">
            <CardContent className="p-8">
              <Quote className="w-8 h-8 text-blue-500 mb-4" />
              <blockquote className="text-lg md:text-xl text-neutral-700 dark:text-neutral-200 leading-relaxed mb-6 italic">
                &quot;The Giving Bridge Challenge didn&apos;t just change my
                life—it saved it. The support I received through the recovery
                programs funded by this amazing community gave me hope when I
                had none. Today, I&apos;m 18 months sober, reunited with my
                family, and giving back by mentoring others on their journey.
                This is what miracles look like.&quot;
              </blockquote>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-lg mr-4">
                  S
                </div>
                <div>
                  <div className="font-semibold text-neutral-900 dark:text-white">
                    Sarah M.
                  </div>
                  <div className="text-sm text-neutral-600 dark:text-neutral-400">
                    Recovery Program Graduate & Mentor
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Call to action */}
        <div className="text-center mt-12">
          <h3 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">
            Your Story Could Be Next
          </h3>
          <p className="text-lg text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto">
            Join us in creating more stories of hope, healing, and
            transformation. Together, we can build bridges that lead to brighter
            futures for individuals and families in our community.
          </p>
        </div>
      </div>
    </section>
  );
};
