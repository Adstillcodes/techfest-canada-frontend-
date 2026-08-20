 import React from "react";

const agendaItems = [
  {
    time: "9:00 AM",
    title: "Registration & Check-in",
    description: "Pick up your badge and get settled in.",
  },
  {
    time: "10:00 AM",
    title: "Opening Ceremony",
    description: "Welcome to TechFest Canada.",
  },
  {
    time: "11:00 AM",
    title: "Keynote",
    description: "Hear from industry leaders and innovators.",
  },
  {
    time: "12:00 PM",
    title: "Lunch & Networking",
    description: "Connect with fellow participants.",
  },
  {
    time: "1:00 PM",
    title: "Workshops",
    description: "Hands-on technical sessions and activities.",
  },
  {
    time: "3:00 PM",
    title: "Tech Challenge",
    description: "Put your skills to the test.",
  },
  {
    time: "5:00 PM",
    title: "Closing Ceremony",
    description: "Awards, announcements, and closing remarks.",
  },
];

export default function Agenda() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-gray-900">
            Event Agenda
          </h1>

          <p className="mt-3 text-lg text-gray-600">
            Explore everything happening at TechFest Canada.
          </p>
        </div>

        <div className="space-y-4">
          {agendaItems.map((item, index) => (
            <div
              key={index}
              className="rounded-xl bg-white p-6 shadow-sm border border-gray-200"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
                <div className="min-w-[120px]">
                  <p className="font-semibold text-blue-600">
                    {item.time}
                  </p>
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {item.title}
                  </h2>

                  <p className="mt-1 text-gray-600">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
