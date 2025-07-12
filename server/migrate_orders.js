// // migrate_orders.js (Tạo file này trong thư mục gốc của backend và chạy bằng `node migrate_orders.js`)
// const mongoose = require("mongoose");
// const Order = require("./models/Order"); // Điều chỉnh đường dẫn tới Order model của bạn
// const User = require("./models/User"); // Điều chỉnh đường dẫn tới User model của bạn
// require("dotenv").config({ path: "./.env" }); // Đảm bảo đường dẫn tới .env là đúng

// async function migrateOrdersWithoutUserId() {
//     try {
//         const dbUri = process.env.MONGODB_URI; // Sử dụng biến môi trường cho URI
//         if (!dbUri) {
//             console.error("LỖI: MONGODB_URI không được định nghĩa trong file .env.");
//             return;
//         }

//         await mongoose.connect(dbUri, {
//             useNewUrlParser: true,
//             useUnifiedTopology: true,
//         });
//         console.log("Đã kết nối đến MongoDB để di chuyển dữ liệu.");

//         // 1. Tìm user mục tiêu để gán các đơn hàng cũ cho họ.
//         // **THAY THẾ EMAIL NÀY BẰNG EMAIL CỦA TÀI KHOẢN MÀ BẠN ĐANG DÙNG ĐỂ TEST TRÊN FRONTEND**
//         const targetUserEmail = "hoang15tq@gmail.com";
//         const targetUser = await User.findOne({ email: targetUserEmail });

//         if (!targetUser) {
//             console.error(
//                 `LỖI: Không tìm thấy người dùng mục tiêu với email '${targetUserEmail}'. Vui lòng kiểm tra email.`
//             );
//             mongoose.disconnect();
//             return;
//         }
//         console.log(`Tìm thấy người dùng mục tiêu: ${targetUser.username} (ID: ${targetUser._id})`);

//         // 2. Tìm tất cả các đơn hàng KHÔNG có trường customerInfo.userId
//         // VÀ có email khách hàng khớp với email của người dùng mục tiêu.
//         const ordersToMigrate = await Order.find({
//             "customerInfo.userId": { $exists: false },
//             "customerInfo.email": targetUser.email, // Chỉ cập nhật những đơn hàng mà email khách hàng khớp với user mục tiêu
//         });
//         console.log(
//             `Tìm thấy ${ordersToMigrate.length} đơn hàng cần di chuyển (thiếu customerInfo.userId) cho email '${targetUser.email}'.`
//         );

//         if (ordersToMigrate.length === 0) {
//             console.log("Không có đơn hàng nào cần di chuyển.");
//             mongoose.disconnect();
//             return;
//         }

//         let updatedCount = 0;
//         for (const order of ordersToMigrate) {
//             try {
//                 order.customerInfo.userId = targetUser._id; // Gán userId của user mục tiêu
//                 await order.save();
//                 console.log(`Đã cập nhật đơn hàng ID: ${order._id} với userId: ${targetUser._id}`);
//                 updatedCount++;
//             } catch (innerError) {
//                 console.error(`Lỗi khi xử lý đơn hàng ID: ${order._id}:`, innerError);
//             }
//         }

//         console.log(`Quá trình di chuyển dữ liệu hoàn tất. Đã cập nhật ${updatedCount} đơn hàng.`);
//         mongoose.disconnect();
//     } catch (error) {
//         console.error("Lỗi nghiêm trọng trong quá trình di chuyển dữ liệu:", error);
//         if (mongoose.connection.readyState === 1) {
//             // 1 means connected
//             mongoose.disconnect();
//         }
//     }
// }

// migrateOrdersWithoutUserId();
