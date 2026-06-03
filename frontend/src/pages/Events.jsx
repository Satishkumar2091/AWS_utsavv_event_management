import React from 'react';
import { Calendar, Music, Camera, Utensils, Flower2, MapPin } from 'lucide-react';

export default function Events() {
  const eventCategories = [
    {
      icon: Camera,
      title: 'Photography',
      description: 'Professional photographers for your special moments',
      image: 'https://images.unsplash.com/photo-1618151193636-acf8bed54982?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzd8MHwxfHNlYXJjaHwyfHxwaG90b2dyYXBoZXIlMjBjYW1lcmElMjBvdXRkb29yfGVufDB8fHx8MTc4MDQ5NTk5M3ww&ixlib=rb-4.1.0&q=85'
    },
    {
      icon: Utensils,
      title: 'Catering',
      description: 'Delicious food and beverage services',
      image: 'https://images.unsplash.com/photo-1576842546422-60562b9242ae?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzB8MHwxfHNlYXJjaHwyfHxldmVudCUyMGNhdGVyaW5nJTIwc2V0dXB8ZW58MHx8fHwxNzgwNDk1OTkzfDA&ixlib=rb-4.1.0&q=85'
    },
    {
      icon: Flower2,
      title: 'Decoration',
      description: 'Beautiful decor and floral arrangements',
      image: 'https://images.unsplash.com/photo-1529636798458-92182e662485?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjY2NzV8MHwxfHNlYXJjaHwxfHx3ZWRkaW5nJTIwZGVjb3JhdGlvbiUyMGZsb3JhbHxlbnwwfHx8fDE3ODA0OTU5OTN8MA&ixlib=rb-4.1.0&q=85'
    },
    {
      icon: Music,
      title: 'DJ & Music',
      description: 'Entertainment and music services',
      image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80'
    },
    {
      icon: MapPin,
      title: 'Venues',
      description: 'Perfect locations for your events',
      image: 'https://images.unsplash.com/photo-1519167758481-83f29da8c6f7?w=800&q=80'
    },
    {
      icon: Calendar,
      title: 'Event Planning',
      description: 'Complete event planning and coordination',
      image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&q=80'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="bg-forestGreen text-white py-24 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            Event Categories
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Explore our wide range of event services and find the perfect vendors for your needs
          </p>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {eventCategories.map((category, idx) => {
            const Icon = category.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl overflow-hidden border border-forestGreen/10 card-hover group cursor-pointer"
              >
                <div className="aspect-[4/3] bg-warmSandSecondary overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full bg-terracotta/10 flex items-center justify-center">
                      <Icon className="text-terracotta" size={24} />
                    </div>
                    <h3 className="font-heading text-xl font-semibold text-textPrimary">
                      {category.title}
                    </h3>
                  </div>
                  <p className="text-textSecondary">{category.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-warmSandSecondary py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-textPrimary mb-6">
            Ready to Plan Your Event?
          </h2>
          <p className="text-textSecondary text-lg mb-8">
            Join our marketplace as a vendor or start searching for the perfect services
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a href="/signup" className="btn-primary">
              Sign Up Now
            </a>
            <a href="/" className="btn-secondary">
              Browse Vendors
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}