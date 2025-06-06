import { Calendar, MapPin, Clock, Heart, Users, Trophy } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const EventDetails = () => {
  const highlights = [
    {
      icon: Heart,
      title: "Support Recovery",
      description:
        "Your participation directly supports addiction recovery programs and mental health resources in our community.",
      color: "text-[#E2241A]",
    },
    {
      icon: Users,
      title: "Build Community",
      description:
        "Connect with like-minded Bridge Builders who believe in the power of giving and making a positive difference.",
      color: "text-neutral-600 dark:text-neutral-400",
    },
    {
      icon: Trophy,
      title: "Celebrate Impact",
      description:
        "Witness the tangible difference your contribution makes in connecting people to the support they need for recovery.",
      color: "text-neutral-600 dark:text-neutral-400",
    },
  ];

  return (
    <section className="py-16 bg-white dark:bg-neutral-800">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white mb-4">
            Event Details
          </h2>
          <p className="text-lg text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto">
            Join us this September for a community-wide celebration of recovery
            and support.
          </p>
        </div>

        {/* Event info cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center border border-neutral-200 dark:border-neutral-700">
            <CardContent className="p-6">
              <Calendar className="w-12 h-12 text-[#E2241A] mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-2">
                When
              </h3>
              <p className="text-neutral-600 dark:text-neutral-300">
                September 30, 2024
                <br />
                <span className="text-sm">
                  Choose your bridge crossing date
                </span>
              </p>
            </CardContent>
          </Card>

          <Card className="text-center border border-neutral-200 dark:border-neutral-700">
            <CardContent className="p-6">
              <MapPin className="w-12 h-12 text-[#E2241A] mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-2">
                Where
              </h3>
              <p className="text-neutral-600 dark:text-neutral-300">
                Any bridge, anywhere
                <br />
                <span className="text-sm">Local or virtual participation</span>
              </p>
            </CardContent>
          </Card>

          <Card className="text-center border border-neutral-200 dark:border-neutral-700">
            <CardContent className="p-6">
              <Clock className="w-12 h-12 text-[#E2241A] mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-2">
                Duration
              </h3>
              <p className="text-neutral-600 dark:text-neutral-300">
                September 1-30
                <br />
                <span className="text-sm">Full month to participate</span>
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Highlights section */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {highlights.map((highlight, index) => (
            <div key={index} className="text-center">
              <div className="bg-neutral-100 dark:bg-neutral-700 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <highlight.icon className={`w-8 h-8 ${highlight.color}`} />
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-3">
                {highlight.title}
              </h3>
              <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed">
                {highlight.description}
              </p>
            </div>
          ))}
        </div>

        {/* What to expect */}
        <div className="bg-neutral-50 dark:bg-neutral-900 rounded-xl p-8">
          <h3 className="text-2xl font-bold text-neutral-900 dark:text-white mb-6 text-center">
            What to Expect
          </h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
                Challenge Activities:
              </h4>
              <ul className="space-y-2 text-neutral-600 dark:text-neutral-300">
                <li className="flex items-start gap-2">
                  <Heart className="w-4 h-4 text-[#E2241A] mt-1 flex-shrink-0" />
                  Build your personal or team fundraising page
                </li>
                <li className="flex items-start gap-2">
                  <Heart className="w-4 h-4 text-[#E2241A] mt-1 flex-shrink-0" />
                  Share your story and goals with supporters
                </li>
                <li className="flex items-start gap-2">
                  <Heart className="w-4 h-4 text-[#E2241A] mt-1 flex-shrink-0" />
                  Cross a bridge anywhere during September
                </li>
                <li className="flex items-start gap-2">
                  <Heart className="w-4 h-4 text-[#E2241A] mt-1 flex-shrink-0" />
                  Celebrate with our community of Bridge Builders
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
                What&apos;s Included:
              </h4>
              <ul className="space-y-2 text-neutral-600 dark:text-neutral-300">
                <li className="flex items-start gap-2">
                  <Heart className="w-4 h-4 text-[#E2241A] mt-1 flex-shrink-0" />
                  Personalized fundraising tools and support
                </li>
                <li className="flex items-start gap-2">
                  <Heart className="w-4 h-4 text-[#E2241A] mt-1 flex-shrink-0" />
                  Exclusive Bridge Builder merchandise
                </li>
                <li className="flex items-start gap-2">
                  <Heart className="w-4 h-4 text-[#E2241A] mt-1 flex-shrink-0" />
                  Community recognition and celebration
                </li>
                <li className="flex items-start gap-2">
                  <Heart className="w-4 h-4 text-[#E2241A] mt-1 flex-shrink-0" />
                  Connection to recovery support resources
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
