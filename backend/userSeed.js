import connectToDatabase from "./db/db.js";

const checkDatabase = async () => {
    try { // Connect to database
        await connectToDatabase();
        console.log("🔗 Connected to database successfully!");

        console.log("\n" + "=".repeat(60));
        console.log("📝 EMPLOYEE MANAGEMENT SYSTEM - SETUP INSTRUCTIONS");
        console.log("=".repeat(60));
        console.log("\n✨ Database is ready!");
        console.log("\n📌 To create an admin account:");
        console.log("   1. Go to the Signup page in your application");
        console.log("   2. Fill in your details:");
        console.log("      - Name");
        console.log("      - Email");
        console.log("      - Password");
        console.log("      - Company Name");
        console.log("      - Company Description (optional)");
        console.log("   3. Click 'Sign Up'");
        console.log("\n🎉 Your admin account will be created automatically!");
        console.log("🏢 Each signup creates a new company with an admin user.");
        console.log("\n" + "=".repeat(60) + "\n");

        process.exit(0);
    } catch (error) {
        console.error("❌ Database connection error:", error.message);
        process.exit(1);
    }
};

checkDatabase();
