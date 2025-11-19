// CẢNH BÁO: RỦI RO BẢO MẬT CAO - Khóa API được đặt công khai
// VUI LÒNG DÙNG TÀI KHOẢN PHỤ VÀ THU HỒI KHÓA NẾU BỊ LỘ.
const GEMINI_API_KEY = "AIzaSyDf0EuCmNTvfB0dyOHF6dZIr9gQPRp6THs"; // <<< THAY THẾ KHÓA API THỰC TẾ CỦA BẠN >>>

// Khởi tạo Client và Model
const ai = new GenAI({ apiKey: GEMINI_API_KEY });
const model = "gemini-2.5-flash";

// Khởi tạo biến để lưu trữ lịch sử trò chuyện (Conversation History)
// Điều này giúp AI nhớ được ngữ cảnh các câu hỏi trước
const chat = ai.chats.create({ model: model });

// Khai báo các biến DOM toàn cục (sẽ được gán giá trị sau)
let chatHistoryElement;
let promptInput;

// Hàm thêm tin nhắn vào lịch sử chat
function addMessage(text, sender) {
    // 1. Tạo container tin nhắn
    const messageContainer = document.createElement('div');
    messageContainer.className = `message ${sender}-message`;

    // 2. Tạo bong bóng tin nhắn
    const bubble = document.createElement('div');
    bubble.className = 'message-bubble';
    
    // Sử dụng innerHTML để giữ định dạng Markdown nếu có
    bubble.innerHTML = text; 

    messageContainer.appendChild(bubble);
    chatHistoryElement.appendChild(messageContainer);

    // 3. Tự động cuộn xuống tin nhắn mới nhất
    chatHistoryElement.scrollTop = chatHistoryElement.scrollHeight;
    
    return messageContainer; // Trả về để có thể chỉnh sửa (cho bong bóng "...")
}

// Hàm gửi tin nhắn
async function sendMessage() {
    const prompt = promptInput.value.trim();

    if (!prompt) return;

    // 1. Thêm tin nhắn của người dùng và làm sạch ô nhập liệu
    addMessage(prompt, 'user');
    promptInput.value = ''; 
    promptInput.disabled = true; // Tạm thời khóa input

    // 2. Thêm bong bóng "Đang nhập..."
    const thinkingMessage = addMessage("Đang nghĩ...", 'ai');
    
    try {
        // Gọi API Gemini với lịch sử trò chuyện
        const response = await chat.sendMessage({
            message: prompt,
        });

        // 3. Xóa bong bóng "Đang nhập..." và thêm câu trả lời của AI
        thinkingMessage.remove(); 
        addMessage(response.text, 'ai');

    } catch (error) {
        console.error("Lỗi khi gọi API Gemini:", error);
        
        // Cập nhật lỗi
        thinkingMessage.remove();
        addMessage("Lỗi: Không thể nhận được phản hồi từ AI. Vui lòng kiểm tra lại Khóa API.", 'ai');
    } finally {
        promptInput.disabled = false; // Mở khóa input
        promptInput.focus(); // Tập trung lại vào ô nhập liệu
    }
}

// Hàm khởi tạo sau khi HTML đã tải xong
document.addEventListener('DOMContentLoaded', () => {
    // Gán giá trị cho các biến DOM toàn cục
    chatHistoryElement = document.getElementById('chatHistory');
    promptInput = document.getElementById('promptInput');

    // Bắt sự kiện Enter để gửi tin nhắn
    promptInput.addEventListener('keypress', function(e) {
        // Gửi khi nhấn Enter mà KHÔNG giữ Shift
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault(); // Ngăn xuống dòng mặc định
            sendMessage();
        }
    });
});
