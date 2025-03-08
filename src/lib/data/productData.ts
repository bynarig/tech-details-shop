export interface Product {
	id: string;
	name: string;
	slug: string;
	price: number;
	description: string;
	category: string;
	categorySlug: string;
	features: string[];
	specifications: Record<string, string>;
	compatibility: string[];
	images: string[];
	inStock: boolean;
	quantity?: number;
	rating?: number;
	reviews?: Review[];
  }
  
  export interface Review {
	id: string;
	user: string;
	rating: number;
	title: string;
	comment: string;
	date: string;
  }
  
  // Mock data for products
  export const products: Product[] = [
	{
	  id: "1",
	  name: "iPhone 13 Pro OLED Screen",
	  slug: "iphone-13-pro-oled-screen",
	  price: 129.99,
	  description: "Original quality OLED replacement screen for iPhone 13 Pro. Features perfect color accuracy and touch sensitivity. Includes the front camera and Face ID sensors pre-installed.",
	  category: "Screens",
	  categorySlug: "screens",
	  features: [
		"Original quality OLED panel",
		"Pre-calibrated colors",
		"Face ID sensors pre-installed",
		"Includes installation tools",
		"12-month warranty"
	  ],
	  specifications: {
		"Display Type": "OLED",
		"Resolution": "2532 x 1170 pixels",
		"Dimensions": "146.7 x 71.5 mm",
		"Glass Type": "Ceramic Shield",
		"Touch Type": "Capacitive Multi-touch"
	  },
	  compatibility: [
		"iPhone 13 Pro",
		"iPhone 13 Pro (A2483)",
		"iPhone 13 Pro (A2636)"
	  ],
	  // Update image arrays to use placeholder images
images: [
	"https://placehold.co/800x800/e9ecef/495057?text=iPhone+13+Pro+Screen+1",
	"https://placehold.co/800x800/e9ecef/495057?text=iPhone+13+Pro+Screen+2",
	"https://placehold.co/800x800/e9ecef/495057?text=iPhone+13+Pro+Screen+3"
  ],
	  inStock: true,
	  rating: 4.8,
	  reviews: [
		{
		  id: "r1",
		  user: "John D.",
		  rating: 5,
		  title: "Perfect replacement",
		  comment: "Exactly like the original screen. Installation was straightforward with the included tools.",
		  date: "2025-02-15"
		},
		{
		  id: "r2",
		  user: "Sarah M.",
		  rating: 4,
		  title: "Great quality",
		  comment: "The screen looks amazing. Only giving 4 stars because I had to calibrate the colors myself.",
		  date: "2025-01-22"
		}
	  ]
	},
	{
	  id: "2",
	  name: "Samsung Galaxy S23 Battery Replacement",
	  slug: "samsung-galaxy-s23-battery",
	  price: 49.99,
	  description: "High-capacity replacement battery for Samsung Galaxy S23. Features the same capacity as the original with improved charge cycles and performance.",
	  category: "Batteries",
	  categorySlug: "batteries",
	  features: [
		"4000 mAh capacity",
		"Original quality cells",
		"Low self-discharge",
		"No memory effect",
		"Includes adhesive and tools"
	  ],
	  specifications: {
		"Capacity": "4000 mAh",
		"Voltage": "3.85V",
		"Chemistry": "Li-ion Polymer",
		"Origin": "Premium Grade A cells",
		"Cycle Life": "800+ cycles"
	  },
	  compatibility: [
		"Samsung Galaxy S23",
		"Samsung Galaxy S23 (SM-S911B)",
		"Samsung Galaxy S23 (SM-S911U)"
	  ],
	  // Update image arrays to use placeholder images
images: [
	"https://placehold.co/800x800/e9ecef/495057?text=iPhone+13+Pro+Screen+1",
	"https://placehold.co/800x800/e9ecef/495057?text=iPhone+13+Pro+Screen+2",
	"https://placehold.co/800x800/e9ecef/495057?text=iPhone+13+Pro+Screen+3"
  ],
	  inStock: true,
	  rating: 4.5,
	  reviews: [
		{
		  id: "r3",
		  user: "Michael T.",
		  rating: 5,
		  title: "Battery life is excellent",
		  comment: "Easy to install and now my phone lasts all day again. Great replacement part!",
		  date: "2025-03-01"
		}
	  ]
	},
	{
	  id: "3",
	  name: "iPhone 14 Charging Port Flex Cable",
	  slug: "iphone-14-charging-port",
	  price: 39.99,
	  description: "Replacement charging port flex cable for iPhone 14. Resolves charging issues, audio problems, and microphone malfunctions related to the lightning port.",
	  category: "Charging Ports",
	  categorySlug: "charging-ports",
	  features: [
		"Premium quality components",
		"Fixes charging issues",
		"Restores audio functionality",
		"Includes microphone and speaker grilles",
		"Easy to install"
	  ],
	  specifications: {
		"Connector Type": "Lightning",
		"Color": "White",
		"Additional Functions": "Microphone, Speaker, Antenna",
		"Quality": "OEM Grade"
	  },
	  compatibility: [
		"iPhone 14",
		"iPhone 14 (A2649)",
		"iPhone 14 (A2881)"
	  ],
	  // Update image arrays to use placeholder images
images: [
	"https://placehold.co/800x800/e9ecef/495057?text=iPhone+13+Pro+Screen+1",
	"https://placehold.co/800x800/e9ecef/495057?text=iPhone+13+Pro+Screen+2",
	"https://placehold.co/800x800/e9ecef/495057?text=iPhone+13+Pro+Screen+3"
  ],
	  inStock: false,
	  rating: 4.7,
	  reviews: [
		{
		  id: "r4",
		  user: "Amanda L.",
		  rating: 5,
		  title: "Fixed my charging problems",
		  comment: "My iPhone wouldn't charge properly and this fixed it completely. Great quality part.",
		  date: "2025-02-10"
		},
		{
		  id: "r5",
		  user: "David R.",
		  rating: 4,
		  title: "Good replacement",
		  comment: "Works well but installation was challenging. Would recommend having a professional install this.",
		  date: "2025-01-15"
		}
	  ]
	}
  ];
  
  // Function to get product by ID
  export function getProductById(id: string): Product | undefined {
	return products.find(product => product.id === id);
  }
  
  // Function to get product by slug
  export function getProductBySlug(slug: string): Product | undefined {
	return products.find(product => product.slug === slug);
  }