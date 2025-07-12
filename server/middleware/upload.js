const multer = require("multer");
const path = require("path");
const fs = require("fs"); // ← thêm dòng này

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = "uploads";

        // Tạo thư mục nếu chưa cónpnp
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }

        cb(null, dir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "_" + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    },
});

const upload = multer({ storage });

module.exports = upload;
