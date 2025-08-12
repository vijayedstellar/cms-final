import { ComponentDefinition } from '../types/cms';

export const componentDefinitions: ComponentDefinition[] = [
  {
    type: 'hero',
    name: 'Hero Section',
    icon: 'Layout',
    defaultProps: {
      title: 'Welcome to Our Website',
      subtitle: 'Create amazing experiences with our platform',
      backgroundImage: 'https://images.pexels.com/photos/1714208/pexels-photo-1714208.jpeg',
      buttonText: 'Get Started',
      buttonLink: '#',
      textAlign: 'center'
    },
    editableProps: [
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'subtitle', label: 'Subtitle', type: 'textarea' },
      { key: 'backgroundImage', label: 'Background Image URL', type: 'text' },
      { key: 'buttonText', label: 'Button Text', type: 'text' },
      { key: 'buttonLink', label: 'Button Link', type: 'text' },
      { key: 'textAlign', label: 'Text Alignment', type: 'select', options: ['left', 'center', 'right'] }
    ]
  },
  {
    type: 'text',
    name: 'Text Block',
    icon: 'Type',
    defaultProps: {
      content: 'Add your text content here...',
      fontSize: 'base',
      textAlign: 'left',
      color: '#000000'
    },
    editableProps: [
      { key: 'content', label: 'Content', type: 'textarea' },
      { key: 'fontSize', label: 'Font Size', type: 'select', options: ['sm', 'base', 'lg', 'xl', '2xl', '3xl'] },
      { key: 'textAlign', label: 'Text Alignment', type: 'select', options: ['left', 'center', 'right'] },
      { key: 'color', label: 'Text Color', type: 'color' }
    ]
  },
  {
    type: 'image',
    name: 'Image',
    icon: 'Image',
    defaultProps: {
      src: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg',
      alt: 'Beautiful landscape',
      width: '100%',
      height: 'auto',
      borderRadius: '0'
    },
    editableProps: [
      { key: 'src', label: 'Image URL', type: 'text' },
      { key: 'alt', label: 'Alt Text', type: 'text' },
      { key: 'width', label: 'Width', type: 'text' },
      { key: 'height', label: 'Height', type: 'text' },
      { key: 'borderRadius', label: 'Border Radius (px)', type: 'number' }
    ]
  },
  {
    type: 'button',
    name: 'Button',
    icon: 'MousePointer',
    defaultProps: {
      text: 'Click Me',
      link: '#',
      variant: 'primary',
      size: 'medium'
    },
    editableProps: [
      { key: 'text', label: 'Button Text', type: 'text' },
      { key: 'link', label: 'Link URL', type: 'text' },
      { key: 'variant', label: 'Style', type: 'select', options: ['primary', 'secondary', 'outline'] },
      { key: 'size', label: 'Size', type: 'select', options: ['small', 'medium', 'large'] }
    ]
  },
  {
    type: 'columns',
    name: 'Columns',
    icon: 'Columns',
    defaultProps: {
      columnCount: 2,
      gap: '4'
    },
    editableProps: [
      { key: 'columnCount', label: 'Number of Columns', type: 'select', options: ['1', '2', '3', '4'] },
      { key: 'gap', label: 'Gap Size', type: 'select', options: ['2', '4', '6', '8'] }
    ]
  },
  {
    type: 'spacer',
    name: 'Spacer',
    icon: 'Minus',
    defaultProps: {
      height: '4'
    },
    editableProps: [
      { key: 'height', label: 'Height (rem)', type: 'select', options: ['1', '2', '4', '6', '8', '12'] }
    ]
  },
  {
    type: 'video',
    name: 'Video',
    icon: 'Play',
    defaultProps: {
      src: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      width: '100%',
      height: '400px',
      autoplay: false,
      controls: true
    },
    editableProps: [
      { key: 'src', label: 'Video URL (YouTube/Vimeo embed)', type: 'text' },
      { key: 'width', label: 'Width', type: 'text' },
      { key: 'height', label: 'Height', type: 'text' },
      { key: 'autoplay', label: 'Autoplay', type: 'boolean' },
      { key: 'controls', label: 'Show Controls', type: 'boolean' }
    ]
  },
  {
    type: 'gallery',
    name: 'Image Gallery',
    icon: 'Images',
    defaultProps: {
      images: [
        'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg',
        'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg',
        'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg'
      ],
      columns: '3',
      gap: '4',
      borderRadius: '8'
    },
    editableProps: [
      { key: 'columns', label: 'Columns', type: 'select', options: ['1', '2', '3', '4', '5'] },
      { key: 'gap', label: 'Gap Size', type: 'select', options: ['2', '4', '6', '8'] },
      { key: 'borderRadius', label: 'Border Radius (px)', type: 'number' }
    ]
  },
  {
    type: 'testimonial',
    name: 'Testimonial',
    icon: 'Quote',
    defaultProps: {
      quote: 'This product has completely transformed our business. The results speak for themselves.',
      author: 'Sarah Johnson',
      position: 'CEO, TechCorp',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg',
      rating: 5
    },
    editableProps: [
      { key: 'quote', label: 'Quote', type: 'textarea' },
      { key: 'author', label: 'Author Name', type: 'text' },
      { key: 'position', label: 'Position/Company', type: 'text' },
      { key: 'avatar', label: 'Avatar URL', type: 'text' },
      { key: 'rating', label: 'Rating (1-5)', type: 'select', options: ['1', '2', '3', '4', '5'] }
    ]
  },
  {
    type: 'pricing',
    name: 'Pricing Card',
    icon: 'CreditCard',
    defaultProps: {
      title: 'Pro Plan',
      price: '$29',
      period: 'per month',
      features: ['10 Projects', 'Priority Support', 'Advanced Analytics', 'Custom Integrations'],
      buttonText: 'Get Started',
      buttonLink: '#',
      featured: false
    },
    editableProps: [
      { key: 'title', label: 'Plan Title', type: 'text' },
      { key: 'price', label: 'Price', type: 'text' },
      { key: 'period', label: 'Billing Period', type: 'text' },
      { key: 'buttonText', label: 'Button Text', type: 'text' },
      { key: 'buttonLink', label: 'Button Link', type: 'text' },
      { key: 'featured', label: 'Featured Plan', type: 'boolean' }
    ]
  },
  {
    type: 'form',
    name: 'Contact Form',
    icon: 'Mail',
    defaultProps: {
      title: 'Get in Touch',
      subtitle: 'We\'d love to hear from you. Send us a message and we\'ll respond as soon as possible.',
      fields: ['name', 'email', 'message'],
      buttonText: 'Send Message'
    },
    editableProps: [
      { key: 'title', label: 'Form Title', type: 'text' },
      { key: 'subtitle', label: 'Form Subtitle', type: 'textarea' },
      { key: 'buttonText', label: 'Submit Button Text', type: 'text' }
    ]
  },
  {
    type: 'stats',
    name: 'Statistics',
    icon: 'BarChart3',
    defaultProps: {
      stats: [
        { number: '10K+', label: 'Happy Customers' },
        { number: '99%', label: 'Satisfaction Rate' },
        { number: '24/7', label: 'Support Available' },
        { number: '50+', label: 'Countries Served' }
      ]
    },
    editableProps: []
  },
  {
    type: 'cta',
    name: 'Call to Action',
    icon: 'Megaphone',
    defaultProps: {
      title: 'Ready to Get Started?',
      subtitle: 'Join thousands of satisfied customers who have transformed their business with our solution.',
      primaryButtonText: 'Start Free Trial',
      primaryButtonLink: '#',
      secondaryButtonText: 'Learn More',
      secondaryButtonLink: '#',
      backgroundColor: '#f8fafc'
    },
    editableProps: [
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'subtitle', label: 'Subtitle', type: 'textarea' },
      { key: 'primaryButtonText', label: 'Primary Button Text', type: 'text' },
      { key: 'primaryButtonLink', label: 'Primary Button Link', type: 'text' },
      { key: 'secondaryButtonText', label: 'Secondary Button Text', type: 'text' },
      { key: 'secondaryButtonLink', label: 'Secondary Button Link', type: 'text' },
      { key: 'backgroundColor', label: 'Background Color', type: 'color' }
    ]
  },
  {
    type: 'accordion',
    name: 'FAQ Accordion',
    icon: 'ChevronDown',
    defaultProps: {
      title: 'Frequently Asked Questions',
      items: [
        { question: 'How does the free trial work?', answer: 'You get full access to all features for 14 days, no credit card required.' },
        { question: 'Can I cancel anytime?', answer: 'Yes, you can cancel your subscription at any time with no penalties.' },
        { question: 'Do you offer customer support?', answer: 'We provide 24/7 customer support via email, chat, and phone.' }
      ]
    },
    editableProps: [
      { key: 'title', label: 'Section Title', type: 'text' }
    ]
  },
  {
    type: 'team',
    name: 'Team Member',
    icon: 'Users',
    defaultProps: {
      name: 'Alex Thompson',
      position: 'Lead Developer',
      bio: 'Alex has over 8 years of experience in full-stack development and leads our technical team.',
      image: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
      social: {
        linkedin: '#',
        twitter: '#',
        github: '#'
      }
    },
    editableProps: [
      { key: 'name', label: 'Name', type: 'text' },
      { key: 'position', label: 'Position', type: 'text' },
      { key: 'bio', label: 'Bio', type: 'textarea' },
      { key: 'image', label: 'Profile Image URL', type: 'text' }
    ]
  }
];