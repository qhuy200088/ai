// script.js

// LƯU Ý BẢO MẬT: Khóa API được đặt công khai. Vui lòng sử dụng tài khoản phụ 
// và thu hồi khóa (revoke) ngay lập tức nếu nó bị lộ.
const GEMINI_API_KEY = "AIzaSyDf0EuCmNTvfB0dyOHF6dZIr9gQPRp6THs"; 

// Khởi tạo Client và Model
const ai = new GenAI({ apiKey: GEMINI_API_KEY });
const model = "gemini-2.5-flash";

// Khởi tạo đối tượng chat để lưu trữ lịch sử trò chuyện
const chat = ai.chats.create({ model: model });

// Khai báo các biến DOM toàn cục
let chatHistoryElement;
let promptInput;

// Hàm thêm tin nhắn vào lịch sử chat
function addMessage(text, sender) {
    const messageContainer = document.createElement('div');
    messageContainer.className = `message ${sender}-message`;

    const bubble = document.createElement('div');
    bubble.className = 'message-bubble';
    
    // Sử dụng innerHTML để giữ định dạng Markdown
    bubble.innerHTML = text; 

    messageContainer.appendChild(bubble);
    chatHistoryElement.appendChild(messageContainer);

    // Tự động cuộn xuống tin nhắn mới nhất
    chatHistoryElement.scrollTop = chatHistoryElement.scrollHeight;
    
    return messageContainer;
}

// Hàm gửi tin nhắn
async function sendMessage() {
    const prompt = promptInput.value.trim();

    if (!prompt) return;

    // 1. Thêm tin nhắn người dùng và vô hiệu hóa input
    addMessage(prompt, 'user');
    promptInput.value = ''; 
    promptInput.disabled = true;

    // 2. Thêm bong bóng "Đang nghĩ..."
    const thinkingMessage = addMessage("Đang nghĩ...", 'ai');
    
    try {
        // Gọi API Gemini với lịch sử trò chuyện
        const response = await chat.sendMessage({
            message: prompt,
        });

        // 3. Xóa bong bóng "Đang nghĩ..." và thêm câu trả lời của AI
        thinkingMessage.remove(); 
        addMessage(response.text, 'ai');

    } catch (error) {
        console.error("Lỗi khi gọi API Gemini:", error);
        
        // Cập nhật lỗi
        thinkingMessage.remove();
        addMessage("Lỗi: Không thể nhận được phản hồi từ AI. Vui lòng kiểm tra lại Khóa API hoặc kết nối mạng.", 'ai');
    } finally {
        // Mở khóa input và tập trung lại
        promptInput.disabled = false;
        promptInput.focus();
    }
}

// Hàm khởi tạo sau khi HTML đã tải xong (Khắc phục lỗi ReferenceError)
document.addEventListener('DOMContentLoaded', () => {
    // Gán giá trị cho các biến DOM toàn cục
    chatHistoryElement = document.getElementById('chatHistory');
    promptInput = document.getElementById('promptInput');

    // Thêm tin nhắn chào mừng ban đầu
    addMessage("Chào bạn! Tôi là trợ lý Gemini cá nhân của bạn. Bạn muốn trò chuyện về điều gì hôm nay?", 'ai');

    // Bắt sự kiện Enter để gửi tin nhắn
    promptInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault(); 
            sendMessage();
        }
    });
});
