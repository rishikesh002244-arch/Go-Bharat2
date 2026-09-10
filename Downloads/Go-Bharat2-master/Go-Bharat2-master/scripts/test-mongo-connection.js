const fs = require("fs");
// Minimal .env.local loader (dotenv is not a project dependency)
for (const line of fs.readFileSync(".env.local", "utf8").split(/\r?\n/)) {
  const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m && !(m[1] in process.env)) process.env[m[1]] = m[2].replace(/^"|"$/g, "");
}
const mongoose = require("mongoose");

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("MONGODB_URI not set");
  process.exit(1);
}

console.log("Testing connection to:", uri.replace(/:([^:@]+)@/, ":****@"));

mongoose
  .connect(uri, { serverSelectionTimeoutMS: 10000, bufferCommands: false })
  .then(async (conn) => {
    console.log("✅ CONNECTED. Host:", conn.connection.host, "DB:", conn.connection.db.databaseName);
    const collections = await conn.connection.db.listCollections().toArray();
    console.log("Collections:", collections.map((c) => c.name).join(", ") || "(none)");
    const User = conn.connection.db.collection("users");
    const count = await User.countDocuments();
    console.log("users documents:", count);
    await mongoose.disconnect();
    process.exit(0);
  })
  .catch((err) => {
    console.error("❌ CONNECTION FAILED:", err.name, "-", err.message);
    if (err.errorResponse) console.error("Details:", JSON.stringify(err.errorResponse));
    process.exit(1);
  });
