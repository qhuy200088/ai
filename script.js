// CẢNH BÁO: RỦI RO BẢO MẬT CAO
// Đặt Khóa API CÔNG KHAI ở đây.
const GEMINI_API_KEY = "ĐẶT_KHÓA_API_CỦA_BẠN_VÀO_ĐÂY"; // Thay thế bằng Khóa API của bạn

const ai = new GenAI({ apiKey: GEMINI_API_KEY });
const model = "gemini-2.5-flash";
const chatHistoryElement = document.getElementById('chatHistory');
const promptInput = document.getElementById('promptInput');

// Hàm thêm tin nhắn vào lịch sử chat
function addMessage(text, sender) {
    const messageContainer = document.createElement('div');
    messageContainer.className = `message ${sender}-message`;

    const bubble = document.createElement('div');
    bubble.className = 'message-bubble';
    bubble.innerText = text;

    messageContainer.appendChild(bubble);
    chatHistoryElement.appendChild(messageContainer);

    // Cuộn xuống tin nhắn mới nhất
    chatHistoryElement.scrollTop = chatHistoryElement.scrollHeight;
}

// Hàm gửi tin nhắn
async function sendMessage() {
    const prompt = promptInput.value.trim();

    if (!prompt) return;

    // 1. Thêm tin nhắn của người dùng và làm sạch ô nhập liệu
    addMessage(prompt, 'user');
    promptInput.value = ''; 
    
    // 2. Thêm bong bóng "Đang nhập..." (Tùy chọn)
    const thinkingMessage = addMessage("...", 'ai');
    
    try {
        // Gọi API Gemini
        const response = await ai.models.generateContent({
            model: model,
            contents: [prompt],
        });

        // 3. Xóa tin nhắn "Đang nhập..." và thêm câu trả lời của AI
        chatHistoryElement.removeChild(chatHistoryElement.lastChild); 
        addMessage(response.text, 'ai');

    } catch (error) {
        console.error("Lỗi khi gọi API Gemini:", error);
        
        // Cập nhật lỗi vào bong bóng cuối cùng
        chatHistoryElement.removeChild(chatHistoryElement.lastChild);
        addMessage("Lỗi: Không thể nhận được phản hồi từ AI.", 'ai');
    }
}

// Bắt sự kiện Enter để gửi tin nhắn
promptInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault(); // Ngăn xuống dòng mặc định
        sendMessage();
    }
});
