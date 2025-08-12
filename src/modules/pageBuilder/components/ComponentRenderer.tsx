import React from 'react';
import { Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import { Component } from '../../types/cms';

interface ComponentRendererProps {
  component: Component;
  isSelected?: boolean;
  onSelect?: (id: string | null) => void;
  onDelete?: (id: string) => void;
  customComponents?: any[];
  onMoveUp?: (id: string) => void;
  onMoveDown?: (id: string) => void;
  canMoveUp?: boolean;
  canMoveDown?: boolean;
}

export const ComponentRenderer: React.FC<ComponentRendererProps> = ({
  component,
  isSelected = false,
  onSelect,
  onDelete,
  customComponents = [],
  onMoveUp,
  onMoveDown,
  canMoveUp = false,
  canMoveDown = false
}) => {
  // Check if this is a custom component
  const isCustomComponent = customComponents.some(c => c.type === component.type);
  
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect?.(component.id);
  };

  const renderCustomComponent = () => {
    const customComponent = customComponents.find(c => c.type === component.type);
    if (!customComponent) return <div>Custom component not found</div>;

    let html = customComponent.html;
    Object.entries(component.props).forEach(([key, value]) => {
      html = html.replace(new RegExp(`{{${key}}}`, 'g'), String(value));
    });

    return (
      <div>
        <style dangerouslySetInnerHTML={{ __html: customComponent.css }} />
        <div dangerouslySetInnerHTML={{ __html: html }} />
        <script dangerouslySetInnerHTML={{ __html: customComponent.js }} />
      </div>
    );
  };

  const renderComponent = () => {
    // Check if it's a custom component
    const isCustomComponent = customComponents.some(c => c.type === component.type);
    if (isCustomComponent) {
      return renderCustomComponent();
    }

    // Render built-in components
    switch (component.type) {
      case 'hero':
        return (
          <div 
            className="relative bg-cover bg-center py-24 px-8 text-center text-white"
            style={{ backgroundImage: `url(${component.props.backgroundImage})` }}
          >
            <div className="absolute inset-0 bg-black bg-opacity-40"></div>
            <div className="relative z-10 max-w-4xl mx-auto">
              <h1 className={`text-5xl font-bold mb-6 text-${component.props.textAlign}`}>
                {component.props.title}
              </h1>
              <p className={`text-xl mb-8 text-${component.props.textAlign}`}>
                {component.props.subtitle}
              </p>
              <a
                href={component.props.buttonLink}
                className="inline-block bg-blue-600 text-white py-4 px-8 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                {component.props.buttonText}
              </a>
            </div>
          </div>
        );

      case 'text':
        return (
          <div className={`text-${component.props.fontSize} text-${component.props.textAlign}`}>
            <p style={{ color: component.props.color }}>
              {component.props.content}
            </p>
          </div>
        );

      case 'image':
        return (
          <div>
            <img
              src={component.props.src}
              alt={component.props.alt}
              style={{
                width: component.props.width,
                height: component.props.height,
                borderRadius: `${component.props.borderRadius}px`
              }}
              className="max-w-full h-auto"
            />
          </div>
        );

      case 'button':
        const buttonVariants = {
          primary: 'bg-blue-600 text-white hover:bg-blue-700',
          secondary: 'bg-gray-600 text-white hover:bg-gray-700',
          outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white'
        };

        const buttonSizes = {
          small: 'py-2 px-4 text-sm',
          medium: 'py-3 px-6',
          large: 'py-4 px-8 text-lg'
        };

        return (
          <div>
            <a
              href={component.props.link}
              className={`inline-block rounded-lg font-semibold transition-colors ${
                buttonVariants[component.props.variant as keyof typeof buttonVariants]
              } ${buttonSizes[component.props.size as keyof typeof buttonSizes]}`}
            >
              {component.props.text}
            </a>
          </div>
        );

      case 'columns':
        return (
          <div 
            className={`grid gap-${component.props.gap}`}
            style={{ gridTemplateColumns: `repeat(${component.props.columnCount}, 1fr)` }}
          >
            {Array.from({ length: parseInt(component.props.columnCount) }).map((_, index) => (
              <div key={index} className="p-4 bg-gray-100 rounded-lg">
                <p className="text-gray-600">Column {index + 1} content</p>
              </div>
            ))}
          </div>
        );

      case 'spacer':
        return (
          <div style={{ height: `${component.props.height}rem` }}></div>
        );

      case 'video':
        return (
          <div className="relative">
            <iframe
              src={component.props.src}
              width={component.props.width}
              height={component.props.height}
              allow={component.props.autoplay ? 'autoplay' : ''}
              allowFullScreen
              className="rounded-lg"
            />
          </div>
        );

      case 'gallery':
        return (
          <div 
            className={`grid gap-${component.props.gap}`}
            style={{ gridTemplateColumns: `repeat(${component.props.columns}, 1fr)` }}
          >
            {component.props.images.map((src: string, index: number) => (
              <img
                key={index}
                src={src}
                alt={`Gallery image ${index + 1}`}
                className="w-full h-48 object-cover"
                style={{ borderRadius: `${component.props.borderRadius}px` }}
              />
            ))}
          </div>
        );

      case 'testimonial':
        return (
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl mx-auto">
            <div className="flex items-center mb-4">
              {Array.from({ length: component.props.rating }).map((_, i) => (
                <span key={i} className="text-yellow-400 text-xl">★</span>
              ))}
            </div>
            <blockquote className="text-lg text-gray-700 mb-6 italic">
              "{component.props.quote}"
            </blockquote>
            <div className="flex items-center">
              <img
                src={component.props.avatar}
                alt={component.props.author}
                className="w-12 h-12 rounded-full mr-4 object-cover"
              />
              <div>
                <div className="font-semibold text-gray-900">{component.props.author}</div>
                <div className="text-gray-600 text-sm">{component.props.position}</div>
              </div>
            </div>
          </div>
        );

      case 'pricing':
        return (
          <div className={`bg-white rounded-lg shadow-lg p-8 max-w-sm mx-auto relative ${
            component.props.featured ? 'ring-2 ring-blue-500 transform scale-105' : ''
          }`}>
            {component.props.featured && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </span>
              </div>
            )}
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{component.props.title}</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">{component.props.price}</span>
                <span className="text-gray-600 ml-2">{component.props.period}</span>
              </div>
              <ul className="space-y-3 mb-8">
                {component.props.features.map((feature: string, index: number) => (
                  <li key={index} className="flex items-center">
                    <span className="text-green-500 mr-3">✓</span>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
              <a
                href={component.props.buttonLink}
                className={`block w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
                  component.props.featured
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}
              >
                {component.props.buttonText}
              </a>
            </div>
          </div>
        );

      case 'form':
        return (
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">{component.props.title}</h2>
              <p className="text-gray-600">{component.props.subtitle}</p>
            </div>
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Your full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Tell us about your project..."
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                {component.props.buttonText}
              </button>
            </form>
          </div>
        );

      case 'stats':
        return (
          <div className="bg-white py-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {component.props.stats.map((stat: any, index: number) => (
                <div key={index} className="text-center">
                  <div className="text-4xl font-bold text-blue-600 mb-2">{stat.number}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'cta':
        return (
          <div 
            className="py-16 px-8 text-center"
            style={{ backgroundColor: component.props.backgroundColor }}
          >
            <div className="max-w-4xl mx-auto">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">{component.props.title}</h2>
              <p className="text-xl text-gray-600 mb-8">{component.props.subtitle}</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href={component.props.primaryButtonLink}
                  className="bg-blue-600 text-white py-4 px-8 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  {component.props.primaryButtonText}
                </a>
                <a
                  href={component.props.secondaryButtonLink}
                  className="border-2 border-gray-300 text-gray-700 py-4 px-8 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  {component.props.secondaryButtonText}
                </a>
              </div>
            </div>
          </div>
        );

      case 'accordion':
        return (
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">{component.props.title}</h2>
            <div className="space-y-4">
              {component.props.items.map((item: any, index: number) => (
                <div key={index} className="border border-gray-200 rounded-lg">
                  <button className="w-full px-6 py-4 text-left font-semibold text-gray-900 hover:bg-gray-50 flex justify-between items-center">
                    {item.question}
                    <span className="text-gray-400">+</span>
                  </button>
                  <div className="px-6 pb-4 text-gray-600">
                    {item.answer}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'team':
        return (
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm mx-auto text-center">
            <img
              src={component.props.image}
              alt={component.props.name}
              className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
            />
            <h3 className="text-xl font-bold text-gray-900 mb-2">{component.props.name}</h3>
            <p className="text-blue-600 font-medium mb-4">{component.props.position}</p>
            <p className="text-gray-600 mb-6">{component.props.bio}</p>
            <div className="flex justify-center space-x-4">
              <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors">
                <span className="sr-only">LinkedIn</span>
                <div className="w-6 h-6 bg-gray-300 rounded"></div>
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors">
                <span className="sr-only">Twitter</span>
                <div className="w-6 h-6 bg-gray-300 rounded"></div>
              </a>
            </div>
          </div>
        );

      default:
        return <div className="p-4 bg-gray-100 rounded">Unknown component type</div>;
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`relative group transition-all ${
        isSelected 
          ? `ring-2 ${isCustomComponent ? 'ring-purple-500' : 'ring-blue-500'} ring-offset-2` 
          : 'hover:ring-1 hover:ring-gray-300'
      }`}
    >
      {renderComponent()}
      
      {/* Selection overlay */}
      {isSelected && (
        <div className="absolute top-0 right-0 -mt-2 -mr-2 flex gap-1">
          <div className="flex flex-col gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onMoveUp?.(component.id);
              }}
              disabled={!canMoveUp}
              className={`p-1 rounded text-xs transition-colors ${
                canMoveUp 
                  ? `${isCustomComponent ? 'bg-purple-500 hover:bg-purple-600' : 'bg-blue-500 hover:bg-blue-600'} text-white` 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              title="Move up"
            >
              <ChevronUp className="w-3 h-3" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onMoveDown?.(component.id);
              }}
              disabled={!canMoveDown}
              className={`p-1 rounded text-xs transition-colors ${
                canMoveDown 
                  ? `${isCustomComponent ? 'bg-purple-500 hover:bg-purple-600' : 'bg-blue-500 hover:bg-blue-600'} text-white` 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              title="Move down"
            >
              <ChevronDown className="w-3 h-3" />
            </button>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete?.(component.id);
            }}
            className="p-1 bg-red-500 text-white hover:bg-red-600 rounded text-xs transition-colors"
            title="Delete component"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  );
};