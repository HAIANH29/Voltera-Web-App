import { useState } from 'react';
import { Search, Play, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import { ImageWithFallback } from 'image/ImageWithFallback';
import { NewestPosts } from './NewestPosts';
import { QuickSearch } from './QuickSearch';

export function PremiumHomepage({ onNavigate, currentUser, onViewDetails, onToggleFavorite }) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [selectedThumbnail, setSelectedThumbnail] = useState(0);
    const [expandedFaq, setExpandedFaq] = useState(null);

    const featuredImages = [
        "https://images.unsplash.com/photo-1576221162298-3d9f04e9f661?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMGVsZWN0cmljJTIwY2FyJTIwbHV4dXJ5fGVufDF8fHx8MTc1ODUzMTE2M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        "https://images.unsplash.com/photo-1657638005574-1c7710608b60?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVjdHJpYyUyMHZlaGljbGUlMjBpbnRlcmlvciUyMGRhc2hib2FyZHxlbnwxfHx8fDE3NTg1MzExNjd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        "https://images.unsplash.com/photo-1737312272830-f445719b7ed9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVjdHJpYyUyMGNhciUyMGNoYXJnaW5nJTIwcG9ydHxlbnwxfHx8fDE3NTg1MzExNzB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    ];

    const thumbnailImages = [
        "https://images.unsplash.com/photo-1752959818576-b0991721789d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXIlMjB3aGVlbCUyMHJpbSUyMGNsb3NldXB8ZW58MXx8fHwxNzU4NTMxMTczfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        "https://images.unsplash.com/photo-1690149611859-bfba66e26f0d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVjdHJpYyUyMHZlaGljbGUlMjBlbmdpbmUlMjBiYXl8ZW58MXx8fHwxNzU4NTMxMTc3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        "https://images.unsplash.com/photo-1740308582505-339043c6c43d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXIlMjByZWFyJTIwdmlldyUyMGxpZ2h0c3xlbnwxfHx8fDE3NTg1MzExNzl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        "https://images.unsplash.com/photo-1657638005574-1c7710608b60?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVjdHJpYyUyMHZlaGljbGUlMjBpbnRlcmlvciUyMGRhc2hib2FyZHxlbnwxfHx8fDE3NTg1MzExNjd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        "https://images.unsplash.com/photo-1737312272830-f445719b7ed9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVjdHJpYyUyMGNhciUyMGNoYXJnaW5nJTIwcG9ydHxlbnwxfHx8fDE3NTg1MzExNzB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        "https://images.unsplash.com/photo-1576221162298-3d9f04e9f661?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMGVsZWN0cmljJTIwY2FyJTIwbHV4dXJ5fGVufDF8fHx8MTc1ODUzMTE2M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    ];

    const faqItems = [
        {
            question: "How long day needed?",
            answer: "Typical delivery takes 3-7 business days depending on your location and the vehicle's current status. Express delivery options are available for premium listings."
        },
        {
            question: "How to claim insurance?",
            answer: "All vehicles come with transfer documentation. Contact our insurance partners for seamless coverage transfer, or we can help you find competitive rates from our network."
        },
        {
            question: "Can I request people working?",
            answer: "Yes, our certified technicians can perform pre-delivery inspections, battery health checks, and basic maintenance to ensure your EV is road-ready upon delivery."
        }
    ];

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % featuredImages.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + featuredImages.length) % featuredImages.length);
    };

    const handleSearch = (query) => {
        onNavigate('search-results', { query });
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section with Search */}
            <div className="bg-gray-50 py-8">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto">
                        {/* Enhanced Search Bar */}
                        <div className="flex gap-4 mb-8">
                            <div className="flex-1">
                                <QuickSearch
                                    onSearch={handleSearch}
                                    placeholder="Search vehicles, batteries, or brands..."
                                    size="lg"
                                    showSuggestions={true}
                                    showFilters={true}
                                    onFilterChange={(filters) => {
                                        console.log('Filters changed:', filters);
                                        // TODO: Apply filters to search results
                                    }}
                                    itemType="vehicles"
                                />
                            </div>
                        </div>

                        {/* Newest Posts Section */}
                        <div className="mb-8">
                            <NewestPosts
                                onViewDetails={onViewDetails || (() => {})}
                                onAddToFavorites={onToggleFavorite || (() => {})}
                                currentUser={currentUser}
                            />
                        </div>

                        {/* Role-based Access Section - Only show when not logged in */}
                        {!currentUser && (
                            <div className="bg-white rounded-lg shadow-sm border p-8 mb-8">
                                <div className="text-center mb-6">
                                    <h3 className="text-2xl font-semibold mb-2">Join Voltera Community</h3>
                                    <p className="text-muted-foreground">
                                        Access personalized dashboards based on your role in the marketplace
                                    </p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="text-center p-6 border rounded-lg hover:shadow-md transition-shadow">
                                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <Search className="w-8 h-8 text-blue-600" />
                                        </div>
                                        <h4 className="font-semibold mb-2">Buyer Dashboard</h4>
                                        <p className="text-sm text-muted-foreground mb-4">
                                            Browse vehicles, save favorites, track purchases, and get personalized recommendations
                                        </p>
                                        <button
                                            onClick={() => onNavigate('login')}
                                            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
                                        >
                                            Login as Buyer
                                        </button>
                                    </div>

                                    <div className="text-center p-6 border rounded-lg hover:shadow-md transition-shadow">
                                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <Play className="w-8 h-8 text-green-600" />
                                        </div>
                                        <h4 className="font-semibold mb-2">Seller Dashboard</h4>
                                        <p className="text-sm text-muted-foreground mb-4">
                                            Create listings, manage inventory, track sales, and communicate with buyers
                                        </p>
                                        <button
                                            onClick={() => onNavigate('login')}
                                            className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition-colors"
                                        >
                                            Login as Seller
                                        </button>
                                    </div>

                                    <div className="text-center p-6 border rounded-lg hover:shadow-md transition-shadow">
                                        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <ChevronRight className="w-8 h-8 text-purple-600" />
                                        </div>
                                        <h4 className="font-semibold mb-2">Admin Dashboard</h4>
                                        <p className="text-sm text-muted-foreground mb-4">
                                            Manage users, moderate listings, handle disputes, and view analytics
                                        </p>
                                        <button
                                            onClick={() => onNavigate('login')}
                                            className="w-full bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 transition-colors"
                                        >
                                            Admin Access
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Featured Vehicle Gallery */}
            <div className="bg-gradient-to-b from-gray-900 to-black py-16">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl text-white mb-2">PHOTO</h2>
                        <h2 className="text-3xl text-white">GALLERY</h2>
                    </div>

                    {/* Main Featured Image */}
                    <div className="relative max-w-4xl mx-auto mb-8">
                        <div className="relative aspect-[16/9] rounded-xl overflow-hidden">
                            <ImageWithFallback
                                src={featuredImages[currentImageIndex]}
                                alt="Featured Electric Vehicle"
                                className="w-full h-full object-cover"
                            />

                            {/* Navigation Arrows */}
                            <button
                                onClick={prevImage}
                                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-colors"
                            >
                                <ChevronLeft className="w-6 h-6" />
                            </button>
                            <button
                                onClick={nextImage}
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-colors"
                            >
                                <ChevronRight className="w-6 h-6" />
                            </button>

                            {/* Dots Indicator */}
                            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                                {featuredImages.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentImageIndex(index)}
                                        className={`w-3 h-3 rounded-full transition-colors ${
                                            index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                                        }`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Thumbnail Gallery */}
                    <div className="flex justify-center gap-4 overflow-x-auto pb-4">
                        {thumbnailImages.map((image, index) => (
                            <button
                                key={index}
                                onClick={() => setSelectedThumbnail(index)}
                                className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                                    selectedThumbnail === index ? 'border-white' : 'border-transparent'
                                }`}
                            >
                                <ImageWithFallback
                                    src={image}
                                    alt={`Vehicle detail ${index + 1}`}
                                    className="w-full h-full object-cover"
                                />
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Services Section */}
            <div className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <div className="text-sm text-gray-500 mb-2">DESIGN CONSULTATION</div>
                            <h2 className="text-4xl mb-6">HOME DESIGN 3D 2D<br />INTERIOR SERVICES</h2>
                            <p className="text-gray-600 mb-8">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                                incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.
                            </p>

                            <div className="space-y-4 mb-8">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                                    <span>Prefabricated Homes</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                                    <span>Home Interior Planning</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                                    <span>Third Home Design</span>
                                </div>
                            </div>

                            <button className="bg-gray-800 text-white px-8 py-3 rounded hover:bg-gray-700 transition-colors">
                                CONTACT US
                            </button>
                        </div>

                        <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center relative">
                            <Play className="w-16 h-16 text-gray-400" />
                            <div className="absolute inset-0 bg-gray-300 rounded-lg opacity-50"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* FAQ Section */}
            <div className="py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        <div className="aspect-video bg-gray-300 rounded-lg"></div>

                        <div>
                            <div className="text-sm text-gray-500 mb-2">FIRST QUESTION ANSWER</div>
                            <h2 className="text-4xl mb-2">QUESTION ANSWER</h2>
                            <h2 className="text-4xl mb-6">TRENDING WEEKLY</h2>
                            <p className="text-gray-600 mb-8">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                                incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.
                            </p>

                            <div className="space-y-4">
                                {faqItems.map((item, index) => (
                                    <div key={index} className="border-b border-gray-200">
                                        <button
                                            onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                                            className="w-full flex items-center justify-between py-4 text-left hover:text-primary transition-colors"
                                        >
                                            <span className="font-medium">{item.question}</span>
                                            <ChevronDown
                                                className={`w-5 h-5 transition-transform ${
                                                    expandedFaq === index ? 'rotate-180' : ''
                                                }`}
                                            />
                                        </button>
                                        {expandedFaq === index && (
                                            <div className="pb-4 text-gray-600">
                                                {item.answer}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>



            {/* CTA Section */}
            <div className="py-16 bg-primary text-primary-foreground">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl mb-6">Ready to Find Your Perfect Electric Vehicle?</h2>
                    <p className="text-xl mb-8 opacity-90">
                        Browse thousands of verified EVs and batteries from trusted sellers
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={() => onNavigate('marketplace')}
                            className="bg-white text-primary px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            Browse Vehicles
                        </button>
                        <button
                            onClick={() => onNavigate('batteries')}
                            className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg hover:bg-white hover:text-primary transition-colors"
                        >
                            View Batteries
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}