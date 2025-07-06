const User = require("../Database/Model/userSchema");
const bcrypt = require("bcrypt");
const adminSeed = async () => {
    try {
        const existingAdmin = await User.findOne({ role: 'admin' });
        if (existingAdmin) {
            console.log("Admin user already exists.");
            return;
        }
        const adminData = {
            name: "Admin User",
            email: "hospitalAdmin@gmail.com",
            password: await bcrypt.hash("admin@123", 10), // Hashing the password
            role: "admin"
        };
        const newAdmin = new User(adminData);
        await newAdmin.save();
        console.log("Admin user seeded successfully.");
    } catch (error) {
        console.error("Error seeding admin data:", error);
    }
}
module.exports = adminSeed;