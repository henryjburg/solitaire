const esbuild = require("esbuild");

const isDev = process.argv.includes("--serve");

const config = {
  entryPoints: ["src/index.tsx"],
  bundle: true,
  outfile: "public/bundle.js",
  sourcemap: isDev,
  minify: !isDev,
  define: {
    "process.env.NODE_ENV": isDev ? '"development"' : '"production"',
  },
};

async function run() {
  if (isDev) {
    // Create a context for continuous watch and development serving
    let ctx = await esbuild.context(config);
    
    // Watch for file modifications
    await ctx.watch();
    
    // Fire up the integrated local web server
    let server = await ctx.serve({
      servedir: "public",
      port: 3000,
    });
    
    console.log(`Server running at http://localhost:${server.port}`);
  } else {
    // Single optimization build for production deployments
    console.log("Building for production...");
    await esbuild.build(config);
    console.log("Build complete successfully.");
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
