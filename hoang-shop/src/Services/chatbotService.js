import {
    fetchProductByName,
    fetchProductById,
    fetchAllCategories,
    fetchProductsByCategorySlug,
    findCategorySlugByName,
} from "./apiService";

const extractProductName = (message) => {
    // Thêm các từ khóa/tên sản phẩm cụ thể có trong DB của bạn
    const productKeywords = [
        "iphone 15 pro max",
        "iphone 15",
        "samsung galaxy s24 ultra",
        "samsung galaxy s24",
        "macbook air",
        "macbook pro",
        "laptop gaming",
        "điện thoại",
        "tai nghe",
        "đồng hồ thông minh",
    ];

    for (const keyword of productKeywords) {
        if (message.toLowerCase().includes(keyword.toLowerCase())) {
            return keyword;
        }
    }
    return null;
};

const extractCategoryName = (message) => {
    const categoryKeywords = ["điện thoại", "laptop", "phụ kiện", "tai nghe", "đồng hồ", "tivi", "tủ lạnh", "máy giặt"];
    for (const keyword of categoryKeywords) {
        if (message.toLowerCase().includes(keyword.toLowerCase())) {
            return keyword;
        }
    }
    return null;
};

export async function processUserMessage(message) {
    const lowerCaseMessage = message.toLowerCase();
    let defaultResponse =
        "Xin lỗi, tôi chưa hiểu câu hỏi của bạn. Bạn có thể hỏi về giá, thông số, màu sắc của sản phẩm, hoặc các danh mục/thương hiệu bạn muốn xem.";

    // --- Intent: Chào hỏi ---
    if (
        lowerCaseMessage.includes("xin chào") ||
        lowerCaseMessage.includes("hi") ||
        lowerCaseMessage.includes("chào bot")
    ) {
        return "Xin chào! Tôi là chatbot hỗ trợ sản phẩm. Tôi có thể giúp gì cho bạn hôm nay?";
    }

    if (lowerCaseMessage.includes("cảm ơn") || lowerCaseMessage.includes("thanks")) {
        return "Rất vui được phục vụ bạn!";
    }

    if (
        lowerCaseMessage.includes("giá bao nhiêu") ||
        lowerCaseMessage.includes("giá của") ||
        lowerCaseMessage.includes("bao nhiêu tiền")
    ) {
        const productName = extractProductName(lowerCaseMessage);
        if (productName) {
            try {
                const products = await fetchProductByName(productName);
                if (products && products.length > 0) {
                    const product = products[0]; // Lấy sản phẩm đầu tiên tìm được
                    return `Giá của **${product.name}** là **${Number(product.discountPrice).toLocaleString()}₫**.`;
                } else {
                    return `Xin lỗi, tôi không tìm thấy sản phẩm nào có tên liên quan đến '${productName}'. Bạn có thể cung cấp tên đầy đủ hơn không?`;
                }
            } catch (error) {
                console.error("Lỗi khi lấy giá sản phẩm:", error);
                return "Xin lỗi, tôi gặp sự cố khi tìm kiếm thông tin sản phẩm này.";
            }
        } else {
            return "Bạn muốn hỏi giá của sản phẩm nào?";
        }
    }
    // --- Intent: Hỏi thông số kỹ thuật sản phẩm ---
    if (
        lowerCaseMessage.includes("thông số kỹ thuật") ||
        lowerCaseMessage.includes("cấu hình của") ||
        lowerCaseMessage.includes("specs của")
    ) {
        const productName = extractProductName(lowerCaseMessage);
        if (productName) {
            try {
                const products = await fetchProductByName(productName);
                if (products && products.length > 0) {
                    const product = products[0];
                    // Gọi API để lấy đầy đủ specs vì `search` chỉ trả về cơ bản
                    const fullProduct = await fetchProductById(product._id);

                    if (fullProduct.specs && Object.keys(fullProduct.specs).length > 0) {
                        let specsText = `Thông số kỹ thuật của **${fullProduct.name}**:\n`;
                        for (const key in fullProduct.specs) {
                            specsText += `- **${key}**: ${fullProduct.specs[key]}\n`;
                        }
                        return specsText;
                    } else {
                        return `Sản phẩm **${fullProduct.name}** không có thông số kỹ thuật chi tiết.`;
                    }
                } else {
                    return `Xin lỗi, tôi không tìm thấy sản phẩm nào có tên liên quan đến '${productName}'.`;
                }
            } catch (error) {
                console.error("Lỗi khi lấy thông số sản phẩm:", error);
                return "Xin lỗi, tôi gặp sự cố khi lấy thông số kỹ thuật sản phẩm này.";
            }
        } else {
            return "Bạn muốn hỏi thông số kỹ thuật của sản phẩm nào?";
        }
    }
    // --- Intent: Hỏi màu sắc sản phẩm ---
    if (
        lowerCaseMessage.includes("màu gì") ||
        lowerCaseMessage.includes("những màu nào") ||
        lowerCaseMessage.includes("có màu")
    ) {
        const productName = extractProductName(lowerCaseMessage);
        if (productName) {
            try {
                const products = await fetchProductByName(productName);
                if (products && products.length > 0) {
                    const product = products[0];
                    // Gọi API để lấy đầy đủ màu sắc
                    const fullProduct = await fetchProductById(product._id);
                    if (fullProduct.colors && fullProduct.colors.length > 0) {
                        return `Sản phẩm **${fullProduct.name}** có các màu: **${fullProduct.colors.join(", ")}**.`;
                    } else {
                        return `Sản phẩm **${fullProduct.name}** không có thông tin màu sắc cụ thể.`;
                    }
                } else {
                    return `Xin lỗi, tôi không tìm thấy sản phẩm nào có tên liên quan đến '${productName}'.`;
                }
            } catch (error) {
                console.error("Lỗi khi lấy màu sắc sản phẩm:", error);
                return "Xin lỗi, tôi gặp sự cố khi lấy thông tin màu sắc sản phẩm này.";
            }
        } else {
            return "Bạn muốn hỏi màu sắc của sản phẩm nào?";
        }
    }
    // --- Intent: Liệt kê tất cả danh mục ---
    if (
        lowerCaseMessage.includes("danh mục nào") ||
        lowerCaseMessage.includes("các danh mục") ||
        lowerCaseMessage.includes("loại sản phẩm")
    ) {
        try {
            const categories = await fetchAllCategories();
            if (categories && categories.length > 0) {
                const categoryNames = categories.map((cat) => `**${cat.name}**`).join(", ");
                return `Chúng tôi có các danh mục sản phẩm sau: ${categoryNames}.`;
            } else {
                return "Hiện tại không có danh mục sản phẩm nào.";
            }
        } catch (error) {
            console.error("Lỗi khi lấy danh mục:", error);
            return "Xin lỗi, tôi không thể lấy danh sách danh mục lúc này.";
        }
    }
    // --- Intent: Liệt kê sản phẩm theo danh mục ---
    if (
        lowerCaseMessage.includes("sản phẩm") &&
        (lowerCaseMessage.includes("danh mục") || lowerCaseMessage.includes("trong loại"))
    ) {
        const categoryName = extractCategoryName(lowerCaseMessage);
        if (categoryName) {
            try {
                const categorySlug = await findCategorySlugByName(categoryName);
                if (categorySlug) {
                    const products = await fetchProductsByCategorySlug(categorySlug);
                    if (products && products.length > 0) {
                        const displayProducts = products.slice(0, 5); // Hiển thị tối đa 5 sản phẩm
                        let productNames = displayProducts
                            .map((p) => `**${p.name}** (**${Number(p.discountPrice).toLocaleString()}₫**)`)
                            .join(", ");
                        if (products.length > 5) {
                            productNames += "\n(Và còn nhiều sản phẩm khác nữa trong danh mục này.)";
                        }
                        return `Đây là một số sản phẩm trong danh mục '**${categoryName}**': ${productNames}.`;
                    } else {
                        return `Hiện không có sản phẩm nào trong danh mục '**${categoryName}**'.`;
                    }
                } else {
                    return `Xin lỗi, tôi không tìm thấy danh mục '**${categoryName}**'.`;
                }
            } catch (error) {
                console.error("Lỗi khi lấy sản phẩm theo danh mục:", error);
                return "Xin lỗi, tôi gặp sự cố khi lấy sản phẩm trong danh mục này.";
            }
        } else {
            return "Bạn muốn xem sản phẩm trong danh mục nào?";
        }
    }

    return defaultResponse;
}
