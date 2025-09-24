import React from 'react';
import { Music, Palette, Calendar, Users } from 'lucide-react';
import { useCulturalExperiences } from '../hooks/useSupabase';
import ARVRModal from './ARVRPreview/ARVRModal';

const culturalElements = [
  {
    id: 1,
    title: "Sohrai Festival",
    type: "Festival",
    image: "/pexels/photos/6593344/pexels-photo-6593344.jpeg?auto=compress&cs=tinysrgb&w=800",
    description: "Harvest festival celebrated by tribal communities with vibrant wall paintings and folk dances",
    season: "Winter",
    icon: Calendar
  },
  {
    id: 2,
    title: "Tribal Dance Forms",
    type: "Performing Arts",
    image: "/pexels/photos/7654176/pexels-photo-7654176.jpeg?auto=compress&cs=tinysrgb&w=800",
    description: "Traditional dances like Jhumair, Domkach, and Chhau performed during celebrations",
    season: "Year-round",
    icon: Music
  },
  {
    id: 3,
    title: "Dokra Metal Craft",
    type: "Traditional Art",
    image: "/pexels/photos/11048618/pexels-photo-11048618.jpeg?auto=compress&cs=tinysrgb&w=800",
    description: "Ancient lost-wax technique creating beautiful brass and bronze artifacts",
    season: "Year-round",
    icon: Palette
  },
  {
    id: 4,
    title: "Santhal Community",
    type: "Tribal Heritage",
    image: "/pexels/photos/8078831/pexels-photo-8078831.jpeg?auto=compress&cs=tinysrgb&w=800",
    description: "Rich traditions of the largest tribal community with unique customs and beliefs",
    season: "Year-round",
    icon: Users
  }
];


const Culture = () => {
  const [selectedExperience, setSelectedExperience] = React.useState(null);
  const [arvrModalOpen, setArvrModalOpen] = React.useState(false);
  const { experiences, loading, error } = useCulturalExperiences();

  const handleARVRPreview = (experience) => {
    setSelectedExperience(experience);
    setArvrModalOpen(true);
  };

  if (loading) {
    return (
      <section id="culture" className="py-20 bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-2 border-amber-600 border-t-transparent rounded-full mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading cultural experiences...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="culture" className="py-20 bg-gradient-to-br from-amber-50 to-orange-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-amber-600 font-semibold text-lg">Rich Heritage</span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-2 mb-4">
            Tribal Culture & Traditions
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Immerse yourself in the vibrant tribal culture of Jharkhand, from ancient festivals to traditional crafts
          </p>
        </div>

        {/* Cultural Elements */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {culturalElements.map((element) => {
            const IconComponent = element.icon;
            return (
              <div key={element.id} className="group">
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                  <div className="relative overflow-hidden">
                    <img 
                      src={element.image}
                      alt={element.title}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    <div className="absolute top-4 left-4 bg-amber-500 text-white p-2 rounded-full">
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div className="absolute bottom-4 left-4 text-white">
                      <p className="text-sm opacity-80">{element.season}</p>
                    </div>
                  </div>
                  <div className="p-6">
                    <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-sm font-medium">
                      {element.type}
                    </span>
                    <h3 className="text-xl font-bold text-gray-900 mt-3 mb-2 group-hover:text-amber-600 transition-colors">
                      {element.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {element.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Cultural Experiences */}
        <div>
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Authentic Cultural Experiences</h3>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Participate in immersive cultural programs designed to give you deep insights into tribal life
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {experiences.map((experience) => (
              <div key={experience.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group">
                <div className="relative overflow-hidden">
                  <img 
                    src={experience.image_url}
                    alt={experience.title}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <div className="absolute top-4 right-4 bg-white bg-opacity-90 backdrop-blur-sm rounded-lg px-3 py-2">
                    <span className="text-amber-600 font-bold text-lg">₹{experience.price}</span>
                  </div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <p className="font-semibold">{experience.duration}</p>
                    <p className="text-sm opacity-80">Max {experience.max_participants} participants</p>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-amber-600 transition-colors">
                    {experience.title}
                  </h3>
                  
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-900 mb-2">What's Included:</h4>
                    <ul className="space-y-1">
                      {experience.activities.map((activity, index) => (
                        <li key={index} className="text-gray-600 text-sm flex items-start">
                          <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                          {activity}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3 rounded-lg font-semibold transition-colors">
                    Book Experience
                  </button>
                  <button 
                    onClick={() => handleARVRPreview(experience)}
                    className="w-full mt-2 bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg font-medium transition-colors"
                  >
                    Virtual Experience
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cultural Calendar */}
        <div className="mt-16 bg-white rounded-2xl shadow-lg p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Cultural Calendar</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl">
              <h4 className="font-bold text-amber-600 mb-2">Spring (Mar-May)</h4>
              <p className="text-gray-700 text-sm">Baha Festival, Traditional Holi celebrations</p>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
              <h4 className="font-bold text-green-600 mb-2">Monsoon (Jun-Sep)</h4>
              <p className="text-gray-700 text-sm">Karma Puja, Rain dance ceremonies</p>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-red-50 rounded-xl">
              <h4 className="font-bold text-orange-600 mb-2">Autumn (Oct-Nov)</h4>
              <p className="text-gray-700 text-sm">Dussehra, Kali Puja celebrations</p>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl">
              <h4 className="font-bold text-blue-600 mb-2">Winter (Dec-Feb)</h4>
              <p className="text-gray-700 text-sm">Sohrai Festival, Harvest celebrations</p>
            </div>
          </div>
        </div>
      </div>

      {/* AR/VR Modal */}
      {selectedExperience && (
        <ARVRModal
          isOpen={arvrModalOpen}
          onClose={() => {
            setArvrModalOpen(false);
            setSelectedExperience(null);
          }}
          title={selectedExperience.title}
          type="experience"
          previewData={{
            images: [
              selectedExperience.image_url?.replace('https://images.pexels.com', '/pexels') || '',
              '/pexels/photos/6593344/pexels-photo-6593344.jpeg?auto=compress&cs=tinysrgb&w=800',
              '/pexels/photos/7654176/pexels-photo-7654176.jpeg?auto=compress&cs=tinysrgb&w=800'
            ],
            audioGuide: 'cultural-audio-guide'
          }}
        />
      )}
    </section>
  );
};

export default Culture;