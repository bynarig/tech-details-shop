/** @type {import('next').NextConfig} */
const Config = {
	experimental: {
	  middleware: {
		// Don't allow middleware to use Edge runtime
		skipMiddlewareUrlNormalize: true,
		// Force Node.js runtime for middleware
		runtime: "nodejs"
	  },
	},
  };

  export default Config;