import { Calendar, MapPin, Clock, Heart, Users, Trophy } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const EventDetails = () => {
  const highlights = [
    {
      icon: Heart,
      title: "Support Recovery",
      description:
        "Your participation directly supports addiction recovery programs and mental health resources in our community.",
    },
    {
      icon: Users,
      title: "Build Community",
      description:
        "Connect with like-minded individuals who believe in the power of giving and making a positive difference.",
    },
    {
      icon: Trophy,
      title: "Celebrate Impact",
      description:
        "Join us for the celebration event where we'll recognize our collective achievements and the lives we've touched.",
    },
  ];

  return (
    <section
      id="event-details"
      className="py-16 bg-neutral-50 dark:bg-neutral-900"
    >
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white mb-4">
            About The Giving Bridge Challenge
          </h2>
          <p className="text-lg text-neutral-600 dark:text-neutral-300 max-w-3xl mx-auto">
            An innovative fundraising event that brings our community together
            to support addiction recovery and mental health initiatives.
            Together, we can build bridges to hope, healing, and lasting change.
          </p>
        </div>

        {/* Event info cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardContent className="p-6 text-center">
              <Calendar className="w-8 h-8 text-blue-500 mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">Event Date</h3>
              <p className="text-neutral-600 dark:text-neutral-300">
                September 30, 2024
              </p>
              <p className="text-sm text-neutral-500">
                Registration closes September 25th
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <MapPin className="w-8 h-8 text-green-500 mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">Location</h3>
              <p className="text-neutral-600 dark:text-neutral-300">
                Community Center
              </p>
              <p className="text-sm text-neutral-500">
                123 Hope Street, Recovery City
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Clock className="w-8 h-8 text-purple-500 mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">Duration</h3>
              <p className="text-neutral-600 dark:text-neutral-300">
                Full Day Event
              </p>
              <p className="text-sm text-neutral-500">9:00 AM - 6:00 PM</p>
            </CardContent>
          </Card>
        </div>

        {/* Event highlights */}
        <div className="grid md:grid-cols-3 gap-8">
          {highlights.map((highlight, index) => (
            <div key={index} className="text-center">
              <div className="bg-white dark:bg-neutral-800 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-lg">
                <highlight.icon className="w-8 h-8 text-blue-500" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-neutral-900 dark:text-white">
                {highlight.title}
              </h3>
              <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed">
                {highlight.description}
              </p>
            </div>
          ))}
        </div>

        {/* Additional details */}
        <div className="mt-16 bg-white dark:bg-neutral-800 rounded-lg p-8">
          <h3 className="text-2xl font-bold mb-6 text-center text-neutral-900 dark:text-white">
            What to Expect
          </h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-semibold text-lg mb-3 text-neutral-900 dark:text-white">
                Challenge Activities
              </h4>
              <ul className="space-y-2 text-neutral-600 dark:text-neutral-300">
                <li>• Community fundraising competitions</li>
                <li>• Team-building exercises</li>
                <li>• Guest speakers sharing recovery stories</li>
                <li>• Wellness and mindfulness sessions</li>
                <li>• Networking with community leaders</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-3 text-neutral-900 dark:text-white">
                What&apos;s Included
              </h4>
              <ul className="space-y-2 text-neutral-600 dark:text-neutral-300">
                <li>• Welcome breakfast and lunch</li>
                <li>• Challenge t-shirt and materials</li>
                <li>• Access to all event activities</li>
                <li>• Recognition ceremony participation</li>
                <li>• Digital certificate of participation</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
